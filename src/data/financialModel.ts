import {
  annualToMonthlyReturns,
  SP500_ANNUAL_RETURNS,
  CA_RE_ANNUAL_RETURNS,
  CA_RENT_GROWTH,
} from "./historicalData";

export interface Scenario {
  label: string;
  color: string;
  downPct: number;
  wealthByMonth: number[]; // 360 values, index 0 = end of month 1
}

const INITIAL_CASH = 100_000;
const MORTGAGE_RATE_ANNUAL = 0.085; // 8.5% 30yr fixed, 1994
const MORTGAGE_RATE_MONTHLY = MORTGAGE_RATE_ANNUAL / 12;
const MORTGAGE_TERMS = 360; // 30 years
const RENT_YIELD_ANNUAL = 0.075; // 7.5% of purchase price/yr — 1994 CA price-to-rent ~13x annual rent
const PROP_TAX_RATE = 0.0125; // 1.25% of purchase price
const PROP_TAX_INCREASE = 0.02; // +2%/yr (Prop 13 cap)
const INSURANCE_RATE = 0.005; // 0.5% of current value/yr
const MAINTENANCE_RATE = 0.01; // 1% of current value/yr
const DEPRECIATION_YEARS = 27.5;
const STRUCTURE_PCT = 0.8; // 80% of property is structure
const TAX_RATE = 0.44; // 35% fed + 9.3% CA

// Monthly mortgage payment (fixed, principal + interest)
function calcMonthlyPayment(
  principal: number,
  monthlyRate: number,
  numPayments: number,
): number {
  if (monthlyRate === 0) return principal / numPayments;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

// Returns amortization schedule: { interest, principalRepaid, balance } per month
function amortize(principal: number, monthlyRate: number, numPayments: number) {
  const payment = calcMonthlyPayment(principal, monthlyRate, numPayments);
  let balance = principal;
  const schedule: Array<{
    interest: number;
    principalRepaid: number;
    balance: number;
  }> = [];
  for (let m = 0; m < numPayments; m++) {
    const interestDue = balance * monthlyRate;
    const principalRepaid = payment - interestDue;
    balance -= principalRepaid;
    schedule.push({
      interest: interestDue,
      principalRepaid,
      balance: Math.max(0, balance),
    });
  }
  return schedule;
}

function simulateRealEstate(
  downPct: number,
  caMonthlyReturns: number[],
  rentGrowth: number[],
): number[] {
  const purchasePrice = INITIAL_CASH / downPct;
  const mortgage = purchasePrice * (1 - downPct);

  const amortSchedule =
    mortgage > 0
      ? amortize(mortgage, MORTGAGE_RATE_MONTHLY, MORTGAGE_TERMS)
      : [];

  const monthlyDepreciation =
    (purchasePrice * STRUCTURE_PCT) / DEPRECIATION_YEARS / 12;

  let currentPropertyValue = purchasePrice;
  let remainingPrincipal = mortgage;
  let cumulativeCashFlow = 0;

  // Annual rent and property tax track separately
  let currentAnnualRent = purchasePrice * RENT_YIELD_ANNUAL;
  let currentAnnualPropTax = purchasePrice * PROP_TAX_RATE;

  const wealthByMonth: number[] = [];

  for (let m = 0; m < 360; m++) {
    // Property appreciation this month
    currentPropertyValue *= 1 + caMonthlyReturns[m];

    // Annual adjustments at year boundary (after first year)
    if (m > 0 && m % 12 === 0) {
      const yearIdx = Math.floor(m / 12); // 1 = end of year 1 → apply year 2 growth
      currentAnnualRent *=
        1 + (rentGrowth[yearIdx] ?? rentGrowth[rentGrowth.length - 1]);
      currentAnnualPropTax *= 1 + PROP_TAX_INCREASE;
    }

    const monthlyRent = currentAnnualRent / 12;
    const monthlyPropTax = currentAnnualPropTax / 12;
    const monthlyInsurance = (currentPropertyValue * INSURANCE_RATE) / 12;
    const monthlyMaintenance = (currentPropertyValue * MAINTENANCE_RATE) / 12;

    let monthlyInterest = 0;
    let monthlyPrincipalRepaid = 0;
    if (mortgage > 0 && m < MORTGAGE_TERMS) {
      monthlyInterest = amortSchedule[m].interest;
      monthlyPrincipalRepaid = amortSchedule[m].principalRepaid;
      remainingPrincipal = amortSchedule[m].balance;
    }

    const monthlyPI = monthlyInterest + monthlyPrincipalRepaid;

    // Gross cash flow = Rent - PITI - Maintenance
    // (PITI = PI + tax + insurance)
    const grossCashFlow =
      monthlyRent -
      monthlyPI -
      monthlyPropTax -
      monthlyInsurance -
      monthlyMaintenance;

    // Taxable rental income (paper) = Rent - deductible expenses
    // Deductible: interest (not principal), prop tax, insurance, maintenance, depreciation
    const taxableIncome =
      monthlyRent -
      monthlyInterest -
      monthlyPropTax -
      monthlyInsurance -
      monthlyMaintenance -
      monthlyDepreciation;

    // If taxableIncome < 0: paper loss → tax refund (positive benefit)
    // If taxableIncome > 0: tax owed (negative benefit)
    const taxBenefit = -taxableIncome * TAX_RATE;

    const netCashFlow = grossCashFlow + taxBenefit;
    cumulativeCashFlow += netCashFlow;

    // Total wealth = equity + cumulative net cash flows
    const equity = currentPropertyValue - remainingPrincipal;
    const totalWealth = equity + cumulativeCashFlow;

    wealthByMonth.push(totalWealth);
  }

  return wealthByMonth;
}

function simulateSP500(spMonthlyReturns: number[]): number[] {
  let value = INITIAL_CASH;
  const wealthByMonth: number[] = [];
  for (let m = 0; m < 360; m++) {
    value *= 1 + spMonthlyReturns[m];
    wealthByMonth.push(value);
  }
  return wealthByMonth;
}

export function buildScenarios(): Scenario[] {
  const spMonthly = annualToMonthlyReturns(SP500_ANNUAL_RETURNS);
  const caMonthly = annualToMonthlyReturns(CA_RE_ANNUAL_RETURNS);

  return [
    {
      label: "S&P 500 (total)",
      color: "#4da6ff",
      downPct: 1, // unused
      wealthByMonth: simulateSP500(spMonthly),
    },
    {
      label: "RE All Cash",
      color: "#66ff66",
      downPct: 1.0,
      wealthByMonth: simulateRealEstate(1.0, caMonthly, CA_RENT_GROWTH),
    },
    {
      label: "RE 50% Down",
      color: "#ccff33",
      downPct: 0.5,
      wealthByMonth: simulateRealEstate(0.5, caMonthly, CA_RENT_GROWTH),
    },
    {
      label: "RE 20% Down",
      color: "#ffaa00",
      downPct: 0.2,
      wealthByMonth: simulateRealEstate(0.2, caMonthly, CA_RENT_GROWTH),
    },
    {
      label: "RE 10% Down",
      color: "#ff6600",
      downPct: 0.1,
      wealthByMonth: simulateRealEstate(0.1, caMonthly, CA_RENT_GROWTH),
    },
    {
      label: "RE 3.5% Down",
      color: "#ff3333",
      downPct: 0.035,
      wealthByMonth: simulateRealEstate(0.035, caMonthly, CA_RENT_GROWTH),
    },
  ];
}
