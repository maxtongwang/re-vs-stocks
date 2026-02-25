#!/usr/bin/env python3
"""
scripts/check_locations.py — pre-commit location consistency checker + SEO geo updater.

Validates that every key in LOCATION_HIERARCHY (data.js) has a matching entry in:
  - LOC_CONFIG          (data.js)
  - LOC_DATA            (sim.js)
  - HPI_SERIES          (update_projection.py)  — metros only; HPI_EXCEPTIONS allowed
  - RENT_SERIES         (update_projection.py)  — metros only
  - CITY_FROM_METRO     (update_projection.py)  — cities only

Also regenerates geo.placename meta and JSON-LD about[] in index.html from the
live LOCATION_HIERARCHY, then git-stages index.html if it changed.

Exits 1 (blocking the commit) if any required entries are missing.
"""

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

DATA_JS    = ROOT / "data.js"
SIM_JS     = ROOT / "sim.js"
UPDATE_PY  = ROOT / "scripts" / "update_projection.py"
INDEX_HTML = ROOT / "index.html"

# Metros that legitimately have no FHFA HPI series in update_projection.py.
# NYC uses NY statewide HPI as a proxy instead.
HPI_EXCEPTIONS = {"nyc"}

# Cities whose actual state/abbr differs from their group in LOCATION_HIERARCHY.
GEO_CITY_OVERRIDES = {
    "hoboken": {"abbr": "NJ", "state": "New Jersey"},
}

# ── Bracket-counting block extractor ─────────────────────────────────────────


def find_block(text: str, search_from: int, open_c: str, close_c: str):
    """Find the first open_c at or after search_from; return (block, end_pos)."""
    pos = text.index(open_c, search_from)
    depth = 0
    for i in range(pos, len(text)):
        if text[i] == open_c:
            depth += 1
        elif text[i] == close_c:
            depth -= 1
        if depth == 0:
            return text[pos : i + 1], i + 1
    raise ValueError(f"Unmatched '{open_c}' starting at position {pos}")


# ── LOCATION_HIERARCHY parser ─────────────────────────────────────────────────

# State: has metros: [
STATE_RE = re.compile(
    r'\{\s*key:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*abbr:\s*"([^"]+)",\s*metros:\s*\[',
    re.DOTALL,
)
# Metro: has cities: [
METRO_RE = re.compile(
    r'\{\s*key:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*abbr:\s*"([^"]+)",\s*cities:\s*\[',
    re.DOTALL,
)
# City: no nested arrays (single-line or simple object)
CITY_RE = re.compile(
    r'\{\s*key:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*abbr:\s*"([^"]+)"\s*\}'
)


def parse_hierarchy(js_text: str) -> list:
    """Return list of state dicts with nested metros and cities."""
    hier_start = js_text.index("const LOCATION_HIERARCHY")
    hier_block, _ = find_block(js_text, hier_start, "[", "]")

    states = []
    pos = 0
    while True:
        sm = STATE_RE.search(hier_block, pos)
        if not sm:
            break

        state = {
            "key": sm.group(1),
            "label": sm.group(2),
            "abbr": sm.group(3),
            "metros": [],
        }

        # sm ends with the `[` of `metros: [` — sm.end()-1 is that `[`
        metros_block, metros_end = find_block(hier_block, sm.end() - 1, "[", "]")
        metros_inner = metros_block[1:-1]  # strip outer [ ]

        mpos = 0
        while True:
            mm = METRO_RE.search(metros_inner, mpos)
            if not mm:
                break

            metro = {
                "key": mm.group(1),
                "label": mm.group(2),
                "abbr": mm.group(3),
                "cities": [],
            }

            cities_block, _ = find_block(metros_inner, mm.end() - 1, "[", "]")
            cities_inner = cities_block[1:-1]

            for cm in CITY_RE.finditer(cities_inner):
                metro["cities"].append(
                    {"key": cm.group(1), "label": cm.group(2), "abbr": cm.group(3)}
                )

            state["metros"].append(metro)
            mpos = mm.end()

        states.append(state)
        pos = metros_end  # advance past this state's metros array

    return states


# ── Key set builders ──────────────────────────────────────────────────────────


def metro_keys(states: list) -> list[str]:
    seen = {}
    for s in states:
        for m in s["metros"]:
            seen[m["key"]] = True
    return list(seen)


def city_keys(states: list) -> list[str]:
    seen = {}
    for s in states:
        for m in s["metros"]:
            for c in m["cities"]:
                seen[c["key"]] = True
    return list(seen)


def all_loc_keys(states: list) -> list[str]:
    """All keys needing LOC_CONFIG + LOC_DATA entries (metros + cities, deduped)."""
    seen = {}
    for k in metro_keys(states) + city_keys(states):
        seen[k] = True
    return list(seen)


# ── File key extractors ───────────────────────────────────────────────────────


def loc_config_keys(data_js: str) -> set[str]:
    # LOC_CONFIG is top-level: 2-space indented keys
    block, _ = find_block(data_js, data_js.index("const LOC_CONFIG"), "{", "}")
    return set(re.findall(r"^\s{2}(\w+):\s*\{", block, re.MULTILINE))


def loc_data_keys(sim_js: str) -> set[str]:
    # LOC_DATA is inside refreshDatasets(): 4-space indented keys
    block, _ = find_block(sim_js, sim_js.index("const LOC_DATA = {"), "{", "}")
    return set(re.findall(r"^\s{4}(\w+):\s*\{", block, re.MULTILINE))


