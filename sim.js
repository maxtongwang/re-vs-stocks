// ── Monthly interpolation ─────────────────────────────────────────────────
function toMonthly(ann) {
  const out = [];
  for (const r of ann) {
    const m = Math.pow(1 + r, 1 / 12) - 1;
    for (let i = 0; i < 12; i++) out.push(m);
  }
  return out;
}
let spMonthlyAll = toMonthly(SP500_ANN); // 912 months (1970–2045), total return
let spPriceMonthlyAll = toMonthly(SP500_PRICE); // 912 months, price only
const sp500PureMonthly = toMonthly(SP500_PRICE); // always S&P 500 pure price, never changes
let caMonthlyAll = toMonthly(OC_ANN); // 912 months — default matches dropdown
let reinvestMonthlyAll = spMonthlyAll; // index used to compound RE cash flows (reinvest mode)

// Active dataset pointers (updated by index/location dropdowns)
let activeSpDiv = SP500_DIV;
let activeCaRent = OC_RENT_GROWTH;
let activeCaRentYields = OC_RENT_YIELDS;
let activeLocConfig = LOC_CONFIG.oc;

const SELECT_ABBR = {
  sp500: "S&P 500",
  nasdaq: "NASDAQ",
  sixty40: "60/40",
  oc: "OC",
  nb: "NB",
  irvine: "IR",
  yorba: "YL",
  laguna: "LB",
  hb: "HB",
  la: "LA",
  sd: "SD",
  sf: "SF Bay",
  ca: "CA",
  dfw: "DFW",
  tx: "TX",
  miami: "Miami",
  fl: "FL",
  seattle: "Seattle",
  wa: "WA",
  nyc: "NYC",
  ny: "NY",
  national: "Natl",
};
function getLocKey() {
  const cw = document.getElementById("city-wrap");
  if (cw && cw.style.display !== "none")
    return document.getElementById("city-select").value;
  return document.getElementById("metro-select").value;
}

function updateSelectAbbr() {
  const idxKey = document.getElementById("index-select").value;
  const stateKey = document.getElementById("state-select").value;
  const metroKey = document.getElementById("metro-select").value;
  const locKey = getLocKey();
  document.getElementById("index-abbr").textContent =
    SELECT_ABBR[idxKey] || idxKey;
  const state = LOCATION_HIERARCHY.find((s) => s.key === stateKey);
  document.getElementById("state-abbr").textContent = state
    ? state.abbr
    : stateKey.toUpperCase();
  document.getElementById("metro-abbr").textContent =
    SELECT_ABBR[metroKey] || metroKey.toUpperCase();
  const cw = document.getElementById("city-wrap");
  if (cw && cw.style.display !== "none") {
    let cityAbbr = "All";
    if (locKey !== metroKey) {
      const metro = LOCATION_HIERARCHY.flatMap((s) => s.metros).find(
        (m) => m.key === metroKey,
      );
      const city = metro?.cities.find((c) => c.key === locKey);
      cityAbbr = city?.abbr || locKey;
    }
    document.getElementById("city-abbr").textContent = cityAbbr;
  }
}

