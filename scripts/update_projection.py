#!/usr/bin/env python3
"""Monthly projection updater — fetches live data from FMP and FRED.

Updates in index.html:
  1. SP500_PRICE current-year estimate  → actual annual return from FMP price history
  2. MORTGAGE_RATES projection          → derived from FMP 10yr Treasury + 180bps spread
  3. Displayed mortgage rate            → <strong id="proj-mort-rate">
  4. Data date                          → <!-- PROJ_DATE_START -->...<!-- PROJ_DATE_END -->
  5. {LOC}_ANN estimates (12 locations) → FHFA Q4-to-Q4 HPI annual return via FRED
  6. {LOC}_RENT_GROWTH estimates        → BLS CPI rent Dec-to-Dec via FRED

Usage:
    FMP_API_KEY=<key> FRED_API_KEY=<key> python3 scripts/update_projection.py [YYYY-MM]
    (date defaults to current YYYY-MM if not supplied)
    FRED_API_KEY is optional; FHFA/BLS updates skipped if absent.
    Free FRED API keys: https://fred.stlouisfed.org/docs/api/api_key.html
"""

import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timedelta

HTML_FILE = "index.html"
MORT_FLOOR = 0.060
MORT_SPREAD = 0.018   # 10yr Treasury → 30yr mortgage empirical spread
FMP_BASE = "https://financialmodelingprep.com/api"
FRED_BASE = "https://api.stlouisfed.org/fred/series/observations"

# ── FRED series for FHFA HPI (Q4-to-Q4 annual return) ───────────────────────
# State-level HPI uses quarterly All-Transactions series
# Metro-level uses MSAD (Metropolitan Division) codes
HPI_SERIES = {
    "OC_ANN":       "ATNHPIUS11244Q",  # Anaheim-Santa Ana-Irvine MSAD (OC)
    "LA_ANN":       "ATNHPIUS31084Q",  # LA-Long Beach-Glendale MSAD
    "SD_ANN":       "ATNHPIUS41740Q",  # San Diego MSA
    "SF_ANN":       "ATNHPIUS41884Q",  # SF-San Mateo-Redwood City MSAD
    "CA_ANN":       "CASTHPI",         # California statewide
    "DFW_ANN":      "ATNHPIUS19124Q",  # Dallas-Plano-Irving MSAD
    "TX_ANN":       "TXSTHPI",         # Texas statewide
    "MIAMI_ANN":    "ATNHPIUS33124Q",  # Miami-Miami Beach-Kendall MSAD
    "FL_ANN":       "FLSTHPI",         # Florida statewide
    "SEATTLE_ANN":  "ATNHPIUS42644Q",  # Seattle-Bellevue-Kent MSAD
    "WA_ANN":       "WASTHPI",         # Washington statewide
    "NY_ANN":       "NYSTHPI",         # New York statewide
    "NATIONAL_ANN": "USSTHPI",         # National FHFA HPI
    # NYC_ANN: no single FHFA series matches; skip
}

# ── FRED series for BLS CPI rent (Dec-to-Dec annual growth) ─────────────────
RENT_SERIES = {
    "OC_RENT_GROWTH":       "CUURA421SEHA",  # LA/OC metro (BLS doesn't separate OC)
    "LA_RENT_GROWTH":       "CUURA421SEHA",  # LA metro BLS CPI rent
    "SF_RENT_GROWTH":       "CUURA422SEHA",  # SF metro BLS CPI rent
    "SD_RENT_GROWTH":       "CUUR0400SEHA",  # West region (SD uses West CPI)
    "CA_RENT_GROWTH":       "CUUR0400SEHA",  # West region (proxy for CA)
    "DFW_RENT_GROWTH":      "CUURA316SEHA",  # Dallas metro BLS CPI rent
    "TX_RENT_GROWTH":       "CUUR0300SEHA",  # South region (proxy for TX)
    "MIAMI_RENT_GROWTH":    "CUURA320SEHA",  # Miami metro BLS CPI rent
    "FL_RENT_GROWTH":       "CUUR0300SEHA",  # South region (proxy for FL)
    "SEATTLE_RENT_GROWTH":  "CUURA423SEHA",  # Seattle metro BLS CPI rent
    "WA_RENT_GROWTH":       "CUUR0400SEHA",  # West region (proxy for WA)
    "NYC_RENT_GROWTH":      "CUUR0100SEHA",  # Northeast region (dominated by NYC)
    "NY_RENT_GROWTH":       "CUUR0100SEHA",  # Northeast region (proxy for NY)
    "NATIONAL_RENT_GROWTH": "CUUR0000SEHA",  # National CPI rent
}


