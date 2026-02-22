#!/usr/bin/env python3
"""Monthly projection updater — fetches live data from Financial Modeling Prep.

Updates in preview.html:
  1. SP500_PRICE 2025 estimate  → actual annual return from FMP price history
  2. MORTGAGE_RATES projection  → derived from FMP 10yr Treasury + 180bps spread
  3. Displayed mortgage rate    → <strong id="proj-mort-rate">
  4. Data date                  → <!-- PROJ_DATE_START -->...<!-- PROJ_DATE_END -->

Usage:
    FMP_API_KEY=<key> python3 scripts/update_projection.py [YYYY-MM]
    (date defaults to current YYYY-MM if not supplied)
"""

import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timedelta

HTML_FILE = "preview.html"
MORT_FLOOR = 0.060
MORT_SPREAD = 0.018   # 10yr Treasury → 30yr mortgage empirical spread
BASE = "https://financialmodelingprep.com/api"


# ── HTTP helper ──────────────────────────────────────────────────────────────

def fetch(path: str, api_key: str) -> dict | list:
    sep = "&" if "?" in path else "?"
    url = f"{BASE}{path}{sep}apikey={api_key}"
    with urllib.request.urlopen(url, timeout=15) as r:
        return json.loads(r.read())


# ── S&P 500 annual price return ──────────────────────────────────────────────

def sp500_price_for_year(year: int, api_key: str) -> float | None:
    """Return (close[Dec 31 year] / close[Dec 31 year-1]) - 1 from FMP."""
    def year_end_price(y: int) -> float | None:
        # Fetch the last few trading days of December
        start = f"{y}-12-26"
        end   = f"{y+1}-01-05"
        data  = fetch(f"/v3/historical-price-full/%5EGSPC?from={start}&to={end}", api_key)
        hist  = data.get("historical", [])
        if not hist:
            return None
        # FMP returns newest first; take the last trading day ≤ Dec 31
        dec_prices = [h for h in hist if h["date"] <= f"{y}-12-31"]
        return dec_prices[0]["adjClose"] if dec_prices else None

    p_start = year_end_price(year - 1)
    p_end   = year_end_price(year)
    if p_start and p_end and p_start > 0:
        return round((p_end / p_start) - 1, 4)
    return None


# ── Mortgage rate from Treasury ───────────────────────────────────────────────

def mortgage_rate_from_treasury(api_key: str) -> float | None:
    """Derive 30yr mortgage rate from FMP 10yr Treasury + fixed spread."""
    today  = datetime.utcnow()
    start  = (today - timedelta(days=14)).strftime("%Y-%m-%d")
    end    = today.strftime("%Y-%m-%d")
    data   = fetch(f"/v4/treasury?from={start}&to={end}", api_key)
    if not data:
        return None
    # Most recent entry first; take first with a valid year10
    for entry in data:
        y10 = entry.get("year10")
        if y10 and float(y10) > 0:
            return round(float(y10) / 100 + MORT_SPREAD, 4)
    return None


# ── Glide path ────────────────────────────────────────────────────────────────

def generate_glide(start_rate: float, floor: float = MORT_FLOOR) -> list[float]:
    """20 projected annual mortgage rates: step −0.001/yr-pair down to floor."""
    current = round(start_rate, 3)
    rates = []
    for _ in range(10):
        rates += [current, current]
        current = max(floor, round(current - 0.001, 3))
    return rates


def format_rates_js(rates: list[float], indent: str = "        ") -> str:
    def fmt(r):
        s = f"{r:.3f}".rstrip("0").rstrip(".")
        return s if s else "0"
    r = [fmt(x) for x in rates]
    return (
        f"{indent}{r[0]},\n"
        f"{indent}{', '.join(r[1:11])},\n"
        f"{indent}{', '.join(r[11:])},"
    )


# ── HTML patching ─────────────────────────────────────────────────────────────

def patch_html(html: str, sp500_return: float | None,
               mort_rate: float | None, date: str) -> str:

    if sp500_return is not None:
        ret_str = str(sp500_return)
        html = re.sub(
            r"(// SP500_2025_START[^\n]*\n\s*)([-\d.]+)(,)(\s*// 2025[^\n]*)",
            rf"\g<1>{ret_str}\g<3>\g<4>",
            html,
        )

    if mort_rate is not None:
        rates     = generate_glide(mort_rate)
        new_block = format_rates_js(rates)
        rate_pct  = f"{mort_rate * 100:.2f}%"
        html = re.sub(
            r"(// PROJ_MORT_START[^\n]*\n)"
            r"(        // 2026[^\n]*\n)"
            r"([\s\S]*?)"
            r"(        // PROJ_MORT_END)",
            (
                f"// PROJ_MORT_START (auto-updated monthly from FMP treasury)\n"
                f"        // 2026–2045: glides from {mort_rate*100:.2f}% "
                f"→ {MORT_FLOOR*100:.1f}% floor "
                f"(10yr Treasury + {MORT_SPREAD*100:.0f}bps spread)\n"
                f"{new_block}\n"
                f"        // PROJ_MORT_END"
            ),
            html,
        )
        html = re.sub(
            r"<!-- PROJ_DATE_START -->.*?<!-- PROJ_DATE_END -->",
            f"<!-- PROJ_DATE_START -->{date}<!-- PROJ_DATE_END -->",
            html,
        )
        html = re.sub(
            r'(<strong id="proj-mort-rate"[^>]*>)[^<]*(</strong>)',
            rf"\g<1>{rate_pct}\g<2>",
            html,
        )

    return html


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    api_key = os.environ.get("FMP_API_KEY", "").strip()
    if not api_key:
        print("ERROR: FMP_API_KEY env var not set", file=sys.stderr)
        sys.exit(1)

    date = sys.argv[1] if len(sys.argv) > 1 else datetime.utcnow().strftime("%Y-%m")

    # Determine which year's S&P return to update (last completed calendar year)
    est_year = int(date[:4]) - 1   # e.g. running in 2026 → update 2025

    print(f"Fetching S&P 500 {est_year} annual return from FMP…")
    sp_ret = sp500_price_for_year(est_year, api_key)
    print(f"  → {sp_ret}" if sp_ret is not None else "  → fetch failed, skipping")

    print("Fetching 10yr Treasury rate from FMP…")
    mort = mortgage_rate_from_treasury(api_key)
    print(f"  → {mort*100:.2f}%" if mort is not None else "  → fetch failed, skipping")

    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    html = patch_html(html, sp_ret, mort, date)

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Done. date={date}, sp500_{est_year}={sp_ret}, mortgage={mort}")


if __name__ == "__main__":
    main()