function refreshDatasets() {
  const idxKey = document.getElementById("index-select").value;
  const locKey = getLocKey();
  updateSelectAbbr();
  const thS0 = document.getElementById("th-s0");
  if (thS0) thS0.textContent = SELECT_ABBR[idxKey] || idxKey;
  const iPrice =
    idxKey === "nasdaq"
      ? NASDAQ_PRICE
      : idxKey === "sixty40"
        ? SIX_FORTY_PRICE
        : SP500_PRICE;
  const iDiv =
    idxKey === "nasdaq"
      ? NASDAQ_DIV
      : idxKey === "sixty40"
        ? SIX_FORTY_DIV
        : SP500_DIV;
  const LOC_DATA = {
    oc: { ann: OC_ANN, rent: OC_RENT_GROWTH, yield: OC_RENT_YIELDS },
    nb: { ann: NB_ANN, rent: NB_RENT_GROWTH, yield: NB_RENT_YIELDS },
    irvine: {
      ann: IRVINE_ANN,
      rent: IRVINE_RENT_GROWTH,
      yield: IRVINE_RENT_YIELDS,
    },
    yorba: {
      ann: YORBA_ANN,
      rent: YORBA_RENT_GROWTH,
      yield: YORBA_RENT_YIELDS,
    },
    laguna: {
      ann: LAGUNA_ANN,
      rent: LAGUNA_RENT_GROWTH,
      yield: LAGUNA_RENT_YIELDS,
    },
    hb: { ann: HB_ANN, rent: HB_RENT_GROWTH, yield: HB_RENT_YIELDS },
    // LA cities
    la: { ann: LA_ANN, rent: LA_RENT_GROWTH, yield: LA_RENT_YIELDS },
    bevhills: {
      ann: BEVHILLS_ANN,
      rent: BEVHILLS_RENT_GROWTH,
      yield: BEVHILLS_RENT_YIELDS,
    },
    sm: { ann: SM_ANN, rent: SM_RENT_GROWTH, yield: SM_RENT_YIELDS },
    malibu: {
      ann: MALIBU_ANN,
      rent: MALIBU_RENT_GROWTH,
      yield: MALIBU_RENT_YIELDS,
    },
    pasadena: {
      ann: PASADENA_ANN,
      rent: PASADENA_RENT_GROWTH,
      yield: PASADENA_RENT_YIELDS,
    },
    mb: { ann: MB_ANN, rent: MB_RENT_GROWTH, yield: MB_RENT_YIELDS },
    // SD cities
    sd: { ann: SD_ANN, rent: SD_RENT_GROWTH, yield: SD_RENT_YIELDS },
    lajolla: {
      ann: LAJOLLA_ANN,
      rent: LAJOLLA_RENT_GROWTH,
      yield: LAJOLLA_RENT_YIELDS,
    },
    delmar: {
      ann: DELMAR_ANN,
      rent: DELMAR_RENT_GROWTH,
      yield: DELMAR_RENT_YIELDS,
    },
    rsf: { ann: RSF_ANN, rent: RSF_RENT_GROWTH, yield: RSF_RENT_YIELDS },
    coronado: {
      ann: CORONADO_ANN,
      rent: CORONADO_RENT_GROWTH,
      yield: CORONADO_RENT_YIELDS,
    },
    carlsbad: {
      ann: CARLSBAD_ANN,
      rent: CARLSBAD_RENT_GROWTH,
      yield: CARLSBAD_RENT_YIELDS,
    },
    // SF Bay cities
    sf: { ann: SF_ANN, rent: SF_RENT_GROWTH, yield: SF_RENT_YIELDS },
    paloalto: {
      ann: PALOALTO_ANN,
      rent: PALOALTO_RENT_GROWTH,
      yield: PALOALTO_RENT_YIELDS,
    },
    atherton: {
      ann: ATHERTON_ANN,
      rent: ATHERTON_RENT_GROWTH,
      yield: ATHERTON_RENT_YIELDS,
    },
    losaltos: {
      ann: LOSALTOS_ANN,
      rent: LOSALTOS_RENT_GROWTH,
      yield: LOSALTOS_RENT_YIELDS,
    },
    menlopark: {
      ann: MENLOPARK_ANN,
      rent: MENLOPARK_RENT_GROWTH,
      yield: MENLOPARK_RENT_YIELDS,
    },
    saratoga: {
      ann: SARATOGA_ANN,
      rent: SARATOGA_RENT_GROWTH,
      yield: SARATOGA_RENT_YIELDS,
    },
    ca: { ann: CA_ANN, rent: CA_RENT_GROWTH, yield: CA_RENT_YIELDS },
    // DFW cities
    dfw: { ann: DFW_ANN, rent: DFW_RENT_GROWTH, yield: DFW_RENT_YIELDS },
    highlandpark: {
      ann: HIGHLANDPARK_ANN,
      rent: HIGHLANDPARK_RENT_GROWTH,
      yield: HIGHLANDPARK_RENT_YIELDS,
    },
    universitypk: {
      ann: UNIVERSITYPK_ANN,
      rent: UNIVERSITYPK_RENT_GROWTH,
      yield: UNIVERSITYPK_RENT_YIELDS,
    },
    southlake: {
      ann: SOUTHLAKE_ANN,
      rent: SOUTHLAKE_RENT_GROWTH,
      yield: SOUTHLAKE_RENT_YIELDS,
    },
    frisco: {
      ann: FRISCO_ANN,
      rent: FRISCO_RENT_GROWTH,
      yield: FRISCO_RENT_YIELDS,
    },
    plano: {
      ann: PLANO_ANN,
      rent: PLANO_RENT_GROWTH,
      yield: PLANO_RENT_YIELDS,
    },
    tx: { ann: TX_ANN, rent: TX_RENT_GROWTH, yield: TX_RENT_YIELDS },
    // Miami cities
    miami: {
      ann: MIAMI_ANN,
      rent: MIAMI_RENT_GROWTH,
      yield: MIAMI_RENT_YIELDS,
    },
    miamibeach: {
      ann: MIAMIBEACH_ANN,
      rent: MIAMIBEACH_RENT_GROWTH,
      yield: MIAMIBEACH_RENT_YIELDS,
    },
    coralgables: {
      ann: CORALGABLES_ANN,
      rent: CORALGABLES_RENT_GROWTH,
      yield: CORALGABLES_RENT_YIELDS,
    },
    keybiscayne: {
      ann: KEYBISCAYNE_ANN,
      rent: KEYBISCAYNE_RENT_GROWTH,
      yield: KEYBISCAYNE_RENT_YIELDS,
    },
    coconutgrove: {
      ann: COCONUTGROVE_ANN,
      rent: COCONUTGROVE_RENT_GROWTH,
      yield: COCONUTGROVE_RENT_YIELDS,
    },
    brickell: {
      ann: BRICKELL_ANN,
      rent: BRICKELL_RENT_GROWTH,
      yield: BRICKELL_RENT_YIELDS,
    },
    fl: { ann: FL_ANN, rent: FL_RENT_GROWTH, yield: FL_RENT_YIELDS },
    // Seattle cities
    seattle: {
      ann: SEATTLE_ANN,
      rent: SEATTLE_RENT_GROWTH,
      yield: SEATTLE_RENT_YIELDS,
    },
    medina: {
      ann: MEDINA_ANN,
      rent: MEDINA_RENT_GROWTH,
      yield: MEDINA_RENT_YIELDS,
    },
    mercerisland: {
      ann: MERCERISLAND_ANN,
      rent: MERCERISLAND_RENT_GROWTH,
      yield: MERCERISLAND_RENT_YIELDS,
    },
    bellevue: {
      ann: BELLEVUE_ANN,
      rent: BELLEVUE_RENT_GROWTH,
      yield: BELLEVUE_RENT_YIELDS,
    },
    kirkland: {
      ann: KIRKLAND_ANN,
      rent: KIRKLAND_RENT_GROWTH,
      yield: KIRKLAND_RENT_YIELDS,
    },
    redmond: {
      ann: REDMOND_ANN,
      rent: REDMOND_RENT_GROWTH,
      yield: REDMOND_RENT_YIELDS,
    },
    wa: { ann: WA_ANN, rent: WA_RENT_GROWTH, yield: WA_RENT_YIELDS },
    // NYC cities
    nyc: { ann: NYC_ANN, rent: NYC_RENT_GROWTH, yield: NYC_RENT_YIELDS },
    manhattan: {
      ann: MANHATTAN_ANN,
      rent: MANHATTAN_RENT_GROWTH,
      yield: MANHATTAN_RENT_YIELDS,
    },
    brooklyn: {
      ann: BROOKLYN_ANN,
      rent: BROOKLYN_RENT_GROWTH,
      yield: BROOKLYN_RENT_YIELDS,
    },
    hoboken: {
      ann: HOBOKEN_ANN,
      rent: HOBOKEN_RENT_GROWTH,
      yield: HOBOKEN_RENT_YIELDS,
    },
    scarsdale: {
      ann: SCARSDALE_ANN,
      rent: SCARSDALE_RENT_GROWTH,
      yield: SCARSDALE_RENT_YIELDS,
    },
    greatneck: {
      ann: GREATNECK_ANN,
      rent: GREATNECK_RENT_GROWTH,
      yield: GREATNECK_RENT_YIELDS,
    },
    ny: { ann: NY_ANN, rent: NY_RENT_GROWTH, yield: NY_RENT_YIELDS },
    national: {
      ann: NATIONAL_ANN,
      rent: NATIONAL_RENT_GROWTH,
      yield: NATIONAL_RENT_YIELDS,
    },
  };
  const lAnn = LOC_DATA[locKey].ann;
  const lRent = LOC_DATA[locKey].rent;
  const lYield = LOC_DATA[locKey].yield;
  activeSpDiv = iDiv;
  activeCaRent = lRent;
  activeCaRentYields = lYield;
  activeLocConfig = LOC_CONFIG[locKey];
  improvPct = activeLocConfig.improvPct;
  SP500_ANN = iPrice.map((r, i) => r + iDiv[i]);
  spMonthlyAll = toMonthly(SP500_ANN);
  spPriceMonthlyAll = toMonthly(iPrice);
  caMonthlyAll = toMonthly(lAnn);
  // Reinvest index (may differ from main index: user picks where RE cash flows compound)
  const riPrice =
    reinvestIdx === "nasdaq"
      ? NASDAQ_PRICE
      : reinvestIdx === "sixty40"
        ? SIX_FORTY_PRICE
        : SP500_PRICE;
  const riDiv =
    reinvestIdx === "nasdaq"
      ? NASDAQ_DIV
      : reinvestIdx === "sixty40"
        ? SIX_FORTY_DIV
        : SP500_DIV;
  reinvestMonthlyAll = toMonthly(riPrice.map((r, j) => r + riDiv[j]));
  allWealth = buildAllWealth(startYear);
  applyLang();
  draw(curMonth - 1);
}