# ── HTTP helper ───────────────────────────────────────────────────────────────

def fetch_url(url: str) -> dict | list:
    with urllib.request.urlopen(url, timeout=15) as r:
        return json.loads(r.read())


def fetch_fmp(path: str, api_key: str) -> dict | list:
    sep = "&" if "?" in path else "?"
    return fetch_url(f"{FMP_BASE}{path}{sep}apikey={api_key}")


def fetch_fred(series_id: str, start: str, end: str, fred_key: str) -> dict:
    url = (
        f"{FRED_BASE}?series_id={series_id}"
        f"&observation_start={start}&observation_end={end}"
        f"&api_key={fred_key}&file_type=json"
    )
    return fetch_url(url)


# ── S&P 500 annual price return (FMP) ────────────────────────────────────────

def sp500_price_for_year(year: int, api_key: str) -> float | None:
    """Return (close[Dec 31 year] / close[Dec 31 year-1]) - 1 from FMP."""
    def year_end_price(y: int) -> float | None:
        start = f"{y}-12-26"
        end   = f"{y+1}-01-05"
        data  = fetch_fmp(f"/v3/historical-price-full/%5EGSPC?from={start}&to={end}", api_key)
        hist  = data.get("historical", [])
        if not hist:
            return None
        dec_prices = [h for h in hist if h["date"] <= f"{y}-12-31"]
        return dec_prices[0]["adjClose"] if dec_prices else None

    p_start = year_end_price(year - 1)
    p_end   = year_end_price(year)
    if p_start and p_end and p_start > 0:
        return round((p_end / p_start) - 1, 4)
    return None


# ── Mortgage rate from Treasury (FMP) ────────────────────────────────────────

def mortgage_rate_from_treasury(api_key: str) -> float | None:
    """Derive 30yr mortgage rate from FMP 10yr Treasury + fixed spread."""
    today  = datetime.utcnow()
    start  = (today - timedelta(days=14)).strftime("%Y-%m-%d")
    end    = today.strftime("%Y-%m-%d")
    data   = fetch_fmp(f"/v4/treasury?from={start}&to={end}", api_key)
    if not data:
        return None
    for entry in data:
        y10 = entry.get("year10")
        if y10 and float(y10) > 0:
            return round(float(y10) / 100 + MORT_SPREAD, 4)
    return None


# ── FHFA HPI annual return (FRED) ────────────────────────────────────────────

def hpi_annual_return(series_id: str, year: int, fred_key: str) -> float | None:
    """Compute Q4-to-Q4 FHFA annual return. Q4 is labeled YYYY-10-01 on FRED."""
    try:
        start = f"{year-1}-10-01"
        end   = f"{year}-12-31"
        data  = fetch_fred(series_id, start, end, fred_key)
        obs   = {
            o["date"]: float(o["value"])
            for o in data.get("observations", [])
            if o["value"] != "."
        }
        q4_prev = obs.get(f"{year-1}-10-01")
        q4_curr = obs.get(f"{year}-10-01")
        if q4_prev and q4_curr and q4_prev > 0:
            return round((q4_curr / q4_prev) - 1, 4)
    except Exception as e:
        print(f"    FRED HPI fetch error ({series_id}): {e}")
    return None


# ── BLS CPI rent annual growth (FRED) ────────────────────────────────────────

