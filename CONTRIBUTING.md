# Contributing

Thanks for your interest in contributing to Stocks vs. Real Estate!

## Getting Started

1. Fork the repository and clone your fork
2. Open `index.html` in a browser -- no build step needed for the main app
3. For Remotion video development: `npm install && npm start`

## Project Structure

| Path         | Purpose                                                   |
| ------------ | --------------------------------------------------------- |
| `index.html` | Main interactive web app (single-page, no framework)      |
| `sim.js`     | Financial simulation engine (pure calculation)            |
| `ui.js`      | UI rendering, DOM manipulation, themes, controls          |
| `data.js`    | Historical market data arrays (auto-updated weekly by CI) |
| `src/`       | Remotion video animation (TypeScript + React)             |
| `scripts/`   | Python data fetcher for CI pipeline                       |

## Making Changes

- **Data corrections**: Update arrays in `data.js` with source citations
- **Financial model changes**: Edit `sim.js` -- add tests for new formulas
- **UI changes**: Edit `ui.js`, `style.css`, or `themes.css`
- **Remotion animation**: Work in `src/` with TypeScript

## Testing

```bash
npm install
npm test
```

## Pull Requests

1. Create a feature branch from `main`
2. Keep changes focused -- one feature or fix per PR
3. Add/update tests for any financial model changes
4. Ensure `npm test` passes
5. Describe _what_ changed and _why_ in the PR description

## Financial Model Guidelines

- All assumptions must be sourced (FRED, Case-Shiller, FHFA, BLS, etc.)
- Document formulas with inline comments
- Test edge cases: zero down payment, zero mortgage, short time periods

## Code Style

- No build tooling for the main app -- keep it vanilla JS
- Use descriptive variable names for financial terms
- Prefer clarity over brevity in financial calculations

## Reporting Issues

- Bug reports: include browser, OS, and steps to reproduce
- Data issues: include the source and expected values
- Feature requests: describe the financial scenario you want modeled