// ── Financial model ───────────────────────────────────────────────────────
function amortize(principal, monthlyRate, terms = AMORT_TERMS) {
  if (principal === 0 || terms === 0) return [];
  const pmt =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, terms)) /
    (Math.pow(1 + monthlyRate, terms) - 1);
  let bal = principal;
  const s = [];
  for (let m = 0; m < terms; m++) {
    const int = bal * monthlyRate,
      prin = pmt - int;
    bal -= prin;
    s.push({ interest: int, balance: Math.max(0, bal) });
  }
  return s;
}

// getRefis: pick up to n years where refinancing is financially rational in (sy, ey].
// Rules: (1) each refi rate must be strictly below the initial purchase rate AND below
// the rate locked in by every chronologically prior selected refi; (2) ≥2yr gap between
// any two selected years.  Returns ≤ n entries — fewer when the rate environment never
// offered enough improvements (e.g. buying near a rate trough, rates rising thereafter).
function getRefis(sy, ey, n) {
  if (n === 0 || sy >= ey) return [];
  const purchaseRate = MORTGAGE_RATES[sy - BASE_YEAR];
  const candidates = [];
  for (let y = sy + 1; y <= ey; y++) {
    const rate = MORTGAGE_RATES[y - BASE_YEAR];
    if (rate < purchaseRate)
      // only years that could ever beat the original rate
      candidates.push({ m: (y - sy) * 12, rate, year: y });
  }
  if (candidates.length === 0) return [];
  // Sort cheapest first, then greedily pick up to n with:
  //   (a) ≥2yr gap between all pairs
  //   (b) chronologically the rates must be strictly decreasing
  //       (can't refi from 2.96% → 3.94%; that would never fire)
  candidates.sort((a, b) => a.rate - b.rate);
  const selected = [];
  for (const c of candidates) {
    if (selected.length >= n) break;
    if (!selected.every((s) => Math.abs(s.year - c.year) >= 2)) continue;
    // Verify the trial sequence is chronologically rate-decreasing
    const trial = [...selected, c].sort((a, b) => a.year - b.year);
    let ok = true;
    for (let i = 1; i < trial.length; i++) {
      if (trial[i].rate >= trial[i - 1].rate) {
        ok = false;
        break;
      }
    }
    if (ok) selected.push(c);
  }
  return selected.sort((a, b) => a.m - b.m);
}