def rent_growth_annual(series_id: str, year: int, fred_key: str) -> float | None:
    """Compute Dec-to-Dec annual rent growth from BLS CPI series on FRED."""
    try:
        start = f"{year-1}-12-01"
        end   = f"{year}-12-31"
        data  = fetch_fred(series_id, start, end, fred_key)
        obs   = {
            o["date"]: float(o["value"])
            for o in data.get("observations", [])
            if o["value"] != "."
        }
        dec_prev = obs.get(f"{year-1}-12-01")
        dec_curr = obs.get(f"{year}-12-01")
        if dec_prev and dec_curr and dec_prev > 0:
            return round((dec_curr / dec_prev) - 1, 4)
    except Exception as e:
        print(f"    FRED rent fetch error ({series_id}): {e}")
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


# ── HTML patching helpers ─────────────────────────────────────────────────────

def patch_loc_estimate(html: str, var_name: str, new_val: float, year: int) -> str:
    """Update the year's (estimate) or (preliminary) value inside a JS array.

    Matches:  <number>,  // {year} (estimate|preliminary...)
    inside:   const {var_name} = [ ... ]
    """
    pattern = (
        rf"(?s)(const {re.escape(var_name)}\s*=\s*\[.*?)"
        rf"([-+]?\d*\.?\d+)"
        rf"(,\s*//\s*{year}[^\n]*(?:preliminary|estimate)[^\n]*)"
    )
    val_str = str(new_val)
    new_html, n = re.subn(pattern, rf"\g<1>{val_str}\g<3>", html)
    if n == 0:
        print(f"    WARNING: no {year} (estimate/preliminary) marker found in {var_name}")
    return new_html


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
    fmp_key  = os.environ.get("FMP_API_KEY", "").strip()
    fred_key = os.environ.get("FRED_API_KEY", "").strip()

    if not fmp_key:
        print("ERROR: FMP_API_KEY env var not set", file=sys.stderr)
        sys.exit(1)

    if not fred_key:
        print("WARNING: FRED_API_KEY not set — FHFA/BLS updates will be skipped")

    date     = sys.argv[1] if len(sys.argv) > 1 else datetime.utcnow().strftime("%Y-%m")
    est_year = int(date[:4]) - 1   # e.g. running in 2026 → update 2025

    # ── FMP: S&P 500 annual return ─────────────────────────────────────────────
    print(f"Fetching S&P 500 {est_year} annual return from FMP…")
    sp_ret = sp500_price_for_year(est_year, fmp_key)
    print(f"  → {sp_ret}" if sp_ret is not None else "  → fetch failed, skipping")

    # ── FMP: mortgage rate from Treasury ──────────────────────────────────────
    print("Fetching 10yr Treasury rate from FMP…")
    mort = mortgage_rate_from_treasury(fmp_key)
    print(f"  → {mort*100:.2f}%" if mort is not None else "  → fetch failed, skipping")

    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    html = patch_html(html, sp_ret, mort, date)

    # ── FRED: FHFA HPI annual returns for all locations ───────────────────────
    if fred_key:
        print(f"\nFetching FHFA HPI {est_year} Q4-to-Q4 returns from FRED…")
        for var_name, series_id in HPI_SERIES.items():
            ret = hpi_annual_return(series_id, est_year, fred_key)
            if ret is not None:
                print(f"  {var_name} ({series_id}): {ret:+.4f}")
                html = patch_loc_estimate(html, var_name, ret, est_year)
            else:
                print(f"  {var_name} ({series_id}): no data yet, skipping")

        # ── FRED: BLS CPI rent growth for all locations ────────────────────────
        print(f"\nFetching BLS CPI rent growth {est_year} Dec-to-Dec from FRED…")
        seen_series: dict[str, float | None] = {}  # cache to avoid duplicate fetches
        for var_name, series_id in RENT_SERIES.items():
            if series_id not in seen_series:
                seen_series[series_id] = rent_growth_annual(series_id, est_year, fred_key)
            ret = seen_series[series_id]
            if ret is not None:
                print(f"  {var_name} ({series_id}): {ret:+.4f}")
                html = patch_loc_estimate(html, var_name, ret, est_year)
            else:
                print(f"  {var_name} ({series_id}): no data yet, skipping")

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"\nDone. date={date}, sp500_{est_year}={sp_ret}, mortgage={mort}")


if __name__ == "__main__":
    main()
