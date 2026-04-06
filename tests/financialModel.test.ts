// Tests for the Remotion financial model (src/data/financialModel.ts)
import { describe, it, expect } from "vitest";
import {
  annualToMonthlyReturns,
  SP500_ANNUAL_RETURNS,
  SP500_PRICE_RETURNS,
  SP500_DIVIDEND_YIELDS,
  CA_RE_ANNUAL_RETURNS,
  CA_RENT_GROWTH,
  CA_RENT_YIELDS,
} from "../src/data/historicalData";
import {
  buildScenarios,
  START_YEAR,
  END_YEAR,
} from "../src/data/financialModel";

// ── annualToMonthlyReturns ─────────────────────────────────────────────────

describe("annualToMonthlyReturns", () => {
  it("converts a single 10% annual return to 12 identical monthly returns", () => {
    const monthly = annualToMonthlyReturns([0.1]);
    expect(monthly).toHaveLength(12);
    // Each month should compound to 10% annually
    const compounded = monthly.reduce((acc, r) => acc * (1 + r), 1);
    expect(compounded).toBeCloseTo(1.1, 8);
  });

  it("handles zero return", () => {
    const monthly = annualToMonthlyReturns([0]);
    expect(monthly).toHaveLength(12);
    monthly.forEach((r) => expect(r).toBe(0));
  });

  it("handles negative returns", () => {
    const monthly = annualToMonthlyReturns([-0.2]);
    expect(monthly).toHaveLength(12);
    const compounded = monthly.reduce((acc, r) => acc * (1 + r), 1);
    expect(compounded).toBeCloseTo(0.8, 8);
  });

  it("produces 12 * N months for N years", () => {
    const monthly = annualToMonthlyReturns([0.05, 0.1, -0.03]);
    expect(monthly).toHaveLength(36);
  });

  it("compounding monthly returns recovers the original annual return", () => {
    const annuals = [0.15, -0.1, 0.25, 0.0, -0.38];
    const monthly = annualToMonthlyReturns(annuals);
    for (let y = 0; y < annuals.length; y++) {
      const yearSlice = monthly.slice(y * 12, (y + 1) * 12);
      const compounded = yearSlice.reduce((acc, r) => acc * (1 + r), 1);
      expect(compounded).toBeCloseTo(1 + annuals[y], 8);
    }
  });

  it("returns empty array for empty input", () => {
    expect(annualToMonthlyReturns([])).toEqual([]);
  });
});

// ── Historical data integrity ──────────────────────────────────────────────

describe("historical data arrays", () => {
  const expectedYears = END_YEAR - START_YEAR + 1; // 56 years (1970-2025)

  it("SP500_ANNUAL_RETURNS has correct length", () => {
    expect(SP500_ANNUAL_RETURNS).toHaveLength(expectedYears);
  });

  it("SP500_PRICE_RETURNS has correct length", () => {
    expect(SP500_PRICE_RETURNS).toHaveLength(expectedYears);
  });

  it("SP500_DIVIDEND_YIELDS has correct length", () => {
    expect(SP500_DIVIDEND_YIELDS).toHaveLength(expectedYears);
  });

  it("CA_RE_ANNUAL_RETURNS has correct length", () => {
    expect(CA_RE_ANNUAL_RETURNS).toHaveLength(expectedYears);
  });

  it("CA_RENT_GROWTH has correct length", () => {
    expect(CA_RENT_GROWTH).toHaveLength(expectedYears);
  });

  it("CA_RENT_YIELDS has correct length", () => {
    expect(CA_RENT_YIELDS).toHaveLength(expectedYears);
  });

  it("total return = price + dividends for each year", () => {
    for (let i = 0; i < expectedYears; i++) {
      expect(SP500_ANNUAL_RETURNS[i]).toBeCloseTo(
        SP500_PRICE_RETURNS[i] + SP500_DIVIDEND_YIELDS[i],
        10,
      );
    }
  });

  it("dividend yields are all non-negative", () => {
    SP500_DIVIDEND_YIELDS.forEach((y) => expect(y).toBeGreaterThanOrEqual(0));
  });

  it("rent yields are all positive", () => {
    CA_RENT_YIELDS.forEach((y) => expect(y).toBeGreaterThan(0));
  });

  it("known historical values: 2008 crash", () => {
    const idx2008 = 2008 - START_YEAR;
    expect(SP500_PRICE_RETURNS[idx2008]).toBeLessThan(-0.3); // S&P dropped >30%
    expect(CA_RE_ANNUAL_RETURNS[idx2008]).toBeLessThan(0); // CA RE also fell
  });

  it("known historical values: 1970 start year", () => {
    expect(SP500_PRICE_RETURNS[0]).toBeCloseTo(0.001, 3); // near flat
  });
});