// simRE: simulate real estate wealth over time.
// reinvest=true: net cash flows compound at spSlice monthly returns (invested in market)
// reinvest=false: net cash flows accumulate additively (current behavior)
// refis: [{m, rate, year}] sorted by m — fires only if new rate ≤ current−1% and ≥24mo gap
// useLTV: true = cash-out refi to ltvPct; false = rate-and-term (remaining balance only)
function simRE(
  down,
  caM,
  rentGrowthSlice,
  mortRate,
  startYield,
  improvPct,
  reinvest,
  spSlice,
  isPrimary,
  refis,
  useLTV,
  ltvPct,
  locCfg,
  inclTaxBenefits = true,
  inclDepreciation = true,
  inclCosts = true,
  inclTxCosts = true,
) {
  const price = INIT / down,
    mort = price * (1 - down);
  // Primary residences: no depreciation deduction (IRS rule); also respects inclDepreciation + inclCosts toggles
  const dep =
    isPrimary || !inclDepreciation ? 0 : (price * improvPct) / 27.5 / 12;
  let pv = price,
    rem = mort;
  let sched = mort > 0 ? amortize(mort, mortRate / 12) : [];
  let schedOffset = 0,
    currentRate = mortRate;
  let rent = price * startYield,
    ptax = price * locCfg.propTaxRate;
  let cf = 0, // additive mode accumulator
    cfPool = 0; // reinvest mode: compounding pool
  const refiQueue = refis ? [...refis] : [];
  let lastRefiMonth = -Infinity; // tracks month of last refi (or purchase)
  // ratePeriods: one entry per rate used — for detailed edu breakdown
  const ratePeriods = [];
  let periodFromM = 0,
    periodIntD = 0;
  const calcPmt = (loan, rate) =>
    loan > 0 && rate > 0
      ? Math.round(
          (loan * (rate / 12) * Math.pow(1 + rate / 12, 360)) /
            (Math.pow(1 + rate / 12, 360) - 1),
        )
      : 0;
  const w = [];
  // Decomp: cumulative component totals (additive basis, always — for education)
  let cumRentD = 0,
    cumIntD = 0,
    cumCostsD = 0,
    cumTaxD = 0,
    cumulativeDeprec = 0;
  const dComp = [];
  for (let m = 0; m < caM.length; m++) {
    // Apply appreciation first so LTV uses current value
    pv *= 1 + caM[m];
    if (m > 0 && m % 12 === 0) {
      const yi = Math.floor(m / 12);
      rent *=
        1 +
        (rentGrowthSlice[yi] ?? rentGrowthSlice[rentGrowthSlice.length - 1]);
      if (locCfg.propTaxTracksValue) {
        const mktPtax = pv * locCfg.propTaxRate;
        // States with assessment caps (e.g. FL 10%/yr, NYC 6%/yr): assessed value
        // can rise to market value but no faster than the cap per year.
        ptax =
          (locCfg.propTaxAnnualCap ?? 0) > 0
            ? Math.min(mktPtax, ptax * (1 + locCfg.propTaxAnnualCap))
            : mktPtax;
      } else {
        ptax *= 1 + locCfg.propTaxAnnualIncrease;
      }
    }
    // Refinance: always discard a queued entry when its scheduled month arrives
    // (it can never fire later). Fire if new rate is strictly lower AND ≥24mo gap.
    if (mort > 0 && refiQueue.length > 0 && refiQueue[0].m === m) {
      const refi = refiQueue.shift();
      if (rem > 0 && refi.rate < currentRate && m - lastRefiMonth >= 24) {
        let newLoan = rem; // rate-and-term: keep same balance
        if (useLTV) {
          newLoan = Math.max(rem, pv * ltvPct); // cash-out to LTV if equity available
        }
        // Close out current rate period before switching
        const periodStartLoan =
          mort > 0
            ? ratePeriods.length === 0
              ? mort
              : (ratePeriods[ratePeriods.length - 1]?.newLoan ?? mort)
            : 0;
        ratePeriods.push({
          rate: currentRate,
          fromM: periodFromM,
          toM: m,
          periodInt: Math.round(periodIntD),
          loan: Math.round(periodStartLoan), // loan during this period
          pmt: calcPmt(periodStartLoan, currentRate),
          newLoan: Math.round(newLoan), // loan starting next period (after cash-out if LTV)
          cashOut: Math.max(0, Math.round(newLoan - rem)), // 0 unless LTV cash-out
        });
        periodFromM = m;
        periodIntD = 0;
        const cashOut = newLoan - rem;
        sched = amortize(newLoan, refi.rate / 12);
        schedOffset = m;
        currentRate = refi.rate;
        lastRefiMonth = m;
        rem = newLoan; // starting principal for prevBal when si=0
        if (cashOut > 0) {
          if (reinvest) cfPool += cashOut;
          else cf += cashOut;
        }
      }
    }
    // Primary: r=0 (no rent income). Rental: collected rent after vacancy.
    const vacancy = isPrimary ? 0 : (locCfg.vacancyRate ?? 0.05);
    const r = isPrimary ? 0 : (rent / 12) * (1 - vacancy);
    const constInfl = Math.pow(1.04, m / 12); // construction cost inflation ~4%/yr (ENR CCI long-run avg)
    const t = inclCosts ? ptax / 12 : 0,
      ins = inclCosts ? (price * 0.005 * constInfl) / 12 : 0,
      mai = inclCosts ? (price * 0.01 * constInfl) / 12 : 0;
    // Management fee: deductible operating expense (IRS Schedule E)
    const mgmt =
      !isPrimary && inclCosts && inclMgmtFee
        ? r * (locCfg.mgmtFeeRate ?? 0.09)
        : 0;
    // HOA: deductible for rental (Schedule E), pure cost for primary
    const hoa = inclHoa ? hoaMonthly : 0;
    let int = 0,
      prin = 0;
    const si = m - schedOffset;
    if (mort > 0 && si < sched.length) {
      int = sched[si].interest;
      const prevBal = si > 0 ? sched[si - 1].balance : rem;
      prin = prevBal - sched[si].balance;
      rem = sched[si].balance;
    }
    const gross = r - mgmt - (int + prin) - t - ins - mai - hoa;
    // Rental: full income/expense taxable calc (rent income offset by expenses + depreciation).
    // Primary: standard deduction assumed — no incremental tax benefit; taxBenefit = 0.
    // Rental tax benefits ON:  taxable = rent - interest - costs - depreciation
    // Rental tax benefits OFF: taxable = rent - costs (no interest deduction, no depreciation shield)
    const taxBenefit = isPrimary
      ? 0
      : !inclTaxBenefits
        ? -(r - mgmt - hoa - t - ins - mai) * locCfg.taxRate // remove interest + dep; costs still deductible
        : -(r - mgmt - hoa - int - t - ins - mai - (m < 330 ? dep : 0)) *
          locCfg.taxRate;
    const netCF = gross + taxBenefit;

    // Decomp: accumulate components (additive basis regardless of reinvest)
    cumRentD += r;
    cumIntD += int;
    cumCostsD += t + ins + mai + mgmt + hoa;
    cumTaxD += taxBenefit;
    periodIntD += int;
    if (!isPrimary && inclDepreciation && m < 330) cumulativeDeprec += dep;
    dComp.push({
      appr: Math.round(pv - price),
      cumRent: Math.round(cumRentD),
      cumInt: Math.round(cumIntD),
      cumCosts: Math.round(cumCostsD),
      cumTax: Math.round(cumTaxD),
      totalDeprec: Math.round(cumulativeDeprec),
    });

    if (reinvest) {
      // Only compound positive pool at S&P rate.
      // Negative balance = deficit funded out-of-pocket, accumulates linearly.
      if (cfPool > 0) cfPool *= 1 + spSlice[m];
      cfPool += netCF; // add this month's cash flow
      w.push(Math.round(pv - rem + cfPool));
    } else {
      cf += netCF;
      w.push(Math.round(pv - rem + cf));
    }
  }
  // Close final rate period
  const finalPeriodLoan =
    ratePeriods.length > 0 ? ratePeriods[ratePeriods.length - 1].newLoan : mort;
  ratePeriods.push({
    rate: currentRate,
    fromM: periodFromM,
    toM: caM.length,
    periodInt: Math.round(periodIntD),
    loan: finalPeriodLoan, // loan during this period
    pmt: calcPmt(finalPeriodLoan, currentRate),
    newLoan: finalPeriodLoan,
    cashOut: 0,
  });
  // One-time buy costs: constant offset on all months.
  // Sell costs are shown only at the current chart endpoint (handled in draw()).
  const txBuyRate = inclTxCosts ? (locCfg.txBuy ?? 0.01) : 0;
  const txSellRate = inclTxCosts ? (locCfg.txSell ?? 0.06) : 0;
  const txBuyCost = Math.round(price * txBuyRate);
  if (txBuyCost > 0) for (let i = 0; i < w.length; i++) w[i] -= txBuyCost;

  // Bankruptcy clamp: once wealth goes negative, it can deepen but never recover.
  // Running minimum freezes at the worst point — no false comeback from insolvency.
  let floor = 0;
  for (let i = 0; i < w.length; i++) {
    if (w[i] < floor) floor = w[i];
    if (floor < 0) w[i] = floor;
  }
  return {
    wealth: w,
    decomp: {
      price,
      mort,
      down,
      mortRate,
      startYield,
      ratePeriods,
      dComp,
      txBuyCost,
      txSellRate,
      stateCapGainsRate: locCfg.stateCapGainsRate ?? 0,
      capGainsRateSPBonus: locCfg.capGainsRateSPBonus ?? 0,
    },
  };
}

