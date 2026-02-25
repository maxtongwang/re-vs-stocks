#!/usr/bin/env python3
"""Monthly projection updater — fetches live data from FMP and FRED.

Updates in data.js:
  1. SP500_PRICE current-year estimate  → actual annual return from FMP price history
  2. MORTGAGE_RATES projection          → derived from FMP 10yr Treasury + 180bps spread
  3. DATA_THROUGH_YEAR/MONTH            → current date marker
  4. {LOC}_ANN estimates (12 metros)    → FHFA Q4-to-Q4 HPI annual return via FRED
  5. {LOC}_RENT_GROWTH estimates        → BLS CPI rent Dec-to-Dec via FRED
  6. City _ANN/_RENT_GROWTH estimates   → derived from parent metro × city scale factor
  7. CS_{LOC}_ANN estimates (8 metros)  → S&P CS HPI Dec-to-Dec annual return via FRED

Updates in index.html:
  7. Displayed mortgage rate            → <strong id="proj-mort-rate">
  8. Data date                          → <!-- PROJ_DATE_START -->...<!-- PROJ_DATE_END -->

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

HTML_FILE = "index.html"   # HTML-only patches (proj-mort-rate display, date)
DATA_FILE = "data.js"     # JS array patches (price/rent arrays, SP500, mortgage rates)
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

# ── FRED series for S&P CS HPI (Dec-to-Dec annual return, monthly NSA) ──────
CS_HPI_SERIES = {
    "CS_LA_ANN":       "LXXRSA",      # S&P CS Los Angeles Metro
    "CS_SD_ANN":       "SDXRSA",      # S&P CS San Diego Metro
    "CS_SF_ANN":       "SFXRSA",      # S&P CS San Francisco Metro
    "CS_SEATTLE_ANN":  "SEXRSA",      # S&P CS Seattle Metro
    "CS_MIAMI_ANN":    "MIAXRSA",     # S&P CS Miami Metro
    "CS_DALLAS_ANN":   "DAXRSA",      # S&P CS Dallas Metro
    "CS_NY_ANN":       "NYXRSA",      # S&P CS New York Metro
    "CS_NATIONAL_ANN": "CSUSHPINSA",  # S&P CS U.S. National (NSA)
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

# ── City data scaling — derived from parent metro FHFA/BLS values ────────────
# FHFA does not publish city-level HPI; cities use parent metro × scale_factor.
# scale_factor reflects luxury premium cyclicality (boom amplification).
# Format: city_var → (parent_hpi_var, price_scale, parent_rent_var, rent_scale)
CITY_FROM_METRO = {
    # OC cities
    "NB_ANN":              ("OC_ANN",      1.12, "OC_RENT_GROWTH",      0.90),
    "IRVINE_ANN":          ("OC_ANN",      1.05, "OC_RENT_GROWTH",      1.08),
    "YORBA_ANN":           ("OC_ANN",      0.95, "OC_RENT_GROWTH",      0.96),
    "LAGUNA_ANN":          ("OC_ANN",      1.15, "OC_RENT_GROWTH",      0.85),
    "HB_ANN":              ("OC_ANN",      0.98, "OC_RENT_GROWTH",      1.02),
    # LA cities
    "BEVHILLS_ANN":        ("LA_ANN",      1.10, "LA_RENT_GROWTH",      0.88),
    "SM_ANN":              ("LA_ANN",      1.06, "LA_RENT_GROWTH",      0.93),
    "MALIBU_ANN":          ("LA_ANN",      1.18, "LA_RENT_GROWTH",      0.72),
    "PASADENA_ANN":        ("LA_ANN",      0.96, "LA_RENT_GROWTH",      1.02),
    "MB_ANN":              ("LA_ANN",      1.08, "LA_RENT_GROWTH",      0.91),
    # SD cities
    "LAJOLLA_ANN":         ("SD_ANN",      1.10, "SD_RENT_GROWTH",      0.92),
    "DELMAR_ANN":          ("SD_ANN",      1.13, "SD_RENT_GROWTH",      0.87),
    "RSF_ANN":             ("SD_ANN",      1.22, "SD_RENT_GROWTH",      0.72),
    "CORONADO_ANN":        ("SD_ANN",      1.11, "SD_RENT_GROWTH",      0.90),
    "CARLSBAD_ANN":        ("SD_ANN",      1.01, "SD_RENT_GROWTH",      1.04),
    # SF cities
    "PALOALTO_ANN":        ("SF_ANN",      1.25, "SF_RENT_GROWTH",      1.12),
    "ATHERTON_ANN":        ("SF_ANN",      1.38, "SF_RENT_GROWTH",      0.80),
    "LOSALTOS_ANN":        ("SF_ANN",      1.22, "SF_RENT_GROWTH",      1.06),
    "MENLOPARK_ANN":       ("SF_ANN",      1.18, "SF_RENT_GROWTH",      1.10),
    "SARATOGA_ANN":        ("SF_ANN",      1.14, "SF_RENT_GROWTH",      0.96),
    # DFW cities
    "HIGHLANDPARK_ANN":    ("DFW_ANN",     1.15, "DFW_RENT_GROWTH",     0.88),
    "UNIVERSITYPK_ANN":    ("DFW_ANN",     1.10, "DFW_RENT_GROWTH",     0.90),
    "SOUTHLAKE_ANN":       ("DFW_ANN",     1.07, "DFW_RENT_GROWTH",     0.92),
    "FRISCO_ANN":          ("DFW_ANN",     1.05, "DFW_RENT_GROWTH",     1.05),
    "PLANO_ANN":           ("DFW_ANN",     1.03, "DFW_RENT_GROWTH",     1.02),
    # Miami cities
    "MIAMIBEACH_ANN":      ("MIAMI_ANN",   1.16, "MIAMI_RENT_GROWTH",   1.05),
    "CORALGABLES_ANN":     ("MIAMI_ANN",   1.07, "MIAMI_RENT_GROWTH",   0.98),
    "KEYBISCAYNE_ANN":     ("MIAMI_ANN",   1.19, "MIAMI_RENT_GROWTH",   0.90),
    "COCONUTGROVE_ANN":    ("MIAMI_ANN",   1.09, "MIAMI_RENT_GROWTH",   1.00),
    "BRICKELL_ANN":        ("MIAMI_ANN",   1.05, "MIAMI_RENT_GROWTH",   1.05),
    # Seattle cities
    "MEDINA_ANN":          ("SEATTLE_ANN", 1.30, "SEATTLE_RENT_GROWTH", 0.82),
    "MERCERISLAND_ANN":    ("SEATTLE_ANN", 1.20, "SEATTLE_RENT_GROWTH", 0.92),
    "BELLEVUE_ANN":        ("SEATTLE_ANN", 1.14, "SEATTLE_RENT_GROWTH", 1.06),
    "KIRKLAND_ANN":        ("SEATTLE_ANN", 1.09, "SEATTLE_RENT_GROWTH", 1.10),
    "REDMOND_ANN":         ("SEATTLE_ANN", 1.07, "SEATTLE_RENT_GROWTH", 1.12),
    # NYC cities
    "MANHATTAN_ANN":       ("NY_ANN",      1.12, "NYC_RENT_GROWTH",     1.12),
    "BROOKLYN_ANN":        ("NY_ANN",      1.18, "NYC_RENT_GROWTH",     1.18),
    "HOBOKEN_ANN":         ("NY_ANN",      1.07, "NYC_RENT_GROWTH",     1.25),
    "SCARSDALE_ANN":       ("NY_ANN",      1.05, "NYC_RENT_GROWTH",     0.95),
    "GREATNECK_ANN":       ("NY_ANN",      1.04, "NYC_RENT_GROWTH",     0.98),
}

# ── LOCATION EXPANSION CHECKLIST ─────────────────────────────────────────────
# Every time you add a new metro or city, update ALL of these:
#
# Adding a NEW METRO:
#   data.js  1. Add {LOC}_ANN / {LOC}_RENT_GROWTH data arrays (backfilled history)
#            2. Add LOC_CONFIG[key] entry (improvPct, sources[], startYear, …)
#            3. Add entry to LOCATION_HIERARCHY metros[] under correct state
#   sim.js   4. Add {LOC}: [...] entry to LOC_DATA map
#   here     5. Add "{LOC}_ANN": "FRED_SERIES_ID" to HPI_SERIES above
#            6. Add "{LOC}_RENT_GROWTH": "FRED_SERIES_ID" to RENT_SERIES above
#   index.html 7. Bump ?v= cache-buster on all 5 asset refs (themes/style/data/sim/ui)
#
# Adding a NEW CITY (derived from existing metro):
#   data.js  1. Add {CITY}_ANN / {CITY}_RENT_GROWTH data arrays (backfilled history)
#            2. Add LOC_CONFIG[key] entry
#            3. Push { key, label, abbr } to the parent metro's cities[] in LOCATION_HIERARCHY
#   sim.js   4. Add {CITY}: [...] entry to LOC_DATA map
#   here     5. Add "{CITY}_ANN": (parent_hpi, price_scale, parent_rent, rent_scale)
#               to CITY_FROM_METRO above
#   index.html 6. Bump ?v= cache-buster
#
# Monthly auto-update (this script) handles automatically once registered above:
#   • SP500/NASDAQ/TLT current-year returns      (FMP — no registration needed)
#   • MORTGAGE_RATES projection array            (FMP — no registration needed)
#   • DATA_THROUGH_YEAR/MONTH marker in data.js  (auto)
#   • <strong id="proj-mort-rate"> in index.html (auto)
#   • <!-- PROJ_DATE_START/END --> in index.html (auto)
#   • All HPI_SERIES metros → {LOC}_ANN in data.js
#   • All CS_HPI_SERIES metros → CS_{LOC}_ANN in data.js
#   • All RENT_SERIES metros → {LOC}_RENT_GROWTH in data.js
#   • All CITY_FROM_METRO cities → derived from parent × scale factors
# ─────────────────────────────────────────────────────────────────────────────


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

def _annual_return(ticker: str, year: int, api_key: str) -> float | None:
    """Return (adjClose[Dec 31 year] / adjClose[Dec 31 year-1]) - 1 from FMP."""
    def year_end_close(y: int) -> float | None:
        start = f"{y}-12-26"
        end   = f"{y+1}-01-05"
        data  = fetch_fmp(f"/v3/historical-price-full/{ticker}?from={start}&to={end}", api_key)
        hist  = data.get("historical", [])
        if not hist:
            return None
        dec_prices = [h for h in hist if h["date"] <= f"{y}-12-31"]
        return dec_prices[0]["adjClose"] if dec_prices else None

    p_start = year_end_close(year - 1)
    p_end   = year_end_close(year)
    if p_start and p_end and p_start > 0:
        return round((p_end / p_start) - 1, 4)
    return None


def sp500_price_for_year(year: int, api_key: str) -> float | None:
    """Return S&P 500 price return for a completed year."""
    return _annual_return("%5EGSPC", year, api_key)


def _ytd_return(ticker: str, year: int, api_key: str) -> float | None:
    """Generic YTD return: (latest close / Dec 31 prev year close) - 1."""
    def year_end_close(y: int) -> float | None:
        start = f"{y}-12-26"
        end   = f"{y+1}-01-05"
        data  = fetch_fmp(f"/v3/historical-price-full/{ticker}?from={start}&to={end}", api_key)
        hist  = data.get("historical", [])
        dec_prices = [h for h in hist if h["date"] <= f"{y}-12-31"]
        return dec_prices[0]["adjClose"] if dec_prices else None

    def latest_close() -> float | None:
        today = datetime.utcnow()
        start = (today - timedelta(days=10)).strftime("%Y-%m-%d")
        end   = today.strftime("%Y-%m-%d")
        data  = fetch_fmp(f"/v3/historical-price-full/{ticker}?from={start}&to={end}", api_key)
        hist  = data.get("historical", [])
        return hist[0]["adjClose"] if hist else None

    p_start = year_end_close(year - 1)
    p_end   = latest_close()
    if p_start and p_end and p_start > 0:
        return round((p_end / p_start) - 1, 4)
    return None


def sp500_ytd_return(year: int, api_key: str) -> float | None:
    """YTD price return for S&P 500 (^GSPC)."""
    return _ytd_return("%5EGSPC", year, api_key)


def nasdaq_ytd_return(year: int, api_key: str) -> float | None:
    """YTD price return for NASDAQ Composite (^IXIC)."""
    return _ytd_return("%5EIXIC", year, api_key)


def tlt_ytd_return(year: int, api_key: str) -> float | None:
    """YTD total return for TLT (iShares 20+ yr Treasury ETF, adjClose includes distributions)."""
    return _ytd_return("TLT", year, api_key)


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


# ── S&P CS HPI annual return (FRED, monthly Dec-to-Dec) ──────────────────────

def cs_hpi_annual_return(series_id: str, year: int, fred_key: str) -> float | None:
    """Compute Dec-to-Dec CS HPI annual return from monthly FRED series."""
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
        print(f"    FRED CS HPI fetch error ({series_id}): {e}")
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


def _patch_marker(html: str, start_tag: str, new_val: float) -> str:
    """Replace the value on the line immediately after // {start_tag}."""
    val_str = str(new_val)
    return re.sub(
        rf"(// {re.escape(start_tag)}[^\n]*\n\s*)([-\d.]+)(,)(\s*//[^\n]*)",
        rf"\g<1>{val_str}\g<3>\g<4>",
        html,
    )