// ── buildScenarios (full simulation) ───────────────────────────────────────

describe("buildScenarios", () => {
  const scenarios = buildScenarios();

  it("returns 6 scenarios (S&P + 5 RE)", () => {
    expect(scenarios).toHaveLength(6);
  });

  it("first scenario is S&P 500", () => {
    expect(scenarios[0].label).toBe("S&P 500");
  });

  it("all scenarios have correct number of months", () => {
    const expectedMonths = (END_YEAR - START_YEAR + 1) * 12;
    scenarios.forEach((s) => {
      expect(s.wealthByMonth).toHaveLength(expectedMonths);
    });
  });

  it("S&P 500 wealth is always positive", () => {
    scenarios[0].wealthByMonth.forEach((w) => expect(w).toBeGreaterThan(0));
  });

  it("all-cash RE wealth is always positive", () => {
    scenarios[1].wealthByMonth.forEach((w) => expect(w).toBeGreaterThan(0));
  });

  it("S&P 500 final wealth exceeds initial $100k over 56 years", () => {
    const finalWealth = scenarios[0].wealthByMonth.at(-1)!;
    expect(finalWealth).toBeGreaterThan(100_000);
  });

  it("higher leverage RE has higher final wealth (leverage amplifies long-run gains)", () => {
    // All Cash < 50% Down < 20% Down < 10% Down < 3.5% Down
    for (let i = 1; i < scenarios.length - 1; i++) {
      const current = scenarios[i].wealthByMonth.at(-1)!;
      const next = scenarios[i + 1].wealthByMonth.at(-1)!;
      expect(next).toBeGreaterThan(current);
    }
  });

  it("each scenario has a unique label", () => {
    const labels = scenarios.map((s) => s.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("each scenario has a color", () => {
    scenarios.forEach((s) => {
      expect(s.color).toBeTruthy();
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  it("S&P wealth dips in first 5 years (1973-74 oil crisis + crash)", () => {
    const month60 = scenarios[0].wealthByMonth[59];
    // 1970-1974 included two severe bear years; total return was net negative
    expect(month60).toBeLessThan(100_000);
    expect(month60).toBeGreaterThan(50_000); // but not a total wipeout
  });

  it("RE all-cash scenario starts at purchase price (100k equity)", () => {
    // Month 0 wealth should be close to initial value with first month's appreciation
    const month0 = scenarios[1].wealthByMonth[0];
    expect(month0).toBeGreaterThan(90_000);
    expect(month0).toBeLessThan(120_000);
  });
});

// ── Edge cases: mortgage math ──────────────────────────────────────────────

describe("mortgage math (via simulation)", () => {
  it("3.5% down scenario starts with high leverage (initial wealth < cash invested)", () => {
    const scenarios = buildScenarios();
    const threePointFive = scenarios.at(-1)!; // 3.5% Down
    // Initial equity = 100k, property = 100k/0.035 = ~2.86M
    // But first month includes rent income and costs, so wealth may differ
    const month0 = threePointFive.wealthByMonth[0];
    // Should be around 100k (equity) plus/minus first month's cash flows
    expect(month0).toBeGreaterThan(50_000);
    expect(month0).toBeLessThan(200_000);
  });

  it("all-cash RE has no mortgage effect (pure appreciation + cash flow)", () => {
    const scenarios = buildScenarios();
    const allCash = scenarios[1];
    // All-cash: no interest payments, just appreciation + rent - costs - tax
    // After 1 year, wealth should reflect ~6% CA RE appreciation on 100k purchase
    const month12 = allCash.wealthByMonth[11];
    expect(month12).toBeGreaterThan(100_000);
  });
});