// simSP: simulate S&P 500 wealth.
// reinvest=true: dividends compound as part of total return (standard)
// reinvest=false: price-only compounding + dividends accumulate additively as cash
function simSP(priceSlice, totalSlice, divSlice, reinvest) {
  if (reinvest) {
    let v = INIT,
      vP = INIT;
    const w = [],
      dComp = [];
    for (let m = 0; m < totalSlice.length; m++) {
      v *= 1 + totalSlice[m];
      vP *= 1 + priceSlice[m];
      w.push(Math.round(v));
      dComp.push({
        appr: Math.round(vP - INIT), // price-only gain
        cumDiv: Math.round(v - vP), // extra growth from reinvesting dividends
      });
    }
    return { wealth: w, decomp: { dComp } };
  } else {
    let v = INIT,
      divCash = 0;
    const w = [],
      dComp = [];
    for (let m = 0; m < priceSlice.length; m++) {
      v *= 1 + priceSlice[m];
      const annDiv =
        divSlice[Math.floor(m / 12)] ?? divSlice[divSlice.length - 1];
      divCash += v * (annDiv / 12);
      w.push(Math.round(v + divCash));
      dComp.push({
        appr: Math.round(v - INIT),
        cumDiv: Math.round(divCash),
      });
    }
    return { wealth: w, decomp: { dComp } };
  }
}

