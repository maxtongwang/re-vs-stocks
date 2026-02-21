// S&P 500 annual PRICE returns (no dividends), 1994–2024
// Source: Macrotrends / FRED historical data
export const SP500_PRICE_RETURNS: number[] = [
  -0.0154, // 1994
  0.3411, // 1995
  0.2026, // 1996
  0.3101, // 1997
  0.2667, // 1998
  0.1953, // 1999
  -0.1014, // 2000
  -0.1303, // 2001
  -0.2337, // 2002
  0.2638, // 2003
  0.0899, // 2004
  0.03, // 2005
  0.1362, // 2006
  0.0353, // 2007
  -0.3849, // 2008
  0.2345, // 2009
  0.1278, // 2010
  0.0, // 2011
  0.1341, // 2012
  0.296, // 2013
  0.1139, // 2014
  -0.0073, // 2015
  0.0954, // 2016
  0.1942, // 2017
  -0.0623, // 2018
  0.2888, // 2019
  0.1602, // 2020
  0.2689, // 2021
  -0.1944, // 2022
  0.2429, // 2023
  0.23, // 2024
];

// S&P 500 annual dividend yields, 1994–2024
// Source: Macrotrends historical S&P 500 dividend yield
export const SP500_DIVIDEND_YIELDS: number[] = [
  0.028, // 1994
  0.024, // 1995
  0.021, // 1996
  0.018, // 1997
  0.015, // 1998
  0.012, // 1999
  0.012, // 2000
  0.014, // 2001
  0.018, // 2002
  0.016, // 2003
  0.016, // 2004
  0.018, // 2005
  0.018, // 2006
  0.019, // 2007
  0.03, // 2008
  0.02, // 2009
  0.019, // 2010
  0.021, // 2011
  0.021, // 2012
  0.019, // 2013
  0.019, // 2014
  0.021, // 2015
  0.021, // 2016
  0.019, // 2017
  0.021, // 2018
  0.019, // 2019
  0.016, // 2020
  0.013, // 2021
  0.016, // 2022
  0.015, // 2023
  0.013, // 2024
];

// S&P 500 total return = price return + dividend yield (dividends reinvested)
export const SP500_ANNUAL_RETURNS: number[] = SP500_PRICE_RETURNS.map(
  (r, i) => r + SP500_DIVIDEND_YIELDS[i],
);

// California Home Price Index annual appreciation, 1994–2024
// Approximate Case-Shiller CA / CAR data
export const CA_RE_ANNUAL_RETURNS: number[] = [
  -0.02, // 1994
  0.018, // 1995
  0.037, // 1996
  0.068, // 1997
  0.094, // 1998
  0.115, // 1999
  0.12, // 2000
  0.098, // 2001
  0.168, // 2002
  0.213, // 2003
  0.225, // 2004
  0.164, // 2005
  0.078, // 2006
  -0.044, // 2007
  -0.259, // 2008
  -0.081, // 2009
  -0.009, // 2010
  -0.038, // 2011
  0.102, // 2012
  0.214, // 2013
  0.09, // 2014
  0.068, // 2015
  0.056, // 2016
  0.073, // 2017
  0.064, // 2018
  0.005, // 2019
  0.114, // 2020
  0.211, // 2021
  0.053, // 2022
  -0.012, // 2023
  0.068, // 2024
];

// California annual rent growth rates, 1994–2024
// Sources: Census ACS, BLS CPI-Rent (West Urban), Zillow ZORI (from 2015)
// Early years (1994–2014): BLS West Urban rent CPI YoY; 2015+ Zillow CA ZORI
export const CA_RENT_GROWTH: number[] = [
  0.035, // 1994 — BLS West CPI-Rent
  0.04, // 1995
  0.045, // 1996
  0.048, // 1997
  0.052, // 1998
  0.058, // 1999 — dot-com boom
  0.065, // 2000
  0.048, // 2001
  0.028, // 2002 — post dot-com
  0.018, // 2003
  0.022, // 2004
  0.038, // 2005
  0.048, // 2006
  0.042, // 2007
  0.02, // 2008 — GFC begins
  -0.012, // 2009 — rents fall
  0.008, // 2010
  0.025, // 2011
  0.045, // 2012 — recovery
  0.055, // 2013
  0.06, // 2014
  0.065, // 2015 — Zillow ZORI CA
  0.055, // 2016
  0.045, // 2017
  0.038, // 2018
  0.03, // 2019
  0.012, // 2020 — COVID dip
  0.108, // 2021 — COVID rebound spike
  0.075, // 2022
  0.032, // 2023 — cooling
  0.04, // 2024
];

// Interpolate annual returns to monthly multipliers
// Each year has 12 months; annual return r → monthly return = (1+r)^(1/12) - 1
export function annualToMonthlyReturns(annualReturns: number[]): number[] {
  const monthly: number[] = [];
  for (const r of annualReturns) {
    const monthlyR = Math.pow(1 + r, 1 / 12) - 1;
    for (let m = 0; m < 12; m++) {
      monthly.push(monthlyR);
    }
  }
  return monthly;
}
