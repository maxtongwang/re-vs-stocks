#!/usr/bin/env python3
"""Update projected 30yr mortgage rate glide path in preview.html.

Usage:
    python3 scripts/update_projection.py <rate_decimal> <YYYY-MM>

Example:
    python3 scripts/update_projection.py 0.0689 2026-02

The script:
  1. Generates a 20-value glide path from current rate → 6.0% floor
     (drops 0.001 per pair of years, then flat at floor)
  2. Replaces the block between // PROJ_MORT_START and // PROJ_MORT_END
  3. Updates <!-- PROJ_DATE_START -->...<!-- PROJ_DATE_END -->
  4. Updates <strong id="proj-mort-rate">...</strong>
"""

import re
import sys

FLOOR = 0.060
HTML_FILE = "preview.html"


def generate_glide(start_rate: float, floor: float = FLOOR) -> list[float]:
    """20 annual projected rates gliding from start_rate down to floor."""
    current = round(start_rate, 3)
    rates = []
    for _ in range(10):  # 10 pairs = 20 entries
        rates += [current, current]
        current = max(floor, round(current - 0.001, 3))
    return rates


def format_rates_js(rates: list[float], indent: str = "        ") -> str:
    """Format 20 rates as three JS lines matching existing code style."""
    def fmt(r):
        # Omit trailing zero for whole-percent values (e.g. 0.06 not 0.060)
        return str(r).rstrip("0").rstrip(".") if "." in str(r) else str(r)

    r = [fmt(x) for x in rates]
    line1 = f"{indent}{r[0]},"
    line2 = f"{indent}{', '.join(r[1:11])},"
    line3 = f"{indent}{', '.join(r[11:])},"
    return f"{line1}\n{line2}\n{line3}"


def main():
    if len(sys.argv) < 3:
        print("Usage: update_projection.py <rate_decimal> <YYYY-MM>", file=sys.stderr)
        sys.exit(1)

    rate = float(sys.argv[1])
    date = sys.argv[2]
    rate_pct = f"{rate * 100:.2f}%"

    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    rates = generate_glide(rate)
    new_rates = format_rates_js(rates)

    # Replace projected mortgage rate block
    html = re.sub(
        r"(// PROJ_MORT_START[^\n]*\n)"
        r"(        // 2026[^\n]*\n)"
        r"([\s\S]*?)"
        r"(        // PROJ_MORT_END)",
        (
            f"// PROJ_MORT_START (auto-updated monthly from FRED MORTGAGE30US)\n"
            f"        // 2026–2045: glides from {rate * 100:.2f}% → {FLOOR * 100:.1f}% floor"
            f" (CBO/MBA consensus; no 20yr futures)\n"
            f"{new_rates}\n"
            f"        // PROJ_MORT_END"
        ),
        html,
    )

    # Replace date marker
    html = re.sub(
        r"<!-- PROJ_DATE_START -->.*?<!-- PROJ_DATE_END -->",
        f"<!-- PROJ_DATE_START -->{date}<!-- PROJ_DATE_END -->",
        html,
    )

    # Replace displayed mortgage rate
    html = re.sub(
        r'(<strong id="proj-mort-rate"[^>]*>)[^<]*(</strong>)',
        rf"\g<1>{rate_pct}\g<2>",
        html,
    )

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Updated: rate={rate_pct}, date={date}")
    print(f"Projected rates: {rates}")


if __name__ == "__main__":
    main()