def _py_dict_keys(py_text: str, dict_name: str, key_suffix: str) -> set[str]:
    """Extract keys from a Python dict: 'KEY_<suffix>': -> return {'key'}."""
    m = re.search(rf"{dict_name}\s*=\s*\{{([^}}]+)\}}", py_text, re.DOTALL)
    if not m:
        return set()
    raw_keys = re.findall(rf'"([A-Z0-9_]+)_{key_suffix}"\s*:', m.group(1))
    return {k.lower() for k in raw_keys}


def hpi_keys(py_text: str) -> set[str]:
    return _py_dict_keys(py_text, "HPI_SERIES", "ANN")


def rent_keys(py_text: str) -> set[str]:
    return _py_dict_keys(py_text, "RENT_SERIES", "RENT_GROWTH")


def city_py_keys(py_text: str) -> set[str]:
    return _py_dict_keys(py_text, "CITY_FROM_METRO", "ANN")


# ── Validation ────────────────────────────────────────────────────────────────


def validate(states, data_js, sim_js, py_text) -> list[str]:
    errors = []

    mk = metro_keys(states)
    ck = city_keys(states)
    lk = all_loc_keys(states)

    cfg   = loc_config_keys(data_js)
    ldata = loc_data_keys(sim_js)
    hpi   = hpi_keys(py_text)
    rent  = rent_keys(py_text)
    city_py = city_py_keys(py_text)

    for k in lk:
        if k not in cfg:
            errors.append(f"  data.js        LOC_CONFIG missing: '{k}'")
        if k not in ldata:
            errors.append(f"  sim.js         LOC_DATA missing:   '{k}'")

    for k in mk:
        if k not in HPI_EXCEPTIONS and k not in hpi:
            errors.append(
                f"  update_projection.py  HPI_SERIES missing:  '{k.upper()}_ANN'"
            )
        if k not in rent:
            errors.append(
                f"  update_projection.py  RENT_SERIES missing: '{k.upper()}_RENT_GROWTH'"
            )

    for k in ck:
        if k not in city_py:
            errors.append(
                f"  update_projection.py  CITY_FROM_METRO missing: '{k.upper()}_ANN'"
            )

    return errors


# ── SEO geo builders ──────────────────────────────────────────────────────────

_ITEM_INDENT  = "          "   # 10 spaces — JSON-LD about[] items
_CLOSE_INDENT = "        "     # 8 spaces  — closing ]


def build_geo_placename(states: list) -> str:
    """Comma-separated list of all location names for geo.placename meta."""
    parts = []
    for state in states:
        if state["key"] == "national":
            continue
        abbr = state["abbr"]
        for metro in state["metros"]:
            is_statewide = metro["key"] == state["key"]
            if not is_statewide:
                parts.append(f"{metro['label']} {abbr}")
            for city in metro["cities"]:
                ov = GEO_CITY_OVERRIDES.get(city["key"], {})
                city_abbr = ov.get("abbr", abbr)
                parts.append(f"{city['label']} {city_abbr}")
        parts.append(state["label"])
    parts.append("United States")
    return ", ".join(parts)


def build_jsonld_about(states: list) -> str:
    """JSON-LD about[] array content (indented to match existing HTML)."""
    lines = []
    for state in states:
        state_name = state["label"]
        is_national = state["key"] == "national"
        for metro in state["metros"]:
            is_statewide = metro["key"] == state["key"]
            if is_national:
                name = "United States"
            elif is_statewide:
                name = state_name
            else:
                name = f"{metro['label']}, {state_name}"
            lines.append(
                f'{_ITEM_INDENT}{{ "@type": "Place", "name": "{name}" }}'
            )
            for city in metro["cities"]:
                ov = GEO_CITY_OVERRIDES.get(city["key"], {})
                city_state = ov.get("state", state_name)
                lines.append(
                    f'{_ITEM_INDENT}{{ "@type": "Place", "name": "{city["label"]}, {city_state}" }}'
                )
    return "[\n" + ",\n".join(lines) + f"\n{_CLOSE_INDENT}]"


def update_seo_geo(html: str, states: list) -> str:
    """Rewrite geo.placename and JSON-LD about[] in index.html."""
    placename = build_geo_placename(states)
    about_arr = build_jsonld_about(states)

    # geo.placename — handles multi-line <meta name=... content=...> format
    html = re.sub(
        r'(name="geo\.placename"\s*\n\s*content=")[^"]*(")',
        rf'\g<1>{placename}\g<2>',
        html,
    )

    # JSON-LD about[]
    html = re.sub(
        r'"about":\s*\[[^\]]*(?:\[[^\]]*\][^\]]*)*\]',
        f'"about": {about_arr}',
        html,
        flags=re.DOTALL,
    )

    return html


# ── Main ──────────────────────────────────────────────────────────────────────


def main():
    data_js  = DATA_JS.read_text(encoding="utf-8")
    sim_js   = SIM_JS.read_text(encoding="utf-8")
    py_text  = UPDATE_PY.read_text(encoding="utf-8")
    html     = INDEX_HTML.read_text(encoding="utf-8")

    states = parse_hierarchy(data_js)
    if not states:
        print("check_locations: WARNING — could not parse LOCATION_HIERARCHY, skipping",
              file=sys.stderr)
        sys.exit(0)

    # 1. Update SEO geo
    new_html = update_seo_geo(html, states)
    if new_html != html:
        INDEX_HTML.write_text(new_html, encoding="utf-8")
        subprocess.run(["git", "add", str(INDEX_HTML)], cwd=ROOT, check=True)
        print("check_locations: SEO geo updated in index.html")

    # 2. Validate consistency
    errors = validate(states, data_js, sim_js, py_text)
    if errors:
        print("check_locations: consistency errors — fix before committing:", file=sys.stderr)
        for e in errors:
            print(e, file=sys.stderr)
        sys.exit(1)

    print(f"check_locations: {len(all_loc_keys(states))} locations consistent ✓")


if __name__ == "__main__":
    main()
