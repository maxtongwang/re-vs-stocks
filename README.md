# Stocks vs. Real Estate

Interactive financial visualization comparing S&P 500, NASDAQ, and 60/40 portfolio returns against real estate appreciation across 54 US locations using real 1970-2025 data.

**[Live Demo](https://chart.maxwangestates.com/)**

![Preview](preview.png)

## Features

- **3 stock indices**: S&P 500 (total return), NASDAQ, 60/40 portfolio
- **54 US locations**: CA, TX, FL, WA, NY metros and cities with FHFA + Case-Shiller data
- **5 leverage scenarios**: All Cash, 60%, 40%, 25%, and 3.5% down
- **Full financial model**: mortgage amortization, Prop 13 / state-specific property tax, depreciation tax shield, maintenance, insurance, vacancy, management fees, HOA
- **Capital gains tax**: federal LT + NIIT + state rates, Section 121 exclusion, 1031 exchange
- **Cash-out refinance**: rate-and-term or LTV-based refi with historical mortgage rates
- **Wealth decomposition**: interactive breakdown of appreciation, rent, interest, costs, and tax components
- **NOI and cap rate**: net operating income and capitalization rate at every point
- **Dark/light themes** with auto-detection
- **Bilingual**: English and Simplified Chinese

## Quick Start

No build step needed. Open `index.html` in a browser.

For the Remotion video animation:

```bash
npm install
npm start        # opens Remotion Studio
npm run render   # renders to out/animation.mp4
```

## Project Structure

| Path                       | Purpose                                      |
| -------------------------- | -------------------------------------------- |
| `index.html`               | Main interactive web app                     |
| `sim.js`                   | Financial simulation engine                  |
| `ui.js`                    | UI rendering and controls                    |
| `data.js`                  | Historical market data (auto-updated weekly) |
| `style.css` / `themes.css` | Styling                                      |
| `src/`                     | Remotion video animation (TypeScript)        |
| `scripts/`                 | Python data fetcher for CI                   |

## Data Sources

| Data                 | Source                                                                                                            | Update Frequency |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------- |
| S&P 500, NASDAQ      | [FMP](https://financialmodelingprep.com/)                                                                         | Weekly (CI)      |
| House prices (metro) | [FHFA HPI](https://www.fhfa.gov/data/hpi) via FRED                                                                | Annual (Q4)      |
| House prices (city)  | [S&P Case-Shiller](https://www.spglobal.com/spdji/en/index-family/indicators/sp-corelogic-case-shiller/) via FRED | Annual (Dec)     |
| Rent growth          | [BLS CPI Rent](https://www.bls.gov/cpi/) via FRED                                                                 | Annual (Dec)     |
| Mortgage rates       | FMP 10yr Treasury + 180bps spread                                                                                 | Weekly (CI)      |

## Testing

```bash
npm install
npm test
```

## API Keys

The app runs entirely client-side with bundled historical data. API keys are only needed for the CI pipeline that refreshes data weekly:

| Key            | Used By                        | How to Get                                                                      |
| -------------- | ------------------------------ | ------------------------------------------------------------------------------- |
| `FMP_API_KEY`  | `scripts/update_projection.py` | [financialmodelingprep.com](https://site.financialmodelingprep.com/developer)   |
| `FRED_API_KEY` | `scripts/update_projection.py` | [fred.stlouisfed.org](https://fred.stlouisfed.org/docs/api/api_key.html) (free) |

Keys are stored as GitHub Actions secrets, never in source code. See `.env.example`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)

## Funding

If you find this useful: [Buy Me a Coffee](https://buymeacoffee.com/whatupmax)