function buildAllWealth(yr) {
  const i = yr - BASE_YEAR;
  const projEnd = endYear;
  const months = (projEnd - yr + 1) * 12;
  const sp = spMonthlyAll.slice(i * 12, i * 12 + months);
  const spP = spPriceMonthlyAll.slice(i * 12, i * 12 + months);
  const spD = activeSpDiv.slice(i);
  const ca = caMonthlyAll.slice(i * 12, i * 12 + months);
  // Slice of the reinvest-target index for compounding RE cash flows
  const ri = reinvestMonthlyAll.slice(i * 12, i * 12 + months);
  const rg = activeCaRent.slice(i);
  const mr = MORTGAGE_RATES[i];
  const ry = activeCaRentYields[i];
  const refis = getRefis(yr, endYear, numRefis); // refis only in historical range
  const effectiveTaxRate = getMarginalRate(activeLocConfig, incomeTier);
  const locCfgEff = { ...activeLocConfig, taxRate: effectiveTaxRate };
  const raw = [
    simSP(spP, sp, spD, reinvest),
    simRE(
      1,
      ca,
      rg,
      mr,
      ry,
      improvPct,
      reinvest,
      ri,
      isPrimary,
      refis,
      refiLTV,
      refiLTVPct,
      locCfgEff,
      inclTaxBenefits,
      inclDepreciation,
      inclCosts,
      inclTxCosts,
    ),
    ...RE_DOWN_PMTS.map((dp) =>
      simRE(
        dp,
        ca,
        rg,
        mr,
        ry,
        improvPct,
        reinvest,
        ri,
        isPrimary,
        refis,
        refiLTV,
        refiLTVPct,
        locCfgEff,
        inclTaxBenefits,
        inclDepreciation,
        inclCosts,
        inclTxCosts,
      ),
    ),
  ];
  // Augment S&P decomp with location-specific cap gains rates (needed by computeCapGains)
  allDecomp = raw.map((r, i) =>
    i === 0
      ? {
          ...r.decomp,
          stateCapGainsRate: activeLocConfig.stateCapGainsRate ?? 0,
          capGainsRateSPBonus: activeLocConfig.capGainsRateSPBonus ?? 0,
        }
      : r.decomp,
  );
  // "Common chart" overlay: S&P 500 pure price vs FHFA house price (selected location).
  // Always uses S&P 500 price (sp500PureMonthly) regardless of main index selection.
  const sp500Slice = sp500PureMonthly.slice(i * 12, i * 12 + months);
  const fhfaSlice = caMonthlyAll.slice(i * 12, i * 12 + months);
  indexSpWealth = [INIT];
  indexReWealth = [INIT];
  for (let m = 0; m < months - 1; m++) {
    indexSpWealth.push(
      Math.round(indexSpWealth[indexSpWealth.length - 1] * (1 + sp500Slice[m])),
    );
    indexReWealth.push(
      Math.round(indexReWealth[indexReWealth.length - 1] * (1 + fhfaSlice[m])),
    );
  }
  return raw.map((r) => r.wealth);
}