def patch_html(html: str,
               sp500_return: float | None, sp500_cur: float | None,
               nasdaq_return: float | None, nasdaq_cur: float | None,
               tlt_return: float | None, tlt_cur: float | None,
               mort_rate: float | None, date: str,
               data_through_year: int | None = None,
               data_through_month: int | None = None) -> str:

    if sp500_return is not None:
        html = _patch_marker(html, "SP500_2025_START", sp500_return)

    if nasdaq_return is not None:
        html = _patch_marker(html, "NASDAQ_2025_START", nasdaq_return)

    if tlt_return is not None:
        html = _patch_marker(html, "TLT_2025_START", tlt_return)

    if mort_rate is not None:
        rates     = generate_glide(mort_rate)
        new_block = format_rates_js(rates)
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
    # Update current-year (live) YTD estimates — all three indices together
    if sp500_cur is not None:
        html = _patch_marker(html, "SP500_CUR_START", sp500_cur)
    if nasdaq_cur is not None:
        html = _patch_marker(html, "NASDAQ_CUR_START", nasdaq_cur)
    if tlt_cur is not None:
        html = _patch_marker(html, "TLT_CUR_START", tlt_cur)

    # Update DATA_THROUGH marker
    if data_through_year is not None and data_through_month is not None:
        html = re.sub(
            r"const DATA_THROUGH_YEAR = \d+, DATA_THROUGH_MONTH = \d+;[^\n]*// DATA_THROUGH_MARKER",
            f"const DATA_THROUGH_YEAR = {data_through_year}, DATA_THROUGH_MONTH = {data_through_month}; // DATA_THROUGH_MARKER",
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

    # ── FMP: prior-year annual returns ────────────────────────────────────────
    print(f"Fetching S&P 500 {est_year} annual return from FMP…")
    sp_ret = sp500_price_for_year(est_year, fmp_key)
    print(f"  → {sp_ret}" if sp_ret is not None else "  → fetch failed, skipping")

    print(f"Fetching NASDAQ {est_year} annual return from FMP…")
    nasdaq_ret = _annual_return("%5EIXIC", est_year, fmp_key)
    print(f"  → {nasdaq_ret}" if nasdaq_ret is not None else "  → fetch failed, skipping")

    print(f"Fetching TLT {est_year} annual return from FMP…")
    tlt_ret = _annual_return("TLT", est_year, fmp_key)
    print(f"  → {tlt_ret}" if tlt_ret is not None else "  → fetch failed, skipping")

    # ── FMP: mortgage rate from Treasury ──────────────────────────────────────
    print("Fetching 10yr Treasury rate from FMP…")
    mort = mortgage_rate_from_treasury(fmp_key)
    print(f"  → {mort*100:.2f}%" if mort is not None else "  → fetch failed, skipping")

    # ── FMP: current-year YTD estimates (all three indices together) ──────────
    cur_year = int(date[:4])
    cur_month = int(date[5:7]) - 1  # month BEFORE current (last complete month)
    if cur_month == 0:
        cur_month = 12
        cur_year -= 1
    print(f"Fetching S&P 500 {cur_year} YTD return from FMP…")
    sp_cur = sp500_ytd_return(cur_year, fmp_key)
    print(f"  → {sp_cur}" if sp_cur is not None else "  → fetch failed, skipping")

    print(f"Fetching NASDAQ {cur_year} YTD return from FMP…")
    nasdaq_cur = nasdaq_ytd_return(cur_year, fmp_key)
    print(f"  → {nasdaq_cur}" if nasdaq_cur is not None else "  → fetch failed, skipping")

    print(f"Fetching TLT {cur_year} YTD return from FMP…")
    tlt_cur = tlt_ytd_return(cur_year, fmp_key)
    print(f"  → {tlt_cur}" if tlt_cur is not None else "  → fetch failed, skipping")

    # ── Read files ───────────────────────────────────────────────────────────
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = f.read()

    # patch_html writes to data (SP500, mortgage arrays) and html (display elements)
    data = patch_html(data,
                      sp_ret, sp_cur,
                      nasdaq_ret, nasdaq_cur,
                      tlt_ret, tlt_cur,
                      mort, date,
                      data_through_year=cur_year,
                      data_through_month=cur_month)
    # Date display and mortgage-rate badge stay in HTML
    if mort is not None:
        rate_pct = f"{mort * 100:.2f}%"
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

    # ── FRED: FHFA HPI annual returns for metro/state locations ──────────────
    metro_returns: dict[str, float | None] = {}   # cache for city scaling
    rent_returns:  dict[str, float | None] = {}
    if fred_key:
        print(f"\nFetching FHFA HPI {est_year} Q4-to-Q4 returns from FRED…")
        for var_name, series_id in HPI_SERIES.items():
            ret = hpi_annual_return(series_id, est_year, fred_key)
            metro_returns[var_name] = ret
            if ret is not None:
                print(f"  {var_name} ({series_id}): {ret:+.4f}")
                data = patch_loc_estimate(data, var_name, ret, est_year)
            else:
                print(f"  {var_name} ({series_id}): no data yet, skipping")

        # ── FRED: S&P CS HPI annual returns ───────────────────────────────────
        print(f"\nFetching S&P CS HPI {est_year} Dec-to-Dec returns from FRED…")
        for var_name, series_id in CS_HPI_SERIES.items():
            ret = cs_hpi_annual_return(series_id, est_year, fred_key)
            if ret is not None:
                print(f"  {var_name} ({series_id}): {ret:+.4f}")
                data = patch_loc_estimate(data, var_name, ret, est_year)
            else:
                print(f"  {var_name} ({series_id}): no data yet, skipping")

        # ── FRED: BLS CPI rent growth for metro/state locations ────────────────
        print(f"\nFetching BLS CPI rent growth {est_year} Dec-to-Dec from FRED…")
        seen_series: dict[str, float | None] = {}
        for var_name, series_id in RENT_SERIES.items():
            if series_id not in seen_series:
                seen_series[series_id] = rent_growth_annual(series_id, est_year, fred_key)
            ret = seen_series[series_id]
            rent_returns[var_name] = ret
            if ret is not None:
                print(f"  {var_name} ({series_id}): {ret:+.4f}")
                data = patch_loc_estimate(data, var_name, ret, est_year)
            else:
                print(f"  {var_name} ({series_id}): no data yet, skipping")

        # ── Derive city estimates from parent metro returns × scale factor ──────
        print(f"\nDeriving city estimates from parent metro returns…")
        for city_ann, (parent_hpi, price_scale, parent_rent, rent_scale) in CITY_FROM_METRO.items():
            city_rent = city_ann.replace("_ANN", "_RENT_GROWTH")
            p_ret = metro_returns.get(parent_hpi)
            r_ret = rent_returns.get(parent_rent)
            if p_ret is not None:
                city_val = round(p_ret * price_scale, 4)
                print(f"  {city_ann}: {parent_hpi} {p_ret:+.4f} × {price_scale} = {city_val:+.4f}")
                data = patch_loc_estimate(data, city_ann, city_val, est_year)
            else:
                print(f"  {city_ann}: parent {parent_hpi} unavailable, skipping")
            if r_ret is not None:
                city_rent_val = round(r_ret * rent_scale, 4)
                print(f"  {city_rent}: {parent_rent} {r_ret:+.4f} × {rent_scale} = {city_rent_val:+.4f}")
                data = patch_loc_estimate(data, city_rent, city_rent_val, est_year)
            else:
                print(f"  {city_rent}: parent {parent_rent} unavailable, skipping")

    # ── Write files ───────────────────────────────────────────────────────────
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(data)

    print(f"\nDone. date={date}, mortgage={mort}")
    print(f"  {est_year} annual: sp500={sp_ret}, nasdaq={nasdaq_ret}, tlt={tlt_ret}")
    print(f"  {cur_year} YTD:    sp500={sp_cur}, nasdaq={nasdaq_cur}, tlt={tlt_cur}")


if __name__ == "__main__":
    main()