/**
 * computeCapGains(idx, m)
 *
 * Returns the capital gains tax bill (positive = tax owed) at month m for scenario idx.
 * Returns 0 if cap gains is off, or if fully deferred.
 *
 * idx: scenario index (0 = S&P, 1+ = RE scenarios)
 * m: month index (0-based)
 */
function computeCapGains(idx, m) {
  if (!inclCapGains) return 0;

  const d = allDecomp[idx];
  if (!d) return 0;

  const FED_CG_RATE = 0.238; // 20% LT + 3.8% NIIT
  const stateRate = d.stateCapGainsRate ?? 0;
  const spBonus = idx === 0 ? (d.capGainsRateSPBonus ?? 0) : 0;
  const rate = FED_CG_RATE + stateRate + spBonus;

  if (idx === 0) {
    // ── S&P 500 ──────────────────────────────────────────────────────────────
    // Cost basis = INIT (initial investment). Gain = wealth[m] - INIT.
    const gain = (allWealth[idx][m] ?? 0) - INIT;
    if (gain <= 0) return 0;
    return Math.round(gain * rate);
  }

  // ── Real Estate ───────────────────────────────────────────────────────────
  const dc = d.dComp?.[m];
  if (!dc) return 0;

  const price = d.price;
  const appr = dc.appr ?? 0; // cumulative appreciation at month m
  const salePrice = price + appr;
  const costBasis = price; // original purchase price (no improvements modeled)

  if (isPrimary) {
    // Section 121 exclusion. Requires ≥2 years ownership.
    const years = m / 12;
    if (years < 2) return 0;

    const exclusion = primaryExclusion === "married" ? 500_000 : 250_000;
    const gain = salePrice - costBasis;
    if (gain <= 0) return 0;
    const taxableGain = Math.max(0, gain - exclusion);
    return Math.round(taxableGain * rate);
  } else {
    // Rental property
    if (use1031) return 0; // fully deferred via 1031 exchange

    const gain = salePrice - costBasis;

    // Depreciation recapture: 25% on prior depreciation taken
    const totalDeprec = dc.totalDeprec ?? 0; // cumulative depreciation
    const recaptureTax = Math.round(totalDeprec * 0.25);

    // LT gain on appreciation (gain minus the depreciated portion)
    const ltGain = Math.max(0, gain - totalDeprec);
    const ltTax = Math.round(ltGain * rate);

    return recaptureTax + ltTax;
  }
}
