// ── Down payment config — change here to update ALL labels + simulation ────
const RE_DOWN_PMTS = [0.6, 0.4, 0.25, 0.035]; // s2–s5; s1 = All Cash
function dpPct(p) {
  return parseFloat((p * 100).toFixed(4));
}
function dpLabel(p) {
  return `${dpPct(p)}% Down`;
}

// ── Scenario metadata ──────────────────────────────────────────────────────
const SCENARIOS = [
  { label: "S&P 500 (total)" },
  { label: "RE All Cash" },
  ...RE_DOWN_PMTS.map((p) => ({ label: `RE ${dpLabel(p)}` })),
];

// ── Market events (crashes + spikes) ─────────────────────────────────────
// type:"crash" → red table row + red chart line
// type:"spike" → amber chart line + label (no table row)
// chartLine:false → table row only (e.g. GFC year 2 continuation)
const MARKET_EVENTS = [
  {
    year: 1973,
    name: "Oil crisis",
    nameZh: "石油危机",
    type: "crash",
    chartLine: true,
  },
  {
    year: 1980,
    name: "Volcker shock",
    nameZh: "沃尔克冲击",
    type: "crash",
    chartLine: true,
  },
  {
    year: 1987,
    name: "Black Monday",
    nameZh: "黑色星期一",
    type: "crash",
    chartLine: true,
  },
  {
    year: 2000,
    name: "Dot-com bust",
    nameZh: "互联网泡沫",
    type: "crash",
    chartLine: true,
  },
  {
    year: 2008,
    name: "GFC",
    nameZh: "金融危机",
    type: "crash",
    chartLine: true,
  },
  {
    year: 2009,
    name: "GFC",
    nameZh: "金融危机",
    type: "crash",
    chartLine: false,
  },
  {
    year: 2020,
    name: "COVID crash",
    nameZh: "新冠暴跌",
    type: "crash",
    chartLine: true,
  },
  {
    year: 2022,
    name: "Rate hike",
    nameZh: "加息",
    type: "crash",
    chartLine: true,
  },
  {
    year: 2004,
    name: "Housing bubble",
    nameZh: "楼市泡沫",
    type: "spike",
    chartLine: true,
  },
  {
    year: 2013,
    name: "RE recovery",
    nameZh: "楼市复苏",
    type: "spike",
    chartLine: true,
  },
  {
    year: 2021,
    name: "COVID boom",
    nameZh: "新冠繁荣",
    type: "spike",
    chartLine: true,
  },
];

// ── Localization strings ──────────────────────────────────────────────────
const STRINGS = {
  en: {
    heroTitle: "The Last Chart To Understand<br>Real Estate vs Stock Market",
    heroRe: "CA Real Estate",
    labelStart: "Start:",
    labelEnd: "End:",
    labelCashflow: "Cash flow",
    labelImprov: "Improvement %",
    labelPropMode: "Prop:",
    labelTaxBracket: "Tax bracket:",
    labelRefi: "Refi:",
    tipBalLine:
      "Rate-and-term: keeps the same remaining balance, resets to a new 30-yr schedule at the lower rate.",
    tipLtvLine:
      "Loan-to-Value: new loan ÷ current property value. Bank won't lend above this ceiling.",
    tipImprov:
      "IRS: only the structure (not land) depreciates on a 27.5yr schedule. CA metro ~40%, TX ~60%.",
    tipCashflow:
      "Additive: dividends & rent collected as cash, not compounded.\nReinvested: income compounds back into the portfolio.",
    tipReinvest:
      "RE: surplus cash flows (rent after costs) compound in the index selected to the right.\nStock: dividends reinvest back into the same index — not affected by the selector.\nDeficits are funded out-of-pocket — negative balance does not compound.",
    btnPriceOnly: "Price Only",
    tipPriceOverlay:
      "S&P 500 price only (no dividends) vs HPI (Case-Shiller or FHFA, as selected above) for the selected location.\n\nBoth lines start at $250K from your selected year — no leverage, rent, costs, or taxes. Pure price appreciation only. Switch locations to compare how different markets appreciated against the S&P 500.",
    labelLang: "Lang:",
    btnAdditive: "Additive",
    btnReinvest: "Reinvested",
    btnRental: "Rental",
    btnPrimary: "Primary",
    btnRefiBalance: "Balance",
    labelIncludes: "Includes:",
    btnTaxBenefits: "Tax Benefits",
    btnTaxBill: "Tax Bill",
    btnDepreciation: "Depreciation",
    btnCosts: "Op. Costs",
    btnPmFee: "PM fee",
    btnHoa: "HOA",
    tipCosts:
      "Property tax (location-specific rate).\nInsurance: 0.5%/yr of purchase price, +4%/yr construction cost inflation.\nMaintenance: 1%/yr of purchase price, +4%/yr construction cost inflation.\nVacancy: location-specific (Census ACS). Reduces gross rent collected.\nMgmt fee: % of collected rent for professional management (optional toggle).\nHOA/condo fees: optional — toggle on and select $100–$2,000/mo. Deductible for rental (Schedule E); non-deductible for primary.",
    btnTxCosts: "Tx Costs",
    tipTxCosts:
      "Buy: title, escrow, inspection, appraisal (1–2% of purchase).\nSell: commission (both sides), title, transfer taxes, warranty (6–9% of sale).\nRates vary by location — hover the breakdown for details.",
    btnCapGains: "Cap Gains",
    tipCapGains:
      "Capital gains tax on net profit at time of sale.\n\nStocks: long-term rate on total gain (cost basis = initial investment).\n\nRE Rental: long-term rate on appreciation; plus 25% recapture on prior depreciation deductions. Toggle 1031 to defer all taxes on rollover.\n\nRE Primary: Section 121 exclusion ($500k married / $250k single) if owned ≥2 years. Long-term rate on gains above exclusion.\n\nRates = federal 23.8% (20% LT + 3.8% NIIT) + same state rate used for income tax benefits above.",
    btn1031On: "1031 On",
    btn1031Off: "1031 Off",
    tip1031:
      "1031 Exchange: defer all capital gains and depreciation recapture by rolling proceeds into a like-kind property. Requires 45-day identification and 180-day close. Boot (cash out) is taxable.",
    btnExclMarried: "Married $500K",
    btnExclSingle: "Single $250K",
    tipExcl:
      "Section 121 Primary Residence Exclusion: exclude up to $500K (married filing jointly) or $250K (single) of gain from federal tax. Requires ownership AND use as primary residence for ≥2 of the past 5 years.",
    legendLabels: [
      "S&P 500 (total)",
      "RE All Cash",
      ...RE_DOWN_PMTS.map((p) => `RE ${dpLabel(p)}`),
    ],
    legendLabelsPrimary: [
      "S&P 500 (total)",
      "Primary All Cash",
      ...RE_DOWN_PMTS.map((p) => `Primary ${dpLabel(p)}`),
    ],
    thYear: "Year",
    assmDyn: "Your Scenario",
    assmFix: "How It Works",
    assmFixNote: "",
    labelSources: "Sources",
    buildSources: (
      idxLabel,
      locLabel,
      iSrc,
      lSrc,
      lnk,
      csSrc,
      hpiSrc = "cs",
    ) => [
      `${idxLabel} returns: ${lnk(iSrc.returns)} &amp; ${lnk(iSrc.live)} (current year live)`,
      `${hpiSrc === "cs" ? "<strong>← active</strong> " : ""}S&amp;P CoreLogic Case-Shiller HPI: all arm's-length repeat-sale transactions (broader than FHFA's conforming-loan-only). ${locLabel} mapped to ${lnk([csSrc])}. Pre-series years use FHFA fallback.`,
      `${hpiSrc === "fhfa" ? "<strong>← active</strong> " : ""}FHFA House Price Index (HPI): conforming-loan-only repeat-sale index (Freddie Mac &amp; Fannie Mae records). ${locLabel} data: ${lnk(lSrc.homePrice)}. Pre-1976 values estimated from regional sources.`,
      `Mortgage rates: <a href="https://fred.stlouisfed.org/series/MORTGAGE30US" target="_blank">FRED MORTGAGE30US</a>`,
      `Rent growth pre-2015: ${lnk(lSrc.rentPre2015)}`,
      `Rent growth 2015+: ${lnk(lSrc.rentPost2015)}`,
      `Rent yields: estimated from ${lnk(lSrc.rentYield)}`,
      `2026 projection: S&amp;P 500 +8% &amp; NASDAQ +10% per Wall Street consensus range (<a href="https://yardeni.com/charts/wall-streets-sp-500-targets/" target="_blank">Yardeni Research</a>); home prices +1–5% by market per <a href="https://www.cotality.com/intelligence/reports/home-price-insights" target="_blank">Cotality</a> (formerly CoreLogic) &amp; <a href="https://www.fanniemae.com/data-and-insights/forecast" target="_blank">Fannie Mae</a> forecasts`,
      `Price-only overlay (S&amp;P 500 price vs ${hpiSrc === "cs" ? "Case-Shiller" : "FHFA"} HPI): same HPI data as the main simulation. Both lines reflect pure price appreciation from the same starting capital with no leverage, rent, or costs.`,
    ],
    builtBy: "Built by Max Wang · DRE 02225524",
    disclaimer: "for entertainment purpose only",
    labelHpiSourceText: "HPI",
    tipHpiSource:
      "House Price Index — tracks home price appreciation. Case-Shiller covers all arm's-length transactions; FHFA covers conforming-loan-only.",
    btnFhfa: "FHFA",
    btnCs: "Case-Shiller",
    labelPriceOnlyComparison: "Price only",
    modeLabelReinvest: "Reinvested (compound)",
    modeLabelAdditive: "Additive (no compound)",
    subtitle: (rv, ey, MY, isPrimary) =>
      isPrimary
        ? `primary residence<br>PITI is cost; standard deduction assumed — no mortgage interest tax benefit`
        : `rental<br>dividends &amp; rent: ${rv ? "reinvested (compound)" : "additive (no compound)"}`,
    assumptionsLine: (
      sy,
      ey,
      yrs,
      mr,
      ry,
      ip,
      mode,
      isPrimary,
      nr,
      isLTV,
      actual = nr,
      methNote = "",
    ) => {
      const W = (s) =>
        `<strong style="color:${getCSSVar("--decomp-hi")}">${s}</strong>`;
      const line2 = isPrimary
        ? `Primary: no rental income; standard deduction (no mortgage interest benefit)`
        : `Rent yield: ${W(ry + "%")} · Improvement<span class="tip-icon" data-tip="Building/structure share of purchase price used for IRS 27.5-yr depreciation (land is not depreciable). Preset per location from county assessor records: ~35% Manhattan to ~70% DFW." style="font-size:9px;margin:0 1px">ⓘ</span>: ${W(ip + "%")}`;
      const refiLabel =
        actual < nr ? `${actual}/${nr}x ⚠ skip: higher rates` : `${nr}x`;
      const refiStr =
        nr > 0
          ? `Refi: ${W(refiLabel + " " + (isLTV ? "(LTV)" : "(Balance)"))}`
          : "";
      const line1 = `${sy}–${ey} · ${W(yrs + " yrs")} · Mortgage: ${W(mr + "%")} · Cash flow: ${W(mode)}`;
      const line2full = `${line2}${refiStr ? ` · ${refiStr}` : ""}`;
      return `${line1}<br>${line2full}`;
    },
    dynamicLine: (
      sy,
      ey,
      yrs,
      mr,
      ry,
      p2r,
      ip,
      mode,
      isPrimary,
      nr,
      refis,
      isLTV,
      actual = nr,
    ) => {
      const skipped = nr - actual;
      const refiStr =
        nr > 0
          ? `Refi: ${actual < nr ? `<span style="color:${getCSSVar("--warn")}">${actual}/${nr}x ${isLTV ? "LTV" : "Balance"} ⚠ skip: higher rates</span>` : `${nr}x ${isLTV ? "LTV" : "Balance"} (${refis.map((r) => r.year).join(", ")})`} · `
          : "";
      if (isPrimary) {
        return (
          `<strong style="color:${getCSSVar("--decomp-hi")}">${sy}–${ey}</strong> (${yrs}yr) · ` +
          `Mort <strong style="color:${getCSSVar("--decomp-hi")}">${mr}%</strong> · ` +
          `Primary: no rent income · std. deduction (no mortgage interest benefit) · no depreciation` +
          `<br>` +
          refiStr +
          `<strong style="color:${getCSSVar("--decomp-hi")}">${mode}</strong>`
        );
      }
      return (
        `<strong style="color:${getCSSVar("--decomp-hi")}">${sy}–${ey}</strong> (${yrs}yr) · ` +
        `Mort <strong style="color:${getCSSVar("--decomp-hi")}">${mr}%</strong> · ` +
        `Yield <strong style="color:${getCSSVar("--decomp-hi")}">${ry}%</strong> (≈${p2r}x) · ` +
        `Improv <strong style="color:${getCSSVar("--decomp-hi")}">${ip}%</strong>` +
        `<br>` +
        refiStr +
        `<strong style="color:${getCSSVar("--decomp-hi")}">${mode}</strong>`
      );
    },
    tableRowLabel: (yrs, yr) => `Yr ${yrs} (${yr})`,
    crashRowLabel: (yr, evName) =>
      evName ? `${yr} \u2014 ${evName}` : `${yr} (crash)`,
    fixedGroups: (ltvPct) => [
      {
        label: "About This Tool",
        items: [
          "This is a fully dynamic, live simulation. Every number you see — property tax rates, vacancy rates, rent yields, appreciation history, income tax rates, mortgage rates — is location- and scenario-specific and recalculates instantly whenever you change any input. No static assumptions, no page reload.",
          `<span style="color:var(--accent);font-weight:500">${RE_DOWN_PMTS.length + 2}</span> scenarios run in parallel: S&P 500 total return vs. real estate at All Cash, 60%, 40%, 25%, and 3.5% down — all starting from the same <span style="color:var(--accent);font-weight:500">${INIT >= 1000000 ? "$" + INIT / 1000000 + "M" : "$" + INIT / 1000 + "K"}</span> of capital on the same date.`,
          "Everything is adjustable: location, hold period, income bracket, rental vs. primary, number of refis, cash-flow reinvestment mode, and which cost/tax items to include. Improvement % is preset per location from assessor records.",
          "The goal is intuition: historical outcomes vary wildly by entry year, leverage, and city. Drag the start year, flip rental to primary, toggle costs on and off — notice how the winner changes. No single answer is correct.",
          "All figures are nominal (not inflation-adjusted). Data: S&P CoreLogic Case-Shiller / FHFA house price index (switchable; location-adjusted), S&P 500 total return (CRSP / Macrotrends), 30-yr mortgage rates (FRED), local property tax rates, historical dividend yields, CPI.",
          'Values highlighted in <span style="color:var(--accent);font-weight:500">blue</span> throughout the sections below are live — they reflect your current market and settings and update instantly when you change any input above.',
        ],
      },
      {
        label: "Property Costs",
        items: [
          `Property tax: <span style="color:var(--accent);font-weight:500">${activeLocConfig.propTaxNote}</span>`,
          "Insurance: 0.5% of purchase price/yr, inflated at 4%/yr (ENR Construction Cost Index long-run avg). Anchored to replacement/construction cost — land is not insured and doesn't affect premiums.",
          "Maintenance: 1% of purchase price/yr, inflated at 4%/yr. Tracks labor and materials inflation, not home price appreciation. Over 30 years costs grow ~3×; over 50 years ~7×.",
          "Depreciation (rental only): IRS 27.5-yr straight-line on the structure (not land). The improvement % shown in your scenario sets what share of purchase price is depreciable. Primary residences are ineligible. Improvement ratios sourced from county assessor records; ranges from ~35% (Manhattan) to ~70% (DFW) — value is preset per location.",
          `Income tax: <span style="color:var(--accent);font-weight:500">${getTaxNote(activeLocConfig, incomeTier, false)}</span> marginal rate applied to net rental income (rent minus mortgage interest, property tax, insurance, maintenance, and depreciation). Select your bracket above. When deductions exceed rent, the result is a paper loss — you collect rent but show a taxable loss and may receive a refund.`,
          `Vacancy: <span style="color:var(--accent);font-weight:500">${(activeLocConfig.vacancyRate * 100).toFixed(0)}% of gross rent</span> (Census ACS 2022–23 rental vacancy survey, updated periodically). An unoccupied month earns no rent; fixed costs (mortgage, tax, insurance) continue.`,
          `Property management (if enabled): <span style="color:var(--accent);font-weight:500">${(activeLocConfig.mgmtFeeRate * 100).toFixed(0)}% of collected rent</span> for professional management (NARPM/AppFolio 2023 industry avg). Deductible on IRS Schedule E. Disable to model self-management.`,
          "HOA / condo fees: optional toggle (row 2 of Includes). Select $100–$2,000/mo in $100 steps; default $300/mo. Deductible operating expense for rentals (IRS Schedule E); non-deductible for primary residences. Building dues vary widely — use this to model your specific property.",
          "PMI (private mortgage insurance): not modeled. Required for conventional loans under 20% down — typically 0.5–1.5%/yr of the loan balance, cancels at 78% LTV. Factor in manually for the 3.5% down scenario.",
        ],
      },
      {
        label: "How Wealth Is Measured",
        items: [
          `Starting capital: <span style="color:var(--accent);font-weight:500">${INIT >= 1000000 ? "$" + INIT / 1000000 + "M" : "$" + INIT / 1000 + "K"}</span> deployed on the same date across all scenarios.`,
          "Wealth = Equity + Cumulative Net Cash Flows. Equity = current home value minus remaining loan balance. Cash flows = all rent collected minus all out-of-pocket expenses (mortgage payments, property tax, insurance, maintenance, transaction costs if enabled).",
          "Additive mode: dividends and rent accumulate as cash without compounding. Represents parking income in a checking account.",
          "Reinvested mode: positive cash flows compound monthly at the S&P 500 return for that month. Deficit months accumulate additively — treated as an out-of-pocket cost, not a leveraged market bet. Represents reinvesting every surplus dollar into an index fund.",
          "High-leverage note: scenarios like 25% down at peak mortgage rates often run cash-flow negative for years. In those cases Additive and Reinvested produce identical results — there is no surplus to compound.",
        ],
      },
      {
        label: "Refinancing",
        items: [
          "Purchase rate: 30-yr fixed annual average for the start year, locked in until a refi occurs.",
          "Refi selection: picks the N lowest-rate years within the holding period (N = refi count). A refi fires only if the new rate is ≥1 percentage point below the current rate and at least 2 years have passed since purchase or the prior refi.",
          `Balance (rate-and-term): refinances the remaining principal at the new lower rate. No cash extracted — monthly payment drops, loan term resets to 30 years.`,
          `LTV (cash-out): new loan = max(remaining balance, <span style="color:var(--accent);font-weight:500">${Math.round(ltvPct * 100)}% of current home value</span>). Any amount above the remaining balance is cash out, credited to the investor's cash position.`,
          "No closing costs are modeled. Each refi resets to a fresh 30-yr amortization schedule.",
          "Rental + refi (tax interaction): mortgage interest is deductible against rental income. A rate cut shrinks the interest deduction, reducing the paper loss and its associated tax refund — partially offsetting the payment savings. The net refi benefit for a rental is always less than the face-value payment reduction suggests.",
          "Primary + refi: standard deduction assumed — interest deduction irrelevant. Savings show up two ways: (1) lower monthly payment reduces cumulative costs; (2) each refi resets to 30-yr amortization, slowing equity buildup and extending payoff. In a typical 30-yr window, the equity slowdown often cancels the savings — full net benefit usually requires holding 10+ years past the refi date.",
        ],
      },
    ],
    methodologyNote:
      'Historical data: S&amp;P CoreLogic Case-Shiller · FHFA · S&amp;P 500 · FRED · <a href="#note-section">full methodology ↓</a>',
    primaryNote:
      "ℹ <strong>Primary mode:</strong> no rental income — PITI is a pure cost. Leveraged scenarios can go <strong>deeply negative</strong> during downturns (cumulative costs exceed equity). The log-scale chart cannot display ≤ $0, so those lines hug the floor. <em>Not a display bug.</em>",
    outcomeAhead: (pct, isRE) =>
      isRE ? `RE leads +${pct}%` : `Index leads +${pct}%`,
  },
  zh: {
    heroTitle: "<br>看懂房产 vs 股市的终极图表",
    heroRe: "加州房产",
    labelStart: "起始年：",
    labelEnd: "结束年：",
    labelCashflow: "现金流",
    labelImprov: "建筑占比",
    labelPropMode: "类型：",
    labelTaxBracket: "税率档：",
    labelRefi: "重贷：",
    tipBalLine:
      "利率调整型：维持剩余贷款金额不变，以新低利率重新计算30年还款计划。",
    tipLtvLine: "贷款价值比：新贷款 ÷ 当前房产价值。银行不超此比例放贷。",
    tipImprov:
      "IRS：只有建筑物（非土地）可按27.5年折旧。加州约40%，德州约60%。",
    tipCashflow:
      "叠加：股息和房租以现金收取，不复利。\n复投：收益重新投入组合，产生复利。",
    tipReinvest:
      "房产：租金盈余（扣除成本后）按右侧所选指数复利增长。\n股票：股息再投资回同一指数本身，不受右侧选择影响。\n亏损由自有资金补足，负余额不复利。",
    btnPriceOnly: "仅价格",
    tipPriceOverlay:
      "标普500纯价格（不含股息）对比HPI（可在上方切换CS/FHFA）。\n\n两线以25万美元为基准，不含杠杆、租金或成本，仅反映纯价格涨幅。切换地区可对比不同市场与标普500的增值速度。",
    labelLang: "语言：",
    btnAdditive: "叠加",
    btnReinvest: "复投",
    btnRental: "出租",
    btnPrimary: "自住",
    btnRefiBalance: "剩余贷款",
    labelIncludes: "计入：",
    btnTaxBenefits: "税务优惠",
    btnTaxBill: "税务负担",
    btnDepreciation: "折旧",
    btnCosts: "运营成本",
    btnPmFee: "物管费",
    btnHoa: "HOA",
    tipCosts:
      "房产税（税率因地区而异）。\n保险：购入价0.5%/年，+4%/年建筑成本通胀。\n维护费：购入价1%/年，+4%/年建筑成本通胀。\n空置率：按地区（美国人口普查ACS）。降低实际收租金额。\n物业管理费：占实收租金百分比，适用专业管理（可关闭开关）。\nHOA/共管费：可选——开启后选择$100–$2,000/月。出租可在IRS Schedule E中扣除；自住不可抵税。",
    btnTxCosts: "交易成本",
    tipTxCosts:
      "买入：产权、托管、验房、评估（约为房价1–2%）。\n卖出：佣金（双方）、产权、转让税、保修（约为售价6–9%）。\n税率因地区而异，详见明细。",
    btnCapGains: "资本利得",
    tipCapGains:
      "出售时对净利润征收的资本利得税。股票：总收益适用长期税率。租赁房产：增值收益适用长期税率，折旧回收税25%，可选1031延税。自住房：满足2年居住要求可享豁免（已婚$50万/单身$25万），超出部分按长期税率征税。",
    btn1031On: "1031 开",
    btn1031Off: "1031 关",
    tip1031:
      "1031交换：将收益投入同类资产可延迟缴纳资本利得税及折旧回收税。需在45天内确认新资产、180天内完成交割。",
    btnExclMarried: "已婚 $50万",
    btnExclSingle: "单身 $25万",
    tipExcl:
      "第121条自住房豁免：已婚联合申报最高豁免$50万，单身最高$25万。需过去5年内拥有并作为主要住所满2年。",
    legendLabels: [
      "S&P 500 (总回报)",
      "房产 全现金",
      ...RE_DOWN_PMTS.map((p) => `房产 ${dpPct(p)}%首付`),
    ],
    legendLabelsPrimary: [
      "S&P 500 (总回报)",
      "自住 全现金",
      ...RE_DOWN_PMTS.map((p) => `自住 ${dpPct(p)}%首付`),
    ],
    thYear: "年份",
    assmDyn: "当前情景",
    assmFix: "原理详解",
    assmFixNote: "",
    labelSources: "数据来源",
    buildSources: (
      idxLabel,
      locLabel,
      iSrc,
      lSrc,
      lnk,
      csSrc,
      hpiSrc = "cs",
    ) => [
      `${idxLabel}收益数据：${lnk(iSrc.returns)} &amp; ${lnk(iSrc.live)}（当年实时数据）`,
      `${hpiSrc === "cs" ? "<strong>← 当前</strong> " : ""}S&amp;P CoreLogic Case-Shiller HPI：覆盖所有等价交易（非FHFA合规贷款限定）。${locLabel}对应：${lnk([csSrc])}。CS序列开始前使用FHFA数据。`,
      `${hpiSrc === "fhfa" ? "<strong>← 当前</strong> " : ""}FHFA房价指数（HPI）：基于房利美与房地美合规贷款的同房重复交易指数。${locLabel}数据：${lnk(lSrc.homePrice)}。1976年前数据来自地区资料估算。`,
      `房贷利率：<a href="https://fred.stlouisfed.org/series/MORTGAGE30US" target="_blank">美联储 FRED MORTGAGE30US</a>`,
      `2015年前租金涨幅：${lnk(lSrc.rentPre2015)}`,
      `2015年后租金涨幅：${lnk(lSrc.rentPost2015)}`,
      `租金回报率：来源于 ${lnk(lSrc.rentYield)}`,
      `2026年预测：S&amp;P 500 +8%、纳斯达克 +10%，基于华尔街共识区间（<a href="https://yardeni.com/charts/wall-streets-sp-500-targets/" target="_blank">Yardeni Research</a>）；各市场房价 +1–5%，来自 <a href="https://www.cotality.com/intelligence/reports/home-price-insights" target="_blank">Cotality</a>（原CoreLogic）及 <a href="https://www.fanniemae.com/data-and-insights/forecast" target="_blank">Fannie Mae</a> 预测`,
      `纯价格对比覆盖层（标普500价格 vs ${hpiSrc === "cs" ? "Case-Shiller" : "FHFA"} HPI）：与主模拟相同的HPI数据。两线均为纯价格涨幅，不含杠杆、租金或成本。`,
    ],
    builtBy: "由 Max Wang 制作 · DRE 02225524",
    disclaimer: "仅供娱乐参考",
    labelHpiSourceText: "HPI",
    tipHpiSource:
      "房价指数（HPI）——追踪房价涨幅。Case-Shiller 覆盖所有等价转让交易；FHFA 仅限合规贷款交易。",
    btnFhfa: "FHFA",
    btnCs: "CS",
    labelPriceOnlyComparison: "纯价格对比",
    modeLabelReinvest: "复投（复利）",
    modeLabelAdditive: "叠加（无复利）",
    subtitle: (rv, ey, MY, isPrimary) =>
      isPrimary
        ? `自住<br>PITI为成本；假设标准扣除额——房贷利息无节税效果`
        : `出租<br>股息和房租：${rv ? "复投（复利）" : "叠加（无复利）"}`,
    assumptionsLine: (
      sy,
      ey,
      yrs,
      mr,
      ry,
      ip,
      mode,
      isPrimary,
      nr,
      isLTV,
      actual = nr,
      methNote = "",
    ) => {
      const W = (s) =>
        `<strong style="color:${getCSSVar("--decomp-hi")}">${s}</strong>`;
      const line2 = isPrimary
        ? `自住：无租金收入；标准扣除额（房贷利息无节税效果）`
        : `租金回报率：${W(ry + "%")} · 建筑<span class="tip-icon" data-tip="建筑/结构占购价比例，用于IRS 27.5年折旧（土地不可折旧）。按地区预设，来源于县评估记录：曼哈顿约35%，DFW约70%。" style="font-size:9px;margin:0 1px">ⓘ</span>：${W(ip + "%")}`;
      const refiLabel =
        actual < nr ? `${actual}/${nr}次 ⚠ 跳过：利率偏高` : `${nr}次`;
      const refiStr =
        nr > 0
          ? `重贷：${W(refiLabel + (isLTV ? "（LTV）" : "（剩余贷款）"))}`
          : "";
      const line1 = `${sy}–${ey} · ${W(yrs + "年")} · 房贷：${W(mr + "%")} · 现金流：${W(mode)}`;
      const line2full = `${line2}${refiStr ? ` · ${refiStr}` : ""}`;
      return `${line1}<br>${line2full}`;
    },
    dynamicLine: (
      sy,
      ey,
      yrs,
      mr,
      ry,
      p2r,
      ip,
      mode,
      isPrimary,
      nr,
      refis,
      isLTV,
      actual = nr,
    ) => {
      const skipped = nr - actual;
      const refiStr =
        nr > 0
          ? `重贷：${actual < nr ? `<span style="color:${getCSSVar("--warn")}">${actual}/${nr}次${isLTV ? "LTV" : "剩余贷款"} ⚠ 跳过：利率偏高</span>` : `${nr}次${isLTV ? "LTV" : "剩余贷款"}（${refis.map((r) => r.year).join("、")}年）`} · `
          : "";
      if (isPrimary) {
        return (
          `<strong style="color:${getCSSVar("--decomp-hi")}">${sy}–${ey}</strong> (${yrs}年) · ` +
          `房贷 <strong style="color:${getCSSVar("--decomp-hi")}">${mr}%</strong> · ` +
          `自住：无租金收入 · 标准扣除额（无房贷利息抵税） · 无折旧` +
          `<br>` +
          refiStr +
          `<strong style="color:${getCSSVar("--decomp-hi")}">${mode}</strong>`
        );
      }
      return (
        `<strong style="color:${getCSSVar("--decomp-hi")}">${sy}–${ey}</strong> (${yrs}年) · ` +
        `房贷 <strong style="color:${getCSSVar("--decomp-hi")}">${mr}%</strong> · ` +
        `回报率 <strong style="color:${getCSSVar("--decomp-hi")}">${ry}%</strong> (≈${p2r}倍) · ` +
        `建筑 <strong style="color:${getCSSVar("--decomp-hi")}">${ip}%</strong>` +
        `<br>` +
        refiStr +
        `<strong style="color:${getCSSVar("--decomp-hi")}">${mode}</strong>`
      );
    },
    tableRowLabel: (yrs, yr) => `第${yrs}年 (${yr})`,
    crashRowLabel: (yr, evName) =>
      evName ? `${yr} \u2014 ${evName}` : `${yr}（崩盘）`,
    fixedGroups: (ltvPct) => [
      {
        label: "关于本工具",
        items: [
          "这是一个全动态实时模拟工具。所有数据——房产税率、空置率、租金收益率、历史升值、所得税率、贷款利率——均按城市和情景实时计算，任意输入变更即刻更新。无静态假设，无需刷新页面。",
          `<span style="color:var(--accent);font-weight:500">${RE_DOWN_PMTS.length + 2}</span>种方案并行对比：标普500总回报 vs. 全现金购房、60%、40%、25%和3.5%首付——所有方案从相同日期、相同<span style="color:var(--accent);font-weight:500">${INIT >= 1000000 ? "$" + INIT / 1000000 + "M" : "$" + INIT / 1000 + "K"}</span>本金出发。`,
          "所有参数均可调整：城市、持有年限、收入税率档、出租或自住、重贷次数、现金流再投资方式，以及各项成本和税务是否计入。建筑占比按地区预设（来自评估记录）。",
          "目标是建立直觉：历史结果因入场年份、杠杆率和城市不同而差异极大，没有唯一正确答案。拖动起始年、切换出租与自住、开关各项成本——观察领先者如何随条件变化而转换。",
          "所有数据均为名义值（未经通胀调整）。数据来源：S&P CS / FHFA房价指数（可切换，按城市调整）、标普500总回报（CRSP/Macrotrends）、30年固定房贷利率（FRED）、各地房产税率、历史股息率及CPI。",
          '以下各节中<span style="color:var(--accent);font-weight:500">蓝色</span>标注的数值为实时数据——反映当前所选市场和设置，任意输入变更即刻更新。',
        ],
      },
      {
        label: "房产持有成本",
        items: [
          `房产税：<span style="color:var(--accent);font-weight:500">${activeLocConfig.propTaxNoteZh}</span>`,
          "保险：购入价的0.5%/年，按4%/年建筑成本通胀递增（ENR建筑成本指数长期均值）。以重建成本为基准——土地不计入保险范围，不受房价涨幅影响。",
          "维护费：购入价的1%/年，按4%/年建筑成本通胀递增。跟踪人工和材料成本，而非房价涨幅。30年累计约增长3倍，50年约增长7倍。",
          "折旧（仅适用出租）：IRS 27.5年直线折旧，仅适用于建筑物（非土地）。方案中显示的建筑占比决定可折旧部分。自住房产不适用。建筑占比来源：各地县评估记录，范围约35%（曼哈顿）至70%（DFW），按地区预设。",
          `所得税：<span style="color:var(--accent);font-weight:500">${getTaxNote(activeLocConfig, incomeTier, true)}</span> 边际税率，适用于净租金收入（租金减去利息、房产税、保险、维护费及折旧）。可在上方选择税率档。当各项扣除超过租金时，产生「纸面亏损」——即使每月收租，报税仍显示亏损并可获退税。`,
          `空置率：<span style="color:var(--accent);font-weight:500">${(activeLocConfig.vacancyRate * 100).toFixed(0)}%的毛租金</span>（美国人口普查ACS 2022–23年租赁空置调查，定期更新）。空置月份无租金收入，但固定成本（房贷、税、保险）持续支出。`,
          `物业管理（若启用）：<span style="color:var(--accent);font-weight:500">实收租金的${(activeLocConfig.mgmtFeeRate * 100).toFixed(0)}%</span>用于专业管理（NARPM/AppFolio 2023行业均值）。可在IRS Schedule E中扣除。关闭此项则模拟自主管理。`,
          "HOA/共管费：可选（在「计入」第2行开启）。选择每月$100–$2,000，步长$100，默认$300/月。出租房可在IRS Schedule E中扣除；自住房不可抵税。各楼盘费用差异较大，按实际情况输入。",
          "PMI（私人房贷保险）：未建模。传统贷款首付不足20%时通常需要缴纳，约为贷款余额的0.5–1.5%/年，LTV降至78%后自动取消。3.5%首付情景请自行估算。",
        ],
      },
      {
        label: "资产计算方式",
        items: [
          `初始资金：各方案均投入<span style="color:var(--accent);font-weight:500">${INIT >= 1000000 ? "$" + INIT / 1000000 + "M" : "$" + INIT / 1000 + "K"}</span>，购入日期相同。`,
          "总资产 = 房产净值 + 累计净现金流。净值 = 当前房产市值 − 剩余贷款余额。现金流 = 历年租金总收入 − 历年自付支出（月供、房产税、保险、维护费，若启用则含交易成本）。",
          "叠加模式：股息和房租以现金形式累计，不复利。适合将收益存入活期账户的情景。",
          "复投模式：正现金流按当月S&P 500回报率复利增长；亏损月份线性累加（视为自付成本，非市场杠杆）。适合将每笔盈余持续买入指数基金的情景。",
          "高杠杆说明：如利率高峰期首付25%，净现金流往往长期为负——此时复投与叠加结果相同，因无正值现金流可再投入。",
        ],
      },
      {
        label: "重新贷款",
        items: [
          "购房利率：锁定为起始年份30年固定利率均值，直至重贷发生。",
          "触发规则：从持有期历史数据中选出利率最低的N个年份（N=重贷次数）。触发条件：新利率须低于当前利率至少1个百分点，且距购房或上次重贷满2年。",
          `剩余贷款（利率调整）：按新低利率对剩余本金重贷，不套现——月供降低，贷款期限重置为30年。`,
          `LTV（套现）：新贷款 = max(剩余本金, 当前房产价值×<span style="color:var(--accent);font-weight:500">${Math.round(ltvPct * 100)}%</span>)，超出剩余本金部分以现金形式计入投资者持仓。`,
          "不计交易成本。每次重贷均按新金额、新利率重置30年摊销计划。",
          "出租+重贷（税务联动）：房贷利息可从租金收入中抵税。重贷降低利率后，利息减少，可抵扣金额缩小，纸面亏损减少，退税也随之降低，从而部分抵消月供节省。出租房重贷的实际净收益始终低于月供减少的表面数字。",
          "自住+重贷：假设标准扣除额，无税务复杂性。收益体现在两处：（1）月供降低，累计成本减少；（2）但每次重贷重置30年摊销，净值积累变慢，还清日期延后。在典型30年持有周期内，净值损失往往抵消月供节省——通常需在重贷后再持有10年以上才能真正受益。",
        ],
      },
    ],
    methodologyNote:
      '数据来源：S&P CS · FHFA · 标普500 · FRED · <a href="#note-section">完整方法论 ↓</a>',
    primaryNote:
      "ℹ <strong>自住模式：</strong>无租金收入，PITI为纯成本支出。楼市下跌期间，高杠杆情景可能出现<strong>净财富为负</strong>（累计成本 > 净资产）。对数坐标无法显示 ≤ $0 的值，受影响的曲线将贴近图表底部。<em>这不是显示错误。</em>",
    outcomeAhead: (pct, isRE) =>
      isRE ? `房产领先 +${pct}%` : `指数领先 +${pct}%`,
  },
};

// ── Historical data (1970–2025, 56 entries) ──────────────────────────────────────
// 2025 values are preliminary estimates
const BASE_YEAR = 1970,
  HIST_YEAR = 2026, // last year with real data
  MAX_YEAR = 2026;
// DATA_THROUGH: most recent month with reliable data (auto-updated by script)
// prettier-ignore
const DATA_THROUGH_YEAR = 2026, DATA_THROUGH_MONTH = 1; // DATA_THROUGH_MARKER
let INIT = 1000000;
const AMORT_TERMS = 360;

// S&P 500 annual price returns — Macrotrends / CRSP
const SP500_PRICE = [
  // 1970–1993 (price-only, no dividends — source: Macrotrends / sp500live.co)
  0.001,
  0.1079,
  0.1563,
  -0.1737,
  -0.2972,
  0.3155,
  0.1915,
  -0.115,
  0.0106,
  0.1231,
  0.2577,
  -0.0973,
  0.1476,
  0.1727,
  0.014,
  0.2633,
  0.1462,
  0.0203,
  0.124,
  0.2725,
  -0.0656,
  0.2631,
  0.0446,
  0.0706,
  // 1994–2024
  -0.0154,
  0.3411,
  0.2026,
  0.3101,
  0.2667,
  0.1953,
  -0.1014,
  -0.1303,
  -0.2337,
  0.2638,
  0.0899,
  0.03,
  0.1362,
  0.0353,
  -0.3849,
  0.2345,
  0.1278,
  0.0,
  0.1341,
  0.296,
  0.1139,
  -0.0073,
  0.0954,
  0.1942,
  -0.0623,
  0.2888,
  0.1602,
  0.2689,
  -0.1944,
  0.2429,
  0.23,
  // SP500_2025_START (auto-updated monthly from FMP)
  0.1639, // 2025 (preliminary estimate)
  // SP500_2025_END
  // SP500_CUR_START (auto-updated monthly — current year YTD estimate)
  0.08, // 2026 (estimate — Bloomberg Wall St consensus)
  // SP500_CUR_END
];
// S&P 500 annual dividend yields — Macrotrends historical
const SP500_DIV = [
  // 1970–1993
  0.0347, 0.0311, 0.0284, 0.037, 0.0527, 0.0431, 0.0393, 0.0498, 0.0543, 0.0531,
  0.0474, 0.0548, 0.0581, 0.044, 0.0464, 0.0383, 0.0349, 0.037, 0.0364, 0.0345,
  0.0361, 0.0314, 0.029, 0.0273,
  // 1994–2024
  0.028, 0.024, 0.021, 0.018, 0.015, 0.012, 0.012, 0.014, 0.018, 0.016, 0.016,
  0.018, 0.018, 0.019, 0.0323, 0.02, 0.019, 0.021, 0.021, 0.019, 0.019, 0.021,
  0.021, 0.019, 0.021, 0.019, 0.016, 0.013, 0.016, 0.015, 0.013,
  // 2025 (estimate)
  0.013,
  // 2026 (estimate)
  0.013,
];
// ── Location config: per-metro tax rates & property tax rules ──────────────
const LOC_CONFIG = {
  ca: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.4,
    typicalYieldRange: [0.03, 0.05],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "FHFA CA HPI",
          href: "https://fred.stlouisfed.org/series/CASTHPI",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI CA",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZORI CA (rent)",
          href: "https://www.zillow.com/research/data/",
        },
        {
          text: "FHFA CA HPI (home price)",
          href: "https://fred.stlouisfed.org/series/CASTHPI",
        },
      ],
    },
  },

  oc: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.32,
    typicalYieldRange: [0.03, 0.045],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "FHFA OC HPI (MSAD 11244)",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS11244Q",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI LA metro",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "FHFA OC HPI",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS11244Q",
        },
        {
          text: "Zillow ZORI",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  nb: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.22,
    typicalYieldRange: [0.018, 0.03],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Newport Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Newport Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Newport Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  irvine: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.38,
    typicalYieldRange: [0.025, 0.038],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Irvine",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Irvine",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Irvine",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  yorba: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.38,
    typicalYieldRange: [0.028, 0.04],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Yorba Linda",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Yorba Linda",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Yorba Linda",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  laguna: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.2,
    typicalYieldRange: [0.015, 0.025],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Laguna Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Laguna Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Laguna Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  hb: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.35,
    typicalYieldRange: [0.028, 0.04],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Huntington Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Huntington Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Huntington Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  la: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.33,
    typicalYieldRange: [0.03, 0.05],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "FHFA LA HPI (MSAD 31084)",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS31084Q",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Los Angeles",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "FHFA LA HPI",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS31084Q",
        },
        {
          text: "Zillow ZORI",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  sd: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.38,
    typicalYieldRange: [0.03, 0.05],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "FHFA San Diego HPI (MSA 41740)",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS41740Q",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Diego",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "FHFA SD HPI",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS41740Q",
        },
        {
          text: "Zillow ZORI",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  sf: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.28,
    typicalYieldRange: [0.025, 0.04],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "FHFA SF HPI (MSAD 41884)",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS41884Q",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Francisco",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "FHFA SF HPI",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS41884Q",
        },
        {
          text: "Zillow ZORI",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  miami: {
    propTaxRate: 0.01,
    txBuy: 0.013, // +FL doc stamps on mortgage ~0.3%
    txSell: 0.067, // commission ~5%, title 0.5%, FL doc stamps on deed 0.7%, misc
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    propTaxAnnualCap: 0.1,
    taxRate: 0.35,
    stateRateGroup: "none",
    improvPct: 0.55,
    typicalYieldRange: [0.045, 0.065],
    propTaxNote:
      "FL Save Our Homes: ~1.0% of assessed value; non-homestead rental capped +10%/yr",
    propTaxNoteZh: "佛州《拯救家园》：评估价值约1.0%；非自住出租上限+10%/年",
    taxNote: "35% (35% fed + 0% FL — no income tax)",
    taxNoteZh: "35%（联邦35% + 佛州0%，无州所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.06,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "FHFA Miami HPI (MSAD 33124)",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS33124Q",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Miami",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "FHFA Miami HPI",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS33124Q",
        },
        {
          text: "Zillow ZORI",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  dfw: {
    propTaxRate: 0.021,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    taxRate: 0.35,
    stateRateGroup: "none",
    improvPct: 0.6,
    typicalYieldRange: [0.05, 0.07],
    propTaxNote: "TX: ~2.1% of current market value, no income tax state",
    propTaxNoteZh: "德州：约当前市值2.1%，无州所得税",
    taxNote: "35% (35% fed + 0% TX — no income tax)",
    taxNoteZh: "35%（联邦35% + 德州0%，无州所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.08,
    mgmtFeeRate: 0.1,
    sources: {
      homePrice: [
        {
          text: "FHFA DFW HPI (MSAD 19124)",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS19124Q",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Dallas–Fort Worth",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "FHFA DFW HPI",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS19124Q",
        },
        {
          text: "Zillow ZORI",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  seattle: {
    propTaxRate: 0.0093,
    txSell: 0.088, // commission ~5%, title 0.5%, WA REET 2.75% ($1.525M–$3.025M bracket)
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    taxRate: 0.35,
    stateRateGroup: "none",
    improvPct: 0.55,
    typicalYieldRange: [0.035, 0.055],
    propTaxNote: "WA: ~0.93% of current market value, no income tax state",
    propTaxNoteZh: "华州：约当前市值0.93%，无州所得税",
    taxNote: "35% (35% fed + 0% WA — no income tax)",
    taxNoteZh: "35%（联邦35% + 华州0%，无州所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    capGainsRateSPBonus: 0.07,
    sources: {
      homePrice: [
        {
          text: "FHFA Seattle HPI (MSAD 42644)",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS42644Q",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Seattle",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "FHFA Seattle HPI",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS42644Q",
        },
        {
          text: "Zillow ZORI",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  nyc: {
    propTaxRate: 0.015,
    txBuy: 0.02, // +NYC mortgage recording tax ~1.8% of loan (for leveraged); mansion tax 1%+
    txSell: 0.078, // commission ~5%, title 0.5%, NYC RPTT 1.425% + NYS transfer 0.4%, misc
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    propTaxAnnualCap: 0.06,
    taxRate: 0.457,
    stateRateGroup: "ny",
    improvPct: 0.22,
    typicalYieldRange: [0.025, 0.045],
    propTaxNote:
      "NYC Class 1-2 residential: ~1.5% of assessed value; assessed value capped +6%/yr",
    propTaxNoteZh: "纽约市第1-2类住宅：评估价值约1.5%；年增上限+6%",
    taxNote: "45.7% (35% fed + 10.9% NY)",
    taxNoteZh: "45.7%（联邦35% + 纽约州10.9%）",
    stateCapGainsRate: 0.109,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "FHFA NYC HPI (MSA 35620)",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS35620Q",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI Northeast Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0100SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI New York",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "FHFA NYC HPI",
          href: "https://fred.stlouisfed.org/series/ATNHPIUS35620Q",
        },
        {
          text: "Zillow ZORI",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  national: {
    propTaxRate: 0.011,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    taxRate: 0.38,
    stateRateGroup: "national",
    improvPct: 0.55,
    typicalYieldRange: [0.045, 0.065],
    propTaxNote:
      "National avg: ~1.1% of current market value (reassessed annually)",
    propTaxNoteZh: "全国均值：约当前市值1.1%（每年重新评估）",
    taxNote: "38% (35% fed + ~3% avg state)",
    taxNoteZh: "38%（联邦35% + 州均约3%）",
    stateCapGainsRate: 0.03,
    vacancyRate: 0.07,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "Case-Shiller National",
          href: "https://fred.stlouisfed.org/series/CSUSHPINSA",
        },
        {
          text: "FHFA National HPI",
          href: "https://fred.stlouisfed.org/series/USSTHPI",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI National Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0000SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow National ZORI",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow National ZORI (rent)",
          href: "https://www.zillow.com/research/data/",
        },
        {
          text: "FHFA National HPI (home price)",
          href: "https://fred.stlouisfed.org/series/USSTHPI",
        },
      ],
    },
  },
  tx: {
    propTaxRate: 0.021,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    taxRate: 0.35,
    stateRateGroup: "none",
    improvPct: 0.7,
    typicalYieldRange: [0.05, 0.07],
    propTaxNote: "TX: ~2.1% of current market value, no income tax state",
    propTaxNoteZh: "德州：约当前市值2.1%，无州所得税",
    taxNote: "35% (35% fed + 0% TX — no income tax)",
    taxNoteZh: "35%（联邦35% + 德州0%，无州所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.08,
    mgmtFeeRate: 0.1,
    sources: {
      homePrice: [
        {
          text: "FHFA TX HPI",
          href: "https://fred.stlouisfed.org/series/TXSTHPI",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI TX metros",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZORI TX metros (rent)",
          href: "https://www.zillow.com/research/data/",
        },
        {
          text: "FHFA TX HPI (home price)",
          href: "https://fred.stlouisfed.org/series/TXSTHPI",
        },
      ],
    },
  },
  fl: {
    propTaxRate: 0.01,
    txBuy: 0.013, // +FL doc stamps on mortgage ~0.3%
    txSell: 0.067, // commission ~5%, title 0.5%, FL doc stamps on deed 0.7%, misc
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    propTaxAnnualCap: 0.1,
    taxRate: 0.35,
    stateRateGroup: "none",
    improvPct: 0.65,
    typicalYieldRange: [0.05, 0.07],
    propTaxNote:
      "FL Save Our Homes: ~1.0% of assessed value; non-homestead rental capped +10%/yr",
    propTaxNoteZh: "佛州《拯救家园》：评估价值约1.0%；非自住出租上限+10%/年",
    taxNote: "35% (35% fed + 0% FL — no income tax)",
    taxNoteZh: "35%（联邦35% + 佛州0%，无州所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.07,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "FHFA FL HPI",
          href: "https://fred.stlouisfed.org/series/FLSTHPI",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI FL metros",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZORI FL metros (rent)",
          href: "https://www.zillow.com/research/data/",
        },
        {
          text: "FHFA FL HPI (home price)",
          href: "https://fred.stlouisfed.org/series/FLSTHPI",
        },
      ],
    },
  },
  wa: {
    propTaxRate: 0.0093,
    txSell: 0.073, // commission ~5%, title 0.5%, WA REET 1.28% (median bracket)
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    taxRate: 0.35,
    stateRateGroup: "none",
    improvPct: 0.5,
    typicalYieldRange: [0.035, 0.055],
    propTaxNote: "WA: ~0.93% of current market value, no income tax state",
    propTaxNoteZh: "华盛顿州：约当前市值0.93%，无州所得税",
    taxNote: "35% (35% fed + 0% WA — no income tax)",
    taxNoteZh: "35%（联邦35% + 华州0%，无州所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.05,
    mgmtFeeRate: 0.09,
    capGainsRateSPBonus: 0.07,
    sources: {
      homePrice: [
        {
          text: "FHFA WA HPI",
          href: "https://fred.stlouisfed.org/series/WASTHPI",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Seattle",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZORI Seattle (rent)",
          href: "https://www.zillow.com/research/data/",
        },
        {
          text: "FHFA WA HPI (home price)",
          href: "https://fred.stlouisfed.org/series/WASTHPI",
        },
      ],
    },
  },
  ny: {
    propTaxRate: 0.015,
    txSell: 0.064, // commission ~5%, title 0.5%, NYS transfer tax 0.4%
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    taxRate: 0.457,
    stateRateGroup: "ny",
    improvPct: 0.35,
    typicalYieldRange: [0.04, 0.06],
    propTaxNote: "NY metro: ~1.5% of current market value",
    propTaxNoteZh: "纽约都市区：约当前市值1.5%",
    taxNote: "45.7% (35% fed + 10.9% NY)",
    taxNoteZh: "45.7%（联邦35% + 纽约州10.9%）",
    stateCapGainsRate: 0.03,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "FHFA NY HPI",
          href: "https://fred.stlouisfed.org/series/NYSTHPI",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI Northeast Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0100SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI NY metro",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZORI NY metro (rent)",
          href: "https://www.zillow.com/research/data/",
        },
        {
          text: "FHFA NY HPI (home price)",
          href: "https://fred.stlouisfed.org/series/NYSTHPI",
        },
      ],
    },
  },

  bevhills: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.22,
    typicalYieldRange: [0.018, 0.03],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Beverly Hills",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Los Angeles",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Beverly Hills",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  sm: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.28,
    typicalYieldRange: [0.02, 0.032],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Santa Monica",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Los Angeles",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Santa Monica",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  malibu: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.18,
    typicalYieldRange: [0.012, 0.022],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Malibu",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Los Angeles",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Malibu",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  pasadena: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.38,
    typicalYieldRange: [0.025, 0.038],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Pasadena",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Los Angeles",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Pasadena",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  mb: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.25,
    typicalYieldRange: [0.018, 0.03],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Manhattan Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Los Angeles",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Manhattan Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  lajolla: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.25,
    typicalYieldRange: [0.018, 0.03],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI La Jolla",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Diego",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI La Jolla",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  delmar: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.22,
    typicalYieldRange: [0.016, 0.028],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Del Mar",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Diego",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Del Mar",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  rsf: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.15,
    typicalYieldRange: [0.012, 0.02],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Rancho Santa Fe",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Diego",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Rancho Santa Fe",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  coronado: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.28,
    typicalYieldRange: [0.018, 0.03],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Coronado",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Diego",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Coronado",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  carlsbad: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.38,
    typicalYieldRange: [0.026, 0.04],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Carlsbad",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Diego",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Carlsbad",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  paloalto: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.22,
    typicalYieldRange: [0.018, 0.028],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Palo Alto",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Jose",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Palo Alto",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  atherton: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.15,
    typicalYieldRange: [0.012, 0.02],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Atherton",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Jose",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Atherton",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  losaltos: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.22,
    typicalYieldRange: [0.018, 0.028],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Los Altos",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Jose",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Los Altos",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  menlopark: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.25,
    typicalYieldRange: [0.018, 0.028],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Menlo Park",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Francisco",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Menlo Park",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  saratoga: {
    propTaxRate: 0.0125,
    propTaxTracksValue: false,
    propTaxAnnualIncrease: 0.02,
    taxRate: 0.44,
    stateRateGroup: "ca",
    improvPct: 0.25,
    typicalYieldRange: [0.02, 0.03],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
    stateCapGainsRate: 0.133,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Saratoga",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI San Jose",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Saratoga",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  highlandpark: {
    propTaxRate: 0.015,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.28,
    typicalYieldRange: [0.04, 0.06],
    propTaxNote: "TX: annual assessment; Highland Park ISD ~1.5%",
    propTaxNoteZh: "德州：每年重新评估; 高地公园学区约1.5%",
    taxNote: "37% (37% fed, no TX income tax)",
    taxNoteZh: "37%（联邦37%，德州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.07,
    mgmtFeeRate: 0.1,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Highland Park TX",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Dallas",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Highland Park TX",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  universitypk: {
    propTaxRate: 0.015,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.3,
    typicalYieldRange: [0.042, 0.062],
    propTaxNote: "TX: annual assessment; University Park ISD ~1.5%",
    propTaxNoteZh: "德州：每年重新评估; 大学公园约1.5%",
    taxNote: "37% (37% fed, no TX income tax)",
    taxNoteZh: "37%（联邦37%，德州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.07,
    mgmtFeeRate: 0.1,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI University Park TX",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Dallas",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI University Park TX",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  southlake: {
    propTaxRate: 0.02,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.32,
    typicalYieldRange: [0.045, 0.065],
    propTaxNote: "TX: annual assessment; Carroll ISD ~2.0%",
    propTaxNoteZh: "德州：每年重新评估; 卡罗尔学区约2.0%",
    taxNote: "37% (37% fed, no TX income tax)",
    taxNoteZh: "37%（联邦37%，德州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.07,
    mgmtFeeRate: 0.1,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Southlake TX",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Dallas",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Southlake TX",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  frisco: {
    propTaxRate: 0.021,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.35,
    typicalYieldRange: [0.05, 0.072],
    propTaxNote: "TX: annual assessment; Frisco ISD ~2.1%",
    propTaxNoteZh: "德州：每年重新评估; 弗里斯科学区约2.1%",
    taxNote: "37% (37% fed, no TX income tax)",
    taxNoteZh: "37%（联邦37%，德州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.08,
    mgmtFeeRate: 0.1,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Frisco TX",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Dallas",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Frisco TX",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  plano: {
    propTaxRate: 0.02,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.35,
    typicalYieldRange: [0.052, 0.074],
    propTaxNote: "TX: annual assessment; Plano ISD ~2.0%",
    propTaxNoteZh: "德州：每年重新评估; 普莱诺学区约2.0%",
    taxNote: "37% (37% fed, no TX income tax)",
    taxNoteZh: "37%（联邦37%，德州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.08,
    mgmtFeeRate: 0.1,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Plano TX",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Dallas",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Plano TX",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  miamibeach: {
    propTaxRate: 0.01,
    txBuy: 0.013, // +FL doc stamps on mortgage ~0.3%
    txSell: 0.07, // commission ~5%, title 0.5%, FL doc stamps 0.7%, luxury close
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.3,
    typicalYieldRange: [0.032, 0.05],
    propTaxNote: "FL: annual assessment; Miami-Dade County ~1.0%",
    propTaxNoteZh: "佛州：每年重新评估; 迈阿密戴德县约1.0%",
    taxNote: "37% (37% fed, no FL income tax)",
    taxNoteZh: "37%（联邦37%，佛州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.06,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Miami Beach FL",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Miami",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Miami Beach",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  coralgables: {
    propTaxRate: 0.01,
    txBuy: 0.013,
    txSell: 0.07,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.32,
    typicalYieldRange: [0.035, 0.052],
    propTaxNote: "FL: annual assessment; Miami-Dade County ~1.0%",
    propTaxNoteZh: "佛州：每年重新评估; 迈阿密戴德县约1.0%",
    taxNote: "37% (37% fed, no FL income tax)",
    taxNoteZh: "37%（联邦37%，佛州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.06,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Coral Gables FL",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Miami",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Coral Gables",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  keybiscayne: {
    propTaxRate: 0.009,
    txBuy: 0.013,
    txSell: 0.07,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.25,
    typicalYieldRange: [0.03, 0.048],
    propTaxNote: "FL: annual assessment; Miami-Dade County ~0.9%",
    propTaxNoteZh: "佛州：每年重新评估; 迈阿密戴德县约0.9%",
    taxNote: "37% (37% fed, no FL income tax)",
    taxNoteZh: "37%（联邦37%，佛州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.06,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Key Biscayne FL",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Miami",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Key Biscayne",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  coconutgrove: {
    propTaxRate: 0.01,
    txBuy: 0.013,
    txSell: 0.07,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.3,
    typicalYieldRange: [0.036, 0.054],
    propTaxNote: "FL: annual assessment; Miami-Dade County ~1.0%",
    propTaxNoteZh: "佛州：每年重新评估; 迈阿密戴德县约1.0%",
    taxNote: "37% (37% fed, no FL income tax)",
    taxNoteZh: "37%（联邦37%，佛州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.06,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Coconut Grove FL",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Miami",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Coconut Grove",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  brickell: {
    propTaxRate: 0.011,
    txBuy: 0.013,
    txSell: 0.07,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.5,
    typicalYieldRange: [0.04, 0.06],
    propTaxNote: "FL: annual assessment; Miami-Dade County ~1.1% (condo-heavy)",
    propTaxNoteZh: "佛州：每年重新评估; 迈阿密戴德县约1.1%（公寓为主）",
    taxNote: "37% (37% fed, no FL income tax)",
    taxNoteZh: "37%（联邦37%，佛州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.06,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Brickell FL",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI South Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0300SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Miami",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Brickell",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  medina: {
    propTaxRate: 0.0075,
    txSell: 0.09, // commission ~5%, title 0.5%, WA REET 3.0% (>$3.025M bracket)
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.2,
    typicalYieldRange: [0.015, 0.025],
    propTaxNote: "WA: annual assessment; King County Medina ~0.75%",
    propTaxNoteZh: "华州：每年重新评估; 金县美地纳约0.75%",
    taxNote: "37% (37% fed, no WA income tax)",
    taxNoteZh: "37%（联邦37%，华州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    capGainsRateSPBonus: 0.07,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Medina WA",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Seattle",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Medina WA",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  mercerisland: {
    propTaxRate: 0.0085,
    txSell: 0.09, // WA REET 3.0% (>$3.025M bracket)
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.28,
    typicalYieldRange: [0.018, 0.028],
    propTaxNote: "WA: annual assessment; King County Mercer Island ~0.85%",
    propTaxNoteZh: "华州：每年重新评估; 金县梅赛岛约0.85%",
    taxNote: "37% (37% fed, no WA income tax)",
    taxNoteZh: "37%（联邦37%，华州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.04,
    mgmtFeeRate: 0.08,
    capGainsRateSPBonus: 0.07,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Mercer Island WA",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Seattle",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Mercer Island",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  bellevue: {
    propTaxRate: 0.009,
    txSell: 0.088, // WA REET 2.75% ($1.525M–$3.025M bracket)
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.32,
    typicalYieldRange: [0.022, 0.034],
    propTaxNote: "WA: annual assessment; King County Bellevue ~0.9%",
    propTaxNoteZh: "华州：每年重新评估; 金县贝尔维尤约0.9%",
    taxNote: "37% (37% fed, no WA income tax)",
    taxNoteZh: "37%（联邦37%，华州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.05,
    mgmtFeeRate: 0.09,
    capGainsRateSPBonus: 0.07,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Bellevue WA",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Seattle",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Bellevue WA",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  kirkland: {
    propTaxRate: 0.0092,
    txSell: 0.088,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.33,
    typicalYieldRange: [0.024, 0.036],
    propTaxNote: "WA: annual assessment; King County Kirkland ~0.92%",
    propTaxNoteZh: "华州：每年重新评估; 金县柯克兰约0.92%",
    taxNote: "37% (37% fed, no WA income tax)",
    taxNoteZh: "37%（联邦37%，华州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.05,
    mgmtFeeRate: 0.09,
    capGainsRateSPBonus: 0.07,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Kirkland WA",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Seattle",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Kirkland WA",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  redmond: {
    propTaxRate: 0.0095,
    txSell: 0.088,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.37,
    stateRateGroup: "none",
    improvPct: 0.35,
    typicalYieldRange: [0.026, 0.038],
    propTaxNote: "WA: annual assessment; King County Redmond ~0.95%",
    propTaxNoteZh: "华州：每年重新评估; 金县雷德蒙德约0.95%",
    taxNote: "37% (37% fed, no WA income tax)",
    taxNoteZh: "37%（联邦37%，华州无个人所得税）",
    stateCapGainsRate: 0,
    vacancyRate: 0.05,
    mgmtFeeRate: 0.09,
    capGainsRateSPBonus: 0.07,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Redmond WA",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI West Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0400SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI Seattle",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Redmond WA",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  manhattan: {
    propTaxRate: 0.012,
    txBuy: 0.02, // NYC mortgage recording tax ~1.8% + title; mansion tax 1%+
    txSell: 0.078, // commission ~5%, title 0.5%, NYC RPTT 1.425% + NYS 0.4%
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.5,
    stateRateGroup: "nyc",
    improvPct: 0.5,
    typicalYieldRange: [0.022, 0.036],
    propTaxNote: "NY: annual assessment; Manhattan condo effective rate ~1.2%",
    propTaxNoteZh: "纽约州：每年重新评估; 曼哈顿公寓有效税率约1.2%",
    taxNote: "~50% (37% fed + 10.9% NY state + 3.876% NYC)",
    taxNoteZh: "约50%（联邦37% + 纽约州10.9% + 纽约市3.876%）",
    stateCapGainsRate: 0.148,
    vacancyRate: 0.03,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Manhattan NY",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI Northeast Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0100SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI New York",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Manhattan",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  brooklyn: {
    propTaxRate: 0.015,
    txBuy: 0.02,
    txSell: 0.078,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.5,
    stateRateGroup: "nyc",
    improvPct: 0.4,
    typicalYieldRange: [0.026, 0.04],
    propTaxNote: "NY: annual assessment; Brooklyn effective rate ~1.5%",
    propTaxNoteZh: "纽约州：每年重新评估; 布鲁克林有效税率约1.5%",
    taxNote: "~50% (37% fed + 10.9% NY state + 3.876% NYC)",
    taxNoteZh: "约50%（联邦37% + 纽约州10.9% + 纽约市3.876%）",
    stateCapGainsRate: 0.148,
    vacancyRate: 0.03,
    mgmtFeeRate: 0.08,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Brooklyn NY",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI Northeast Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0100SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI New York",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Brooklyn",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  hoboken: {
    propTaxRate: 0.025,
    txBuy: 0.01,
    txSell: 0.07, // commission ~5%, title 0.5%, NJ realty transfer fee ~1.0%
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.47,
    stateRateGroup: "nj",
    improvPct: 0.5,
    typicalYieldRange: [0.028, 0.042],
    propTaxNote: "NJ: annual assessment; Hudson County Hoboken ~2.5%",
    propTaxNoteZh: "新泽西州：每年重新评估; 哈德逊县霍博肯约2.5%",
    taxNote: "47% (37% fed + 10.75% NJ state)",
    taxNoteZh: "47%（联邦37% + 新泽西州10.75%）",
    stateCapGainsRate: 0.108,
    vacancyRate: 0.05,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Hoboken NJ",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI Northeast Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0100SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI New York",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Hoboken NJ",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  scarsdale: {
    propTaxRate: 0.028,
    txSell: 0.064, // commission ~5%, title 0.5%, NYS transfer tax 0.4%
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.49,
    stateRateGroup: "nylocal",
    improvPct: 0.32,
    typicalYieldRange: [0.03, 0.045],
    propTaxNote: "NY: annual assessment; Westchester County Scarsdale ~2.8%",
    propTaxNoteZh: "纽约州：每年重新评估; 威彻斯特县斯卡斯代尔约2.8%",
    taxNote: "49% (37% fed + 10.9% NY state + 1% local)",
    taxNoteZh: "49%（联邦37% + 纽约州10.9% + 地方税1%）",
    stateCapGainsRate: 0.119,
    vacancyRate: 0.05,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Scarsdale NY",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI Northeast Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0100SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI New York",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Scarsdale NY",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
  greatneck: {
    propTaxRate: 0.025,
    txSell: 0.064,
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0,
    taxRate: 0.49,
    stateRateGroup: "nylocal",
    improvPct: 0.33,
    typicalYieldRange: [0.028, 0.042],
    propTaxNote: "NY: annual assessment; Nassau County Great Neck ~2.5%",
    propTaxNoteZh: "纽约州：每年重新评估; 拿骚县大颈约2.5%",
    taxNote: "49% (37% fed + 10.9% NY state + 1% local)",
    taxNoteZh: "49%（联邦37% + 纽约州10.9% + 地方税1%）",
    stateCapGainsRate: 0.119,
    vacancyRate: 0.05,
    mgmtFeeRate: 0.09,
    sources: {
      homePrice: [
        {
          text: "Zillow ZHVI Great Neck NY",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentPre2015: [
        {
          text: "BLS CPI Northeast Urban Rent",
          href: "https://fred.stlouisfed.org/series/CUUR0100SEHA",
        },
      ],
      rentPost2015: [
        {
          text: "Zillow ZORI New York",
          href: "https://www.zillow.com/research/data/",
        },
      ],
      rentYield: [
        {
          text: "Zillow ZHVI / ZORI Great Neck NY",
          href: "https://www.zillow.com/research/data/",
        },
      ],
    },
  },
};

// ── Income tiers & state rate groups ──────────────────────────────────────
const INCOME_TIERS = [
  { label: "$75K", fed: 0.22 },
  { label: "$150K", fed: 0.24 },
  { label: "$300K", fed: 0.32 },
  { label: "$500K", fed: 0.35 },
  { label: "$750K+", fed: 0.37 },
];

// State marginal rates indexed by income tier [75K, 150K, 300K, 500K, 750K+]
const STATE_INCOME_RATES = {
  ca: [0.093, 0.093, 0.093, 0.103, 0.113],
  none: [0, 0, 0, 0, 0],
  ny: [0.059, 0.059, 0.059, 0.069, 0.069],
  nyc: [0.097, 0.097, 0.097, 0.107, 0.107],
  nj: [0.064, 0.064, 0.064, 0.09, 0.108],
  nylocal: [0.069, 0.069, 0.069, 0.079, 0.079],
  national: [0.03, 0.04, 0.05, 0.055, 0.06],
};

function getMarginalRate(locCfg, tierIdx) {
  const stateRate = (STATE_INCOME_RATES[locCfg.stateRateGroup] ??
    STATE_INCOME_RATES.national)[tierIdx];
  return INCOME_TIERS[tierIdx].fed + stateRate;
}

function getTaxNote(locCfg, tierIdx, isZh) {
  const tier = INCOME_TIERS[tierIdx];
  const stateRate = (STATE_INCOME_RATES[locCfg.stateRateGroup] ??
    STATE_INCOME_RATES.national)[tierIdx];
  const combined = ((tier.fed + stateRate) * 100).toFixed(1);
  const statePct = (stateRate * 100).toFixed(1);
  const fedPct = Math.round(tier.fed * 100);
  if (isZh) return `${combined}%（联邦${fedPct}%+州${statePct}%）`;
  return stateRate > 0
    ? `${combined}% (${fedPct}% fed + ${statePct}% state)`
    : `${combined}% (${fedPct}% fed, no state income tax)`;
}

const LOCATION_HIERARCHY = [
  {
    key: "ca",
    label: "California",
    abbr: "CA",
    metros: [
      {
        key: "oc",
        label: "Orange County",
        abbr: "OC",
        cities: [
          { key: "nb", label: "Newport Beach", abbr: "NWPB" },
          { key: "irvine", label: "Irvine", abbr: "IRVN" },
          { key: "yorba", label: "Yorba Linda", abbr: "YBAL" },
          { key: "laguna", label: "Laguna Beach", abbr: "LGNB" },
          { key: "hb", label: "Huntington Beach", abbr: "HNBN" },
        ],
      },
      {
        key: "la",
        label: "Los Angeles",
        abbr: "LA",
        cities: [
          { key: "bevhills", label: "Beverly Hills", abbr: "BVHL" },
          { key: "sm", label: "Santa Monica", abbr: "SMCA" },
          { key: "malibu", label: "Malibu", abbr: "MLIB" },
          { key: "pasadena", label: "Pasadena", abbr: "PSDN" },
          { key: "mb", label: "Manhattan Beach", abbr: "MNBH" },
        ],
      },
      {
        key: "sd",
        label: "San Diego",
        abbr: "SD",
        cities: [
          { key: "lajolla", label: "La Jolla", abbr: "LAJO" },
          { key: "delmar", label: "Del Mar", abbr: "DLMR" },
          { key: "rsf", label: "Rancho Santa Fe", abbr: "RNSF" },
          { key: "coronado", label: "Coronado", abbr: "CORN" },
          { key: "carlsbad", label: "Carlsbad", abbr: "CBAD" },
        ],
      },
      {
        key: "sf",
        label: "Bay Area",
        abbr: "SF Bay",
        cities: [
          { key: "paloalto", label: "Palo Alto", abbr: "PALT" },
          { key: "atherton", label: "Atherton", abbr: "ATHN" },
          { key: "losaltos", label: "Los Altos", abbr: "LALT" },
          { key: "menlopark", label: "Menlo Park", abbr: "MNPK" },
          { key: "saratoga", label: "Saratoga", abbr: "SRTG" },
        ],
      },
      { key: "ca", label: "Statewide", abbr: "CA", cities: [] },
    ],
  },
  {
    key: "tx",
    label: "Texas",
    abbr: "TX",
    metros: [
      {
        key: "dfw",
        label: "Dallas-Fort Worth",
        abbr: "DFW",
        cities: [
          { key: "highlandpark", label: "Highland Park", abbr: "HGPK" },
          { key: "universitypk", label: "University Park", abbr: "UNPK" },
          { key: "southlake", label: "Southlake", abbr: "SLKE" },
          { key: "frisco", label: "Frisco", abbr: "FRSC" },
          { key: "plano", label: "Plano", abbr: "PLNO" },
        ],
      },
      { key: "tx", label: "Statewide", abbr: "TX", cities: [] },
    ],
  },
  {
    key: "fl",
    label: "Florida",
    abbr: "FL",
    metros: [
      {
        key: "miami",
        label: "Miami",
        abbr: "Miami",
        cities: [
          { key: "miamibeach", label: "Miami Beach", abbr: "MIBH" },
          { key: "coralgables", label: "Coral Gables", abbr: "CGAB" },
          { key: "keybiscayne", label: "Key Biscayne", abbr: "KBSC" },
          { key: "coconutgrove", label: "Coconut Grove", abbr: "CGRV" },
          { key: "brickell", label: "Brickell", abbr: "BRKL" },
        ],
      },
      { key: "fl", label: "Statewide", abbr: "FL", cities: [] },
    ],
  },
  {
    key: "wa",
    label: "Washington",
    abbr: "WA",
    metros: [
      {
        key: "seattle",
        label: "Seattle",
        abbr: "Seattle",
        cities: [
          { key: "medina", label: "Medina", abbr: "MEDN" },
          { key: "mercerisland", label: "Mercer Island", abbr: "MRIS" },
          { key: "bellevue", label: "Bellevue", abbr: "BELL" },
          { key: "kirkland", label: "Kirkland", abbr: "KRKL" },
          { key: "redmond", label: "Redmond", abbr: "RDMN" },
        ],
      },
      { key: "wa", label: "Statewide", abbr: "WA", cities: [] },
    ],
  },
  {
    key: "ny",
    label: "New York",
    abbr: "NY",
    metros: [
      {
        key: "nyc",
        label: "New York City",
        abbr: "NYC",
        cities: [
          { key: "manhattan", label: "Manhattan", abbr: "MHTN" },
          { key: "brooklyn", label: "Brooklyn", abbr: "BKLN" },
          { key: "hoboken", label: "Hoboken", abbr: "HBKN" },
          { key: "scarsdale", label: "Scarsdale", abbr: "SCRS" },
          { key: "greatneck", label: "Great Neck", abbr: "GTNK" },
        ],
      },
      { key: "ny", label: "Statewide", abbr: "NY", cities: [] },
    ],
  },
  {
    key: "national",
    label: "National",
    abbr: "Natl",
    metros: [
      { key: "national", label: "National RE", abbr: "Natl", cities: [] },
    ],
  },
];

const INDEX_SOURCES = {
  sp500: {
    returns: [
      {
        text: "Macrotrends (price)",
        href: "https://www.macrotrends.net/2526/sp-500-historical-annual-returns",
      },
      {
        text: "multpl.com (dividends)",
        href: "https://www.multpl.com/s-p-500-dividend-yield/table/by-year",
      },
    ],
    live: [
      {
        text: "FMP API",
        href: "https://financialmodelingprep.com/developer/docs",
      },
    ],
  },
  nasdaq: {
    returns: [
      {
        text: "Macrotrends NASDAQ",
        href: "https://www.macrotrends.net/1320/nasdaq-historical-chart",
      },
      {
        text: "multpl.com (dividends)",
        href: "https://www.multpl.com/nasdaq-dividend-yield/table/by-year",
      },
    ],
    live: [
      {
        text: "FMP API",
        href: "https://financialmodelingprep.com/developer/docs",
      },
    ],
  },
  sixty40: {
    returns: [
      {
        text: "Macrotrends S&P 500",
        href: "https://www.macrotrends.net/2526/sp-500-historical-annual-returns",
      },
      {
        text: "Damodaran LT Govt Bond (pre-2002)",
        href: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html",
      },
      {
        text: "TLT (iShares 20+ Yr Treasury, 2002+)",
        href: "https://finance.yahoo.com/quote/TLT/history/",
      },
    ],
    live: [
      {
        text: "FMP API",
        href: "https://financialmodelingprep.com/developer/docs",
      },
    ],
  },
};

// Texas (Dallas/Houston/Austin composite) price appreciation, 1970–2045

// ── Orange County CA (FHFA MSAD 11244 — Anaheim-Santa Ana-Irvine; pre-1976 est) ──
const OC_ANN = [
  // 1970–1975 (est — pre-FHFA, based on CAR statewide data)
  0.02, 0.07, 0.09, 0.15, 0.12, 0.14,
  // 1976–1985 (FHFA MSAD 11244)
  0.2295, 0.2916, 0.0936, 0.1497, 0.1643, 0.1074, -0.0109, 0.0249, 0.012,
  0.0414,
  // 1986–1994
  0.0744, 0.1288, 0.2521, 0.1609, -0.0204, -0.0026, -0.0349, -0.0524, -0.0658,
  // 1995–1999
  0.0053, -0.0072, 0.0487, 0.1276, 0.0783,
  // 2000–2013
  0.12, 0.1018, 0.1502, 0.1731, 0.2746, 0.1921, 0.0413, -0.0927, -0.1981,
  -0.0239, -0.001, -0.0423, 0.0314, 0.1539,
  // 2014–2024
  0.0597, 0.0573, 0.0496, 0.0518, 0.0396, 0.0237, 0.0433, 0.159, 0.1174, 0.0751,
  0.0734,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];
const OC_RENT_GROWTH = [
  // 1970–1977 (BLS CUURA421SEHA — LA/OC metro)
  0.0568, 0.0391, 0.0141, 0.0325, 0.0539, 0.0512, 0.0771, 0.0942,
  // 1978–2015 (BLS CUURA421SEHA — LA/OC metro; BLS does not separate OC from LA)
  0.0998,
  0.1033, 0.1092, 0.1176, 0.0858, 0.0622, 0.0794, 0.091, 0.0708, 0.0425, 0.037,
  0.059, 0.0419, 0.0204, 0.0058, 0.0006, 0.0083, -0.0089, 0.0141, 0.0165,
  0.0299, 0.0369, 0.0403, 0.0634, 0.047, 0.0585, 0.069, 0.0601, 0.0563, 0.0595,
  0.0438, 0.0068, 0.0007, 0.0129, 0.0256, 0.0273, 0.0269, 0.0389,
  // 2016–2024 (Zillow ZORI LA metro, approx for OC)
  0.0656, 0.0742, 0.031, 0.0195, 0.0216, 0.093, 0.1028, 0.0638, 0.0033,
  // 2025 (estimate)
  0.02,
  // 2026 (estimate)
  0.02,
];
const OC_RENT_YIELDS = [
  // 1970–1993 (similar to LA, slightly lower as OC premium)
  0.072, 0.072, 0.068, 0.065, 0.062, 0.058, 0.055, 0.052, 0.05, 0.048, 0.05,
  0.053, 0.058, 0.06, 0.062, 0.062, 0.06, 0.056, 0.052, 0.049, 0.051, 0.055,
  0.06, 0.065,
  // 1994–2024
  0.069, 0.07, 0.067, 0.062, 0.055, 0.049, 0.043, 0.038, 0.034, 0.03, 0.026,
  0.023, 0.022, 0.025, 0.033, 0.04, 0.044, 0.048, 0.046, 0.042, 0.04, 0.038,
  0.036, 0.035, 0.035, 0.035, 0.033, 0.029, 0.027, 0.03, 0.031,
  // 2025 (estimate)
  0.031,
  // 2026 (estimate)
  0.031,
];

// ── OC Cities — derived from Zillow ZHVI city-level + FHFA OC HPI base ──────

// Newport Beach (nb) — ultra-luxury coastal; ~2.5–3× OC median; higher volatility
const NB_ANN = [
  // 1970–1975
  0.022, 0.077, 0.099, 0.165, 0.132, 0.154,
  // 1976–1985
  0.252, 0.321, 0.103, 0.165, 0.181, 0.118, -0.013, 0.027, 0.013, 0.046,
  // 1986–1994
  0.082, 0.142, 0.277, 0.177, -0.023, -0.003, -0.04, -0.06, -0.076,
  // 1995–1999
  0.006, -0.008, 0.054, 0.14, 0.086,
  // 2000–2013 (luxury boom amplified; GFC deeper)
  0.144, 0.122, 0.18, 0.208, 0.33, 0.231, 0.05, -0.111, -0.238, -0.029, -0.001,
  -0.049, 0.035, 0.169,
  // 2014–2024 (2018 luxury softened; 2021–22 surge)
  0.066, 0.063, 0.055, 0.057, 0.03, 0.031, 0.065, 0.239, 0.153, 0.045, 0.059,
  // 2025–2026 (estimate)
  0.03, 0.03,
];
const NB_RENT_GROWTH = [
  // 1970–1977 (luxury rent less elastic: OC × 0.85)
  0.048, 0.033, 0.012, 0.028, 0.046, 0.044, 0.066, 0.08,
  // 1978–2015
  0.085, 0.088, 0.093, 0.1, 0.073, 0.053, 0.067, 0.077, 0.06, 0.036, 0.032,
  0.05, 0.036, 0.017, 0.005, 0.001, 0.007, -0.008, 0.012, 0.014, 0.025, 0.031,
  0.034, 0.054, 0.04, 0.05, 0.059, 0.051, 0.048, 0.051, 0.037, 0.006, 0.001,
  0.011, 0.022, 0.023, 0.023, 0.033,
  // 2016–2024
  0.056, 0.063, 0.026, 0.017, 0.018, 0.079, 0.087, 0.054, 0.003,
  // 2025–2026
  0.017, 0.017,
];
const NB_RENT_YIELDS = [
  // 1970–1993 (OC × 0.65)
  0.047, 0.047, 0.044, 0.042, 0.04, 0.038, 0.036, 0.034, 0.033, 0.031, 0.033,
  0.034, 0.038, 0.039, 0.04, 0.04, 0.039, 0.036, 0.034, 0.032, 0.033, 0.036,
  0.039, 0.042,
  // 1994–2024
  0.045, 0.046, 0.044, 0.04, 0.036, 0.032, 0.028, 0.025, 0.022, 0.02, 0.017,
  0.015, 0.014, 0.016, 0.021, 0.026, 0.029, 0.031, 0.03, 0.027, 0.026, 0.025,
  0.023, 0.023, 0.023, 0.023, 0.021, 0.019, 0.018, 0.02, 0.02,
  // 2025–2026
  0.02, 0.02,
];

// Irvine (irvine) — planned community, tech hub; stable growth; ~1.3× OC median
const IRVINE_ANN = [
  // 1970–1975
  0.018, 0.063, 0.081, 0.135, 0.108, 0.126,
  // 1976–1985
  0.207, 0.262, 0.084, 0.135, 0.148, 0.097, -0.009, 0.022, 0.011, 0.037,
  // 1986–1994
  0.067, 0.116, 0.227, 0.145, -0.017, -0.002, -0.03, -0.045, -0.056,
  // 1995–1999
  0.005, -0.006, 0.044, 0.115, 0.071,
  // 2000–2013 (more resilient in GFC; above avg recovery with Chinese demand)
  0.114, 0.097, 0.143, 0.164, 0.261, 0.183, 0.039, -0.079, -0.168, -0.02,
  -0.001, -0.036, 0.033, 0.162,
  // 2014–2024 (tech + foreign demand premium)
  0.066, 0.063, 0.055, 0.057, 0.044, 0.026, 0.05, 0.175, 0.129, 0.079, 0.077,
  // 2025–2026
  0.03, 0.03,
];
const IRVINE_RENT_GROWTH = [
  // 1970–1977 (strong rental market; OC × 1.00)
  0.057, 0.039, 0.014, 0.033, 0.054, 0.051, 0.077, 0.094,
  // 1978–2015
  0.1, 0.103, 0.109, 0.118, 0.086, 0.062, 0.079, 0.091, 0.071, 0.043, 0.037,
  0.059, 0.042, 0.02, 0.006, 0.001, 0.008, -0.009, 0.014, 0.017, 0.03, 0.037,
  0.04, 0.063, 0.047, 0.059, 0.069, 0.06, 0.056, 0.06, 0.044, 0.007, 0.001,
  0.013, 0.026, 0.027, 0.027, 0.039,
  // 2016–2024
  0.066, 0.074, 0.031, 0.02, 0.022, 0.093, 0.103, 0.064, 0.003,
  // 2025–2026
  0.02, 0.02,
];
const IRVINE_RENT_YIELDS = [
  // 1970–1993 (OC × 0.88)
  0.063, 0.063, 0.06, 0.057, 0.055, 0.051, 0.048, 0.046, 0.044, 0.042, 0.044,
  0.047, 0.051, 0.053, 0.055, 0.055, 0.053, 0.049, 0.046, 0.043, 0.045, 0.048,
  0.053, 0.057,
  // 1994–2024
  0.061, 0.062, 0.059, 0.055, 0.048, 0.043, 0.038, 0.033, 0.03, 0.026, 0.023,
  0.02, 0.019, 0.022, 0.029, 0.035, 0.039, 0.042, 0.04, 0.037, 0.035, 0.033,
  0.032, 0.031, 0.031, 0.031, 0.029, 0.026, 0.024, 0.026, 0.027,
  // 2025–2026
  0.027, 0.027,
];

// Yorba Linda (yorba) — luxury suburban; ~1.1× OC median; moderate premium
const YORBA_ANN = [
  // 1970–1975
  0.021, 0.074, 0.095, 0.158, 0.126, 0.147,
  // 1976–1985
  0.241, 0.306, 0.098, 0.157, 0.173, 0.113, -0.011, 0.026, 0.013, 0.043,
  // 1986–1994
  0.078, 0.135, 0.265, 0.169, -0.021, -0.003, -0.037, -0.055, -0.069,
  // 1995–1999
  0.006, -0.008, 0.051, 0.134, 0.082,
  // 2000–2013
  0.126, 0.107, 0.158, 0.182, 0.288, 0.202, 0.043, -0.097, -0.208, -0.025,
  -0.001, -0.044, 0.033, 0.162,
  // 2014–2024 (suburban COVID boom)
  0.063, 0.06, 0.052, 0.054, 0.042, 0.025, 0.047, 0.172, 0.127, 0.079, 0.077,
  // 2025–2026
  0.03, 0.03,
];
const YORBA_RENT_GROWTH = [
  // 1970–1977 (SFR-focused; OC × 0.97)
  0.055, 0.038, 0.014, 0.032, 0.052, 0.05, 0.075, 0.091,
  // 1978–2015
  0.097, 0.1, 0.106, 0.114, 0.083, 0.06, 0.077, 0.088, 0.069, 0.041, 0.036,
  0.057, 0.041, 0.02, 0.006, 0.001, 0.008, -0.009, 0.014, 0.016, 0.029, 0.036,
  0.039, 0.062, 0.046, 0.057, 0.067, 0.058, 0.055, 0.058, 0.042, 0.007, 0.001,
  0.013, 0.025, 0.026, 0.026, 0.038,
  // 2016–2024
  0.064, 0.072, 0.03, 0.019, 0.021, 0.09, 0.1, 0.062, 0.003,
  // 2025–2026
  0.019, 0.019,
];
const YORBA_RENT_YIELDS = [
  // 1970–1993 (OC × 0.90)
  0.065, 0.065, 0.061, 0.059, 0.056, 0.052, 0.05, 0.047, 0.045, 0.043, 0.045,
  0.048, 0.052, 0.054, 0.056, 0.056, 0.054, 0.05, 0.047, 0.044, 0.046, 0.05,
  0.054, 0.059,
  // 1994–2024
  0.062, 0.063, 0.06, 0.056, 0.05, 0.044, 0.039, 0.034, 0.031, 0.027, 0.023,
  0.021, 0.02, 0.023, 0.03, 0.036, 0.04, 0.043, 0.041, 0.038, 0.036, 0.034,
  0.032, 0.032, 0.032, 0.032, 0.03, 0.026, 0.024, 0.027, 0.028,
  // 2025–2026
  0.028, 0.028,
];

// Laguna Beach (laguna) — ultra-coastal luxury/arts; ~3× OC median; extreme volatility
const LAGUNA_ANN = [
  // 1970–1975
  0.023, 0.081, 0.104, 0.173, 0.138, 0.161,
  // 1976–1985
  0.264, 0.335, 0.108, 0.172, 0.189, 0.124, -0.013, 0.029, 0.014, 0.048,
  // 1986–1994
  0.086, 0.148, 0.29, 0.185, -0.024, -0.003, -0.042, -0.063, -0.079,
  // 1995–1999
  0.006, -0.009, 0.056, 0.147, 0.09,
  // 2000–2013 (luxury boom strongest; GFC deepest)
  0.15, 0.127, 0.188, 0.216, 0.343, 0.24, 0.052, -0.121, -0.258, -0.031, -0.001,
  -0.049, 0.035, 0.169,
  // 2014–2024 (2018 luxury cooled; 2020–22 surge extreme)
  0.066, 0.063, 0.055, 0.057, 0.032, 0.031, 0.069, 0.254, 0.158, 0.045, 0.066,
  // 2025–2026
  0.03, 0.03,
];
const LAGUNA_RENT_GROWTH = [
  // 1970–1977 (ultra-luxury rent very inelastic: OC × 0.80)
  0.045, 0.031, 0.011, 0.026, 0.043, 0.041, 0.062, 0.075,
  // 1978–2015
  0.08, 0.083, 0.087, 0.094, 0.069, 0.05, 0.064, 0.073, 0.057, 0.034, 0.03,
  0.047, 0.034, 0.016, 0.005, 0.0, 0.007, -0.007, 0.011, 0.013, 0.024, 0.03,
  0.032, 0.051, 0.038, 0.047, 0.055, 0.048, 0.045, 0.048, 0.035, 0.005, 0.001,
  0.01, 0.02, 0.022, 0.022, 0.031,
  // 2016–2024
  0.052, 0.059, 0.025, 0.016, 0.017, 0.074, 0.082, 0.051, 0.003,
  // 2025–2026
  0.016, 0.016,
];
const LAGUNA_RENT_YIELDS = [
  // 1970–1993 (OC × 0.58 — ultra-premium price/rent ratio)
  0.042, 0.042, 0.039, 0.038, 0.036, 0.034, 0.032, 0.03, 0.029, 0.028, 0.029,
  0.031, 0.034, 0.035, 0.036, 0.036, 0.035, 0.032, 0.03, 0.028, 0.03, 0.032,
  0.035, 0.038,
  // 1994–2024
  0.04, 0.041, 0.039, 0.036, 0.032, 0.028, 0.025, 0.022, 0.02, 0.017, 0.015,
  0.013, 0.013, 0.015, 0.019, 0.023, 0.026, 0.028, 0.027, 0.024, 0.023, 0.022,
  0.021, 0.02, 0.02, 0.02, 0.019, 0.017, 0.016, 0.017, 0.018,
  // 2025–2026
  0.018, 0.018,
];

// Huntington Beach (hb) — surf city coastal; ~1.1× OC median; solid rental market
const HB_ANN = [
  // 1970–1975
  0.021, 0.074, 0.095, 0.158, 0.126, 0.147,
  // 1976–1985
  0.241, 0.306, 0.098, 0.157, 0.173, 0.113, -0.011, 0.026, 0.013, 0.043,
  // 1986–1994
  0.078, 0.135, 0.265, 0.169, -0.021, -0.003, -0.036, -0.053, -0.067,
  // 1995–1999
  0.006, -0.007, 0.051, 0.134, 0.082,
  // 2000–2013
  0.126, 0.107, 0.158, 0.182, 0.288, 0.202, 0.043, -0.095, -0.202, -0.024,
  -0.001, -0.043, 0.033, 0.162,
  // 2014–2024 (coastal premium in COVID)
  0.063, 0.06, 0.052, 0.054, 0.042, 0.025, 0.048, 0.175, 0.129, 0.079, 0.077,
  // 2025–2026
  0.03, 0.03,
];
const HB_RENT_GROWTH = [
  // 1970–1977 (coastal rental demand; OC × 1.00)
  0.057, 0.039, 0.014, 0.033, 0.054, 0.051, 0.077, 0.094,
  // 1978–2015
  0.1, 0.103, 0.109, 0.118, 0.086, 0.062, 0.079, 0.091, 0.071, 0.043, 0.037,
  0.059, 0.042, 0.02, 0.006, 0.001, 0.008, -0.009, 0.014, 0.017, 0.03, 0.037,
  0.04, 0.063, 0.047, 0.059, 0.069, 0.06, 0.056, 0.06, 0.044, 0.007, 0.001,
  0.013, 0.026, 0.027, 0.027, 0.039,
  // 2016–2024
  0.066, 0.074, 0.031, 0.02, 0.022, 0.093, 0.103, 0.064, 0.003,
  // 2025–2026
  0.02, 0.02,
];
const HB_RENT_YIELDS = [
  // 1970–1993 (OC × 0.93 — coastal but mass market)
  0.067, 0.067, 0.063, 0.06, 0.058, 0.054, 0.051, 0.048, 0.047, 0.045, 0.047,
  0.049, 0.054, 0.056, 0.058, 0.058, 0.056, 0.052, 0.048, 0.046, 0.047, 0.051,
  0.056, 0.06,
  // 1994–2024
  0.064, 0.065, 0.062, 0.058, 0.051, 0.046, 0.04, 0.035, 0.032, 0.028, 0.024,
  0.021, 0.02, 0.023, 0.031, 0.037, 0.041, 0.045, 0.043, 0.039, 0.037, 0.035,
  0.033, 0.033, 0.033, 0.033, 0.031, 0.027, 0.025, 0.028, 0.029,
  // 2025–2026
  0.029, 0.029,
];

// ═══════════════════════════════════════════════════════
// CITY DATA ARRAYS — 2026-02-24
// Derived from parent metro data with city-specific scaling.
// Sources: Zillow ZHVI (city-level, 1996+), FHFA HPI (metro, pre-1996).
// Pre-1996 values estimated from metro data × city premium ratios.
// ═══════════════════════════════════════════════════════

// ── LA cities ────────────────────────────────────────────
// Beverly Hills (bevhills) — LA boom×1.12 bust×0.88; rent×0.88; yield×0.8
// Beverly Hills price appreciation 1970–2026
const BEVHILLS_ANN = [
  0.021,
  0.074,
  0.095,
  0.168,
  0.134,
  0.157,
  0.24,
  0.288,
  0.199,
  0.217,
  0.15,
  0.074,
  -0.011,
  0.038,
  0.044,
  0.071,
  0.09,
  0.176,
  0.265,
  0.225,
  -0.005,
  -0.005,
  -0.041,
  -0.058,
  -0.084,
  0.02,
  -0.026,
  0.051,
  0.113,
  0.061,
  0.095,
  0.112,
  0.17,
  0.202,
  0.307,
  0.265,
  0.084,
  -0.058,
  -0.201,
  -0.048,
  -0.006,
  -0.037,
  0.024,
  0.167,
  0.082,
  0.072,
  0.07,
  0.074,
  0.057,
  0.035,
  0.057,
  0.193,
  0.085,
  0.048, // 2025 (estimate)
  0.06,
  0.032,
  0.032, // 2026 (estimate)
];
// Beverly Hills rent growth 1970–2026
const BEVHILLS_RENT_GROWTH = [
  0.05,
  0.0344,
  0.0124,
  0.0286,
  0.0474,
  0.0451,
  0.0678,
  0.0829,
  0.0878,
  0.0909,
  0.0961,
  0.1035,
  0.0755,
  0.0547,
  0.0699,
  0.0801,
  0.0623,
  0.0374,
  0.0326,
  0.0519,
  0.0369,
  0.018,
  0.0051,
  0.0005,
  0.0073,
  -0.0078,
  0.0124,
  0.0145,
  0.0263,
  0.0325,
  0.0355,
  0.0558,
  0.0414,
  0.0515,
  0.0607,
  0.0529,
  0.0495,
  0.0524,
  0.0385,
  0.006,
  0.0006,
  0.0114,
  0.0225,
  0.024,
  0.0237,
  0.0342,
  0.0577, // 2025 (estimate)
  0.0653,
  0.0273,
  0.0172,
  0.019,
  0.0818,
  0.0905,
  0.0561,
  0.0029,
  0.0176,
  0.0176, // 2026 (estimate)
];
// Beverly Hills gross rent yields 1970–2026
const BEVHILLS_RENT_YIELDS = [
  0.06, 0.06, 0.056, 0.054, 0.052, 0.05, 0.046, 0.044, 0.042, 0.041, 0.042,
  0.044, 0.048, 0.05, 0.052, 0.052, 0.05, 0.047, 0.044, 0.042, 0.043, 0.046,
  0.05, 0.054, 0.058, 0.058, 0.056, 0.053, 0.048, 0.043, 0.039, 0.035, 0.032,
  0.029, 0.026, 0.023, 0.022, 0.024, 0.03, 0.035, 0.038, 0.042, 0.04, 0.037,
  0.035, 0.034, 0.032, 0.031, 0.031, 0.031, 0.03, 0.026, 0.025, 0.026, 0.026,
  0.026, 0.026,
];

// Santa Monica (sm) — LA boom×1.08 bust×0.93; rent×0.93; yield×0.88
// Santa Monica price appreciation 1970–2026
const SM_ANN = [
  0.021,
  0.072,
  0.093,
  0.162,
  0.13,
  0.151,
  0.231,
  0.278,
  0.192,
  0.21,
  0.145,
  0.072,
  -0.01,
  0.037,
  0.043,
  0.07,
  0.089,
  0.17,
  0.256,
  0.217,
  -0.005,
  -0.005,
  -0.04,
  -0.061,
  -0.088,
  0.02,
  -0.026,
  0.05,
  0.109,
  0.06,
  0.093,
  0.108,
  0.164,
  0.194,
  0.296,
  0.256,
  0.082,
  -0.061,
  -0.212,
  -0.051,
  -0.006,
  -0.039,
  0.024,
  0.161,
  0.08,
  0.071,
  0.069,
  0.072,
  0.056,
  0.034,
  0.056,
  0.186,
  0.083,
  0.047, // 2025 (estimate)
  0.059,
  0.031,
  0.031, // 2026 (estimate)
];
// Santa Monica rent growth 1970–2026
const SM_RENT_GROWTH = [
  0.0528,
  0.0364,
  0.0131,
  0.0302,
  0.0501,
  0.0476,
  0.0717,
  0.0876,
  0.0928,
  0.0961,
  0.1016,
  0.1094,
  0.0798,
  0.0578,
  0.0738,
  0.0846,
  0.0658,
  0.0395,
  0.0344,
  0.0549,
  0.039,
  0.019,
  0.0054,
  0.0006,
  0.0077,
  -0.0083,
  0.0131,
  0.0153,
  0.0278,
  0.0343,
  0.0375,
  0.059,
  0.0437,
  0.0544,
  0.0642,
  0.0559,
  0.0524,
  0.0553,
  0.0407,
  0.0063,
  0.0007,
  0.012,
  0.0238,
  0.0254,
  0.025,
  0.0362,
  0.061,
  0.069, // 2025 (estimate)
  0.0288,
  0.0181,
  0.0201,
  0.0865,
  0.0956,
  0.0593,
  0.0031,
  0.0186,
  0.0186, // 2026 (estimate)
];
// Santa Monica gross rent yields 1970–2026
const SM_RENT_YIELDS = [
  0.066, 0.066, 0.062, 0.06, 0.057, 0.055, 0.051, 0.048, 0.047, 0.045, 0.046,
  0.048, 0.053, 0.055, 0.057, 0.057, 0.055, 0.052, 0.048, 0.046, 0.048, 0.051,
  0.055, 0.06, 0.063, 0.064, 0.062, 0.058, 0.053, 0.048, 0.043, 0.039, 0.035,
  0.032, 0.028, 0.026, 0.025, 0.026, 0.033, 0.039, 0.042, 0.046, 0.044, 0.04,
  0.039, 0.037, 0.035, 0.034, 0.034, 0.034, 0.033, 0.029, 0.027, 0.029, 0.029,
  0.029, 0.029,
];

// Malibu (malibu) — LA boom×1.22 bust×0.8; rent×0.72; yield×0.6
// Malibu price appreciation 1970–2026
const MALIBU_ANN = [
  0.021,
  0.074,
  0.095,
  0.183,
  0.146,
  0.171,
  0.261,
  0.314,
  0.217,
  0.237,
  0.163,
  0.074,
  -0.011,
  0.038,
  0.044,
  0.071,
  0.09,
  0.192,
  0.289,
  0.245,
  -0.005,
  -0.005,
  -0.041,
  -0.053,
  -0.076,
  0.02,
  -0.026,
  0.051,
  0.123,
  0.061,
  0.095,
  0.122,
  0.185,
  0.22,
  0.334,
  0.289,
  0.084,
  -0.053,
  -0.182,
  -0.044,
  -0.006,
  -0.034,
  0.024,
  0.182,
  0.082,
  0.072,
  0.07,
  0.074,
  0.057,
  0.035,
  0.057,
  0.21,
  0.085, // 2025 (estimate)
  0.048,
  0.06,
  0.032,
  0.032, // 2026 (estimate)
];
// Malibu rent growth 1970–2026
const MALIBU_RENT_GROWTH = [
  0.0409,
  0.0282,
  0.0102,
  0.0234,
  0.0388,
  0.0369,
  0.0555,
  0.0678,
  0.0719,
  0.0744,
  0.0786,
  0.0847,
  0.0618,
  0.0448,
  0.0572,
  0.0655,
  0.051,
  0.0306,
  0.0266,
  0.0425,
  0.0302,
  0.0147,
  0.0042,
  0.0004,
  0.006,
  -0.0064,
  0.0102,
  0.0119,
  0.0215,
  0.0266,
  0.029,
  0.0456,
  0.0338,
  0.0421,
  0.0497,
  0.0433,
  0.0405,
  0.0428,
  0.0315,
  0.0049,
  0.0005,
  0.0093,
  0.0184,
  0.0197,
  0.0194,
  0.028,
  0.0472,
  0.0534, // 2025 (estimate)
  0.0223,
  0.014,
  0.0156,
  0.067,
  0.074,
  0.0459,
  0.0024,
  0.0144,
  0.0144, // 2026 (estimate)
];
// Malibu gross rent yields 1970–2026
const MALIBU_RENT_YIELDS = [
  0.045, 0.045, 0.042, 0.041, 0.039, 0.037, 0.035, 0.033, 0.032, 0.031, 0.031,
  0.033, 0.036, 0.037, 0.039, 0.039, 0.038, 0.035, 0.033, 0.031, 0.032, 0.035,
  0.038, 0.041, 0.043, 0.044, 0.042, 0.04, 0.036, 0.032, 0.029, 0.026, 0.024,
  0.022, 0.019, 0.017, 0.017, 0.018, 0.023, 0.026, 0.029, 0.031, 0.03, 0.028,
  0.026, 0.025, 0.024, 0.023, 0.023, 0.023, 0.022, 0.02, 0.019, 0.02, 0.02,
  0.02, 0.02,
];

// Pasadena (pasadena) — LA boom×0.95 bust×0.98; rent×1.02; yield×1.08
// Pasadena price appreciation 1970–2026
const PASADENA_ANN = [
  0.02,
  0.069,
  0.088,
  0.142,
  0.114,
  0.133,
  0.203,
  0.244,
  0.169,
  0.184,
  0.127,
  0.069,
  -0.01,
  0.035,
  0.041,
  0.067,
  0.084,
  0.149,
  0.225,
  0.191,
  -0.005,
  -0.005,
  -0.038,
  -0.065,
  -0.093,
  0.019,
  -0.025,
  0.048,
  0.096,
  0.057,
  0.088,
  0.095,
  0.144,
  0.171,
  0.26,
  0.225,
  0.078,
  -0.065,
  -0.223,
  -0.054,
  -0.006,
  -0.041,
  0.023,
  0.142,
  0.076,
  0.068,
  0.066,
  0.069,
  0.053,
  0.032,
  0.053,
  0.163,
  0.079, // 2025 (estimate)
  0.045,
  0.056,
  0.029,
  0.029, // 2026 (estimate)
];
// Pasadena rent growth 1970–2026
const PASADENA_RENT_GROWTH = [
  0.0579,
  0.0399,
  0.0144,
  0.0331,
  0.055,
  0.0522,
  0.0786,
  0.0961,
  0.1018,
  0.1054,
  0.1114,
  0.12,
  0.0875,
  0.0634,
  0.081,
  0.0928,
  0.0722,
  0.0434,
  0.0377,
  0.0602,
  0.0427,
  0.0208,
  0.0059,
  0.0006,
  0.0085,
  -0.0091,
  0.0144,
  0.0168,
  0.0305,
  0.0376,
  0.0411,
  0.0647,
  0.0479,
  0.0597,
  0.0704,
  0.0613,
  0.0574,
  0.0607,
  0.0447,
  0.0069,
  0.0007,
  0.0132,
  0.0261,
  0.0278,
  0.0274,
  0.0397,
  0.0669, // 2025 (estimate)
  0.0757,
  0.0316,
  0.0199,
  0.022,
  0.0949,
  0.1049,
  0.0651,
  0.0034,
  0.0204,
  0.0204, // 2026 (estimate)
];
// Pasadena gross rent yields 1970–2026
const PASADENA_RENT_YIELDS = [
  0.081, 0.081, 0.076, 0.073, 0.07, 0.067, 0.063, 0.059, 0.057, 0.055, 0.056,
  0.059, 0.065, 0.067, 0.07, 0.07, 0.068, 0.064, 0.059, 0.056, 0.058, 0.063,
  0.068, 0.073, 0.078, 0.079, 0.076, 0.071, 0.065, 0.058, 0.053, 0.048, 0.043,
  0.039, 0.035, 0.031, 0.03, 0.032, 0.041, 0.048, 0.052, 0.056, 0.054, 0.05,
  0.048, 0.045, 0.043, 0.042, 0.042, 0.042, 0.04, 0.036, 0.033, 0.036, 0.036,
  0.036, 0.036,
];

// Manhattan Beach (mb) — LA boom×1.1 bust×0.91; rent×0.91; yield×0.85
// Manhattan Beach price appreciation 1970–2026
const MB_ANN = [
  0.021,
  0.073,
  0.094,
  0.165,
  0.132,
  0.154,
  0.235,
  0.283,
  0.196,
  0.213,
  0.147,
  0.073,
  -0.01,
  0.037,
  0.044,
  0.071,
  0.089,
  0.173,
  0.261,
  0.221,
  -0.005,
  -0.005,
  -0.041,
  -0.06,
  -0.086,
  0.02,
  -0.026,
  0.051,
  0.111,
  0.06,
  0.094,
  0.11,
  0.167,
  0.198,
  0.301,
  0.261,
  0.083,
  -0.06,
  -0.207,
  -0.05,
  -0.006,
  -0.038,
  0.024,
  0.164,
  0.081,
  0.072,
  0.07,
  0.073,
  0.056,
  0.034,
  0.056,
  0.189,
  0.084,
  0.048, // 2025 (estimate)
  0.059,
  0.031,
  0.031, // 2026 (estimate)
];
// Manhattan Beach rent growth 1970–2026
const MB_RENT_GROWTH = [
  0.0517,
  0.0356,
  0.0128,
  0.0296,
  0.049,
  0.0466,
  0.0702,
  0.0857,
  0.0908,
  0.094,
  0.0994,
  0.107,
  0.0781,
  0.0566,
  0.0723,
  0.0828,
  0.0644,
  0.0387,
  0.0337,
  0.0537,
  0.0381,
  0.0186,
  0.0053,
  0.0005,
  0.0076,
  -0.0081,
  0.0128,
  0.015,
  0.0272,
  0.0336,
  0.0367,
  0.0577,
  0.0428,
  0.0532,
  0.0628,
  0.0547,
  0.0512,
  0.0541,
  0.0399,
  0.0062,
  0.0006,
  0.0117,
  0.0233,
  0.0248,
  0.0245,
  0.0354,
  0.0597, // 2025 (estimate)
  0.0675,
  0.0282,
  0.0177,
  0.0197,
  0.0846,
  0.0935,
  0.0581,
  0.003,
  0.0182,
  0.0182, // 2026 (estimate)
];
// Manhattan Beach gross rent yields 1970–2026
const MB_RENT_YIELDS = [
  0.064, 0.064, 0.06, 0.058, 0.055, 0.053, 0.049, 0.047, 0.045, 0.043, 0.044,
  0.047, 0.051, 0.053, 0.055, 0.055, 0.054, 0.05, 0.047, 0.044, 0.046, 0.049,
  0.054, 0.058, 0.061, 0.062, 0.06, 0.056, 0.051, 0.046, 0.042, 0.037, 0.034,
  0.031, 0.027, 0.025, 0.024, 0.025, 0.032, 0.037, 0.041, 0.044, 0.043, 0.039,
  0.037, 0.036, 0.034, 0.033, 0.033, 0.033, 0.031, 0.028, 0.026, 0.028, 0.028,
  0.028, 0.028,
];

// ── SD cities ────────────────────────────────────────────
// La Jolla (lajolla) — SD boom×1.12 bust×0.88; rent×0.92; yield×0.86
// La Jolla price appreciation 1970–2026
const LAJOLLA_ANN = [
  0.031,
  0.073,
  0.094,
  0.179,
  0.134,
  0.146,
  0.189,
  0.337,
  0.202,
  0.225,
  -0.04,
  0.087,
  0.06,
  0.024,
  0.045,
  0.045,
  0.081,
  0.101,
  0.197,
  0.216,
  0.016,
  -0.002,
  -0.023,
  -0.027,
  -0.041,
  0.014,
  -0.007,
  0.049,
  0.127,
  0.116,
  0.172,
  0.131,
  0.193,
  0.189,
  0.305,
  0.122,
  -0.016,
  -0.085,
  -0.172,
  -0.033,
  0.0,
  -0.038,
  0.035,
  0.176,
  0.06,
  0.066,
  0.068,
  0.074,
  0.046,
  0.033,
  0.066,
  0.231,
  0.097, // 2025 (estimate)
  0.08,
  0.063,
  0.042,
  0.042, // 2026 (estimate)
];
// La Jolla rent growth 1970–2026
const LAJOLLA_RENT_GROWTH = [
  0.046,
  0.0368,
  0.0322,
  0.046,
  0.0515,
  0.0488,
  0.0524,
  0.0644,
  0.0743,
  0.11,
  0.0921,
  0.0859,
  0.0663,
  0.0562,
  0.0664,
  0.0729,
  0.0396,
  0.035,
  0.0308,
  0.0402,
  0.0405,
  0.0248,
  0.0223,
  0.0145,
  0.0161,
  0.0181,
  0.0213,
  0.032,
  0.0379,
  0.0364,
  0.0471,
  0.0558,
  0.0238,
  0.0246,
  0.0294,
  0.0302,
  0.0392,
  0.0453,
  0.0322,
  -0.0039,
  0.0053,
  0.0223,
  0.0272,
  0.0298,
  0.036,
  0.0437,
  0.0774,
  0.0725, // 2025 (estimate)
  0.0262,
  0.0201,
  -0.0163,
  0.1283,
  0.1019,
  0.081,
  0.0043,
  0.023,
  0.023, // 2026 (estimate)
];
// La Jolla gross rent yields 1970–2026
const LAJOLLA_RENT_YIELDS = [
  0.06, 0.06, 0.058, 0.055, 0.052, 0.05, 0.047, 0.045, 0.043, 0.041, 0.043,
  0.046, 0.05, 0.052, 0.054, 0.054, 0.052, 0.049, 0.045, 0.041, 0.043, 0.047,
  0.052, 0.056, 0.058, 0.058, 0.056, 0.052, 0.046, 0.04, 0.034, 0.03, 0.026,
  0.022, 0.019, 0.016, 0.016, 0.019, 0.026, 0.034, 0.039, 0.043, 0.04, 0.036,
  0.034, 0.033, 0.032, 0.031, 0.031, 0.031, 0.03, 0.026, 0.026, 0.028, 0.03,
  0.03, 0.03,
];

// Del Mar (delmar) — SD boom×1.16 bust×0.84; rent×0.87; yield×0.8
// Del Mar price appreciation 1970–2026
const DELMAR_ANN = [
  0.032,
  0.074,
  0.095,
  0.186,
  0.139,
  0.151,
  0.196,
  0.349,
  0.209,
  0.233,
  -0.038,
  0.088,
  0.061,
  0.024,
  0.045,
  0.045,
  0.082,
  0.102,
  0.204,
  0.224,
  0.016,
  -0.002,
  -0.023,
  -0.026,
  -0.039,
  0.014,
  -0.007,
  0.049,
  0.131,
  0.121,
  0.179,
  0.136,
  0.2,
  0.196,
  0.316,
  0.126,
  -0.016,
  -0.081,
  -0.164,
  -0.032,
  0.0,
  -0.036,
  0.036,
  0.182,
  0.061,
  0.066,
  0.068,
  0.075,
  0.046,
  0.034,
  0.066,
  0.239,
  0.098,
  0.081, // 2025 (estimate)
  0.064,
  0.042,
  0.042, // 2026 (estimate)
];
// Del Mar rent growth 1970–2026
const DELMAR_RENT_GROWTH = [
  0.0435,
  0.0348,
  0.0305,
  0.0435,
  0.0487,
  0.0461,
  0.0496,
  0.0609,
  0.0703,
  0.1041,
  0.0871,
  0.0813,
  0.0627,
  0.0532,
  0.0628,
  0.0689,
  0.0374,
  0.0331,
  0.0291,
  0.038,
  0.0383,
  0.0235,
  0.0211,
  0.0137,
  0.0152,
  0.0171,
  0.0201,
  0.0303,
  0.0358,
  0.0345,
  0.0445,
  0.0527,
  0.0225,
  0.0232,
  0.0278,
  0.0285,
  0.0371,
  0.0428,
  0.0305,
  -0.0037,
  0.005,
  0.0211,
  0.0258,
  0.0282,
  0.034,
  0.0413,
  0.0732,
  0.0686,
  0.0248,
  0.0191,
  -0.0154,
  0.1214,
  0.0964,
  0.0766,
  0.0041,
  0.0218, // 2025 (estimate)
  0.0218, // 2026 (estimate)
];
// Del Mar gross rent yields 1970–2026
const DELMAR_RENT_YIELDS = [
  0.056, 0.056, 0.054, 0.051, 0.049, 0.046, 0.044, 0.042, 0.04, 0.038, 0.04,
  0.042, 0.046, 0.048, 0.05, 0.05, 0.049, 0.046, 0.042, 0.038, 0.04, 0.044,
  0.048, 0.052, 0.054, 0.054, 0.052, 0.048, 0.042, 0.037, 0.032, 0.028, 0.024,
  0.021, 0.018, 0.015, 0.015, 0.018, 0.024, 0.032, 0.036, 0.04, 0.038, 0.034,
  0.032, 0.03, 0.03, 0.029, 0.029, 0.029, 0.028, 0.024, 0.024, 0.026, 0.028,
  0.028, 0.028,
];

// Rancho Santa Fe (rsf) — SD boom×1.28 bust×0.76; rent×0.72; yield×0.68
// Rancho Santa Fe price appreciation 1970–2026
const RSF_ANN = [
  0.032,
  0.076,
  0.097,
  0.205,
  0.154,
  0.166,
  0.216,
  0.385,
  0.23,
  0.257,
  -0.034,
  0.091,
  0.063,
  0.025,
  0.046,
  0.046,
  0.084,
  0.105,
  0.225,
  0.247,
  0.016,
  -0.002,
  -0.024,
  -0.024,
  -0.036,
  0.014,
  -0.008,
  0.051,
  0.145,
  0.133,
  0.197,
  0.15,
  0.22,
  0.216,
  0.348,
  0.14,
  -0.016,
  -0.074,
  -0.148,
  -0.029,
  0.0,
  -0.033,
  0.037,
  0.201,
  0.063,
  0.068,
  0.07,
  0.077,
  0.048,
  0.035,
  0.068,
  0.264,
  0.1,
  0.083,
  0.066, // 2025 (estimate)
  0.043,
  0.043, // 2026 (estimate)
];
// Rancho Santa Fe rent growth 1970–2026
const RSF_RENT_GROWTH = [
  0.036,
  0.0288,
  0.0252,
  0.036,
  0.0403,
  0.0382,
  0.041,
  0.0504,
  0.0582,
  0.0861,
  0.0721,
  0.0672,
  0.0519,
  0.044,
  0.052,
  0.057,
  0.031,
  0.0274,
  0.0241,
  0.0315,
  0.0317,
  0.0194,
  0.0174,
  0.0114,
  0.0126,
  0.0142,
  0.0166,
  0.0251,
  0.0297,
  0.0285,
  0.0369,
  0.0436,
  0.0186,
  0.0192,
  0.023,
  0.0236,
  0.0307,
  0.0354,
  0.0252,
  -0.003,
  0.0042,
  0.0174,
  0.0213,
  0.0233,
  0.0282,
  0.0342,
  0.0606,
  0.0567, // 2025 (estimate)
  0.0205,
  0.0158,
  -0.0127,
  0.1004,
  0.0798,
  0.0634,
  0.0034,
  0.018,
  0.018, // 2026 (estimate)
];
// Rancho Santa Fe gross rent yields 1970–2026
const RSF_RENT_YIELDS = [
  0.048, 0.048, 0.046, 0.044, 0.041, 0.039, 0.037, 0.035, 0.034, 0.033, 0.034,
  0.036, 0.039, 0.041, 0.043, 0.043, 0.041, 0.039, 0.035, 0.033, 0.034, 0.037,
  0.041, 0.044, 0.046, 0.046, 0.044, 0.041, 0.036, 0.031, 0.027, 0.024, 0.02,
  0.018, 0.015, 0.013, 0.013, 0.015, 0.02, 0.027, 0.031, 0.034, 0.032, 0.029,
  0.027, 0.026, 0.025, 0.024, 0.024, 0.024, 0.024, 0.02, 0.02, 0.022, 0.024,
  0.024, 0.024,
];

// Coronado (coronado) — SD boom×1.14 bust×0.87; rent×0.9; yield×0.84
// Coronado price appreciation 1970–2026
const CORONADO_ANN = [
  0.031,
  0.073,
  0.094,
  0.182,
  0.137,
  0.148,
  0.193,
  0.343,
  0.205,
  0.229,
  -0.039,
  0.087,
  0.06,
  0.024,
  0.045,
  0.045,
  0.081,
  0.101,
  0.201,
  0.22,
  0.016,
  -0.002,
  -0.023,
  -0.027,
  -0.041,
  0.014,
  -0.007,
  0.049,
  0.129,
  0.119,
  0.176,
  0.133,
  0.196,
  0.193,
  0.31,
  0.124,
  -0.016,
  -0.084,
  -0.17,
  -0.033,
  0.0,
  -0.037,
  0.035,
  0.179,
  0.06,
  0.066,
  0.068,
  0.074,
  0.046,
  0.033,
  0.066,
  0.235,
  0.097,
  0.08, // 2025 (estimate)
  0.063,
  0.042,
  0.042, // 2026 (estimate)
];
// Coronado rent growth 1970–2026
const CORONADO_RENT_GROWTH = [
  0.045,
  0.036,
  0.0315,
  0.045,
  0.0504,
  0.0477,
  0.0513,
  0.063,
  0.0727,
  0.1076,
  0.0901,
  0.0841,
  0.0649,
  0.055,
  0.065,
  0.0713,
  0.0387,
  0.0342,
  0.0302,
  0.0393,
  0.0396,
  0.0243,
  0.0218,
  0.0142,
  0.0158,
  0.0177,
  0.0208,
  0.0313,
  0.0371,
  0.0356,
  0.0461,
  0.0545,
  0.0233,
  0.024,
  0.0288,
  0.0295,
  0.0383,
  0.0443,
  0.0315,
  -0.0038,
  0.0052,
  0.0218,
  0.0266,
  0.0292,
  0.0352,
  0.0428,
  0.0757,
  0.0709, // 2025 (estimate)
  0.0257,
  0.0197,
  -0.0159,
  0.1256,
  0.0997,
  0.0792,
  0.0042,
  0.0225,
  0.0225, // 2026 (estimate)
];
// Coronado gross rent yields 1970–2026
const CORONADO_RENT_YIELDS = [
  0.059, 0.059, 0.056, 0.054, 0.051, 0.049, 0.046, 0.044, 0.042, 0.04, 0.042,
  0.045, 0.049, 0.05, 0.053, 0.053, 0.051, 0.048, 0.044, 0.04, 0.042, 0.046,
  0.05, 0.055, 0.057, 0.057, 0.055, 0.05, 0.045, 0.039, 0.034, 0.029, 0.025,
  0.022, 0.018, 0.016, 0.016, 0.018, 0.025, 0.034, 0.038, 0.042, 0.039, 0.035,
  0.034, 0.032, 0.031, 0.03, 0.03, 0.03, 0.029, 0.025, 0.025, 0.028, 0.029,
  0.029, 0.029,
];

// Carlsbad (carlsbad) — SD boom×1.02 bust×0.99; rent×1.04; yield×1.06
// Carlsbad price appreciation 1970–2026
const CARLSBAD_ANN = [
  0.03,
  0.07,
  0.09,
  0.163,
  0.122,
  0.133,
  0.172,
  0.307,
  0.184,
  0.205,
  -0.045,
  0.084,
  0.058,
  0.023,
  0.043,
  0.043,
  0.078,
  0.097,
  0.18,
  0.197,
  0.015,
  -0.002,
  -0.022,
  -0.031,
  -0.047,
  0.013,
  -0.007,
  0.047,
  0.115,
  0.106,
  0.157,
  0.119,
  0.175,
  0.172,
  0.277,
  0.111,
  -0.015,
  -0.096,
  -0.193,
  -0.038,
  0.0,
  -0.043,
  0.034,
  0.16,
  0.058,
  0.063,
  0.065,
  0.071,
  0.044,
  0.032,
  0.063,
  0.21,
  0.093, // 2025 (estimate)
  0.077,
  0.061,
  0.04,
  0.04, // 2026 (estimate)
];
// Carlsbad rent growth 1970–2026
const CARLSBAD_RENT_GROWTH = [
  0.052,
  0.0416,
  0.0364,
  0.052,
  0.0582,
  0.0551,
  0.0593,
  0.0728,
  0.084,
  0.1244,
  0.1041,
  0.0971,
  0.075,
  0.0635,
  0.0751,
  0.0824,
  0.0447,
  0.0395,
  0.0348,
  0.0454,
  0.0458,
  0.0281,
  0.0252,
  0.0164,
  0.0182,
  0.0205,
  0.024,
  0.0362,
  0.0428,
  0.0412,
  0.0532,
  0.063,
  0.0269,
  0.0278,
  0.0333,
  0.0341,
  0.0443,
  0.0512,
  0.0364,
  -0.0044,
  0.006,
  0.0252,
  0.0308,
  0.0337,
  0.0407,
  0.0494,
  0.0875,
  0.082,
  0.0296, // 2025 (estimate)
  0.0228,
  -0.0184,
  0.1451,
  0.1152,
  0.0915,
  0.0049,
  0.026,
  0.026, // 2026 (estimate)
];
// Carlsbad gross rent yields 1970–2026
const CARLSBAD_RENT_YIELDS = [
  0.074, 0.074, 0.071, 0.068, 0.065, 0.061, 0.058, 0.055, 0.053, 0.051, 0.053,
  0.056, 0.061, 0.064, 0.067, 0.067, 0.065, 0.06, 0.055, 0.051, 0.053, 0.058,
  0.064, 0.069, 0.072, 0.072, 0.069, 0.064, 0.056, 0.049, 0.042, 0.037, 0.032,
  0.028, 0.023, 0.02, 0.02, 0.023, 0.032, 0.042, 0.048, 0.053, 0.05, 0.045,
  0.042, 0.04, 0.039, 0.038, 0.038, 0.038, 0.037, 0.032, 0.032, 0.035, 0.037,
  0.037, 0.037,
];

// ── SF Bay cities ────────────────────────────────────────────
// Palo Alto (paloalto) — SF boom×1.32 bust×0.83; rent×1.12; yield×0.82
// Palo Alto price appreciation 1970–2026
const PALOALTO_ANN = [
  0.053,
  0.106,
  0.132,
  0.238,
  0.172,
  0.198,
  0.302,
  0.275,
  0.133,
  0.366,
  0.162,
  0.02,
  -0.003,
  0.081,
  0.068,
  0.137,
  0.172,
  0.248,
  0.346,
  0.203,
  -0.029,
  -0.019,
  -0.023,
  -0.021,
  -0.022,
  0.022,
  0.027,
  0.139,
  0.156,
  0.231,
  0.297,
  0.049,
  0.077,
  0.062,
  0.224,
  0.234,
  0.019,
  -0.022,
  -0.089,
  -0.052,
  -0.008,
  -0.026,
  0.072,
  0.202,
  0.149,
  0.178,
  0.062,
  0.051,
  0.075,
  -0.007,
  -0.033,
  0.065,
  0.08, // 2025 (estimate)
  0.017,
  0.03,
  0.026,
  0.026, // 2026 (estimate)
];
// Palo Alto rent growth 1970–2026
const PALOALTO_RENT_GROWTH = [
  0.0776,
  0.0414,
  0.03,
  0.0438,
  0.0468,
  0.0585,
  0.0684,
  0.0946,
  0.0632,
  0.153,
  0.1176,
  0.0868,
  0.0961,
  0.128,
  0.0924,
  0.1021,
  0.0609,
  0.0474,
  0.0464,
  0.0588,
  0.0438,
  0.0305,
  0.0276,
  0.0262,
  0.0148,
  0.022,
  0.0444,
  0.0892,
  0.078,
  0.0777,
  0.0971,
  0.1053,
  0.0082,
  -0.0034,
  -0.0004,
  0.0017,
  0.0315,
  0.0505,
  0.0463,
  0.0127,
  0.0068,
  0.0402,
  0.0494,
  0.0508,
  0.0676,
  0.0757,
  0.0732,
  0.054,
  0.0517, // 2025 (estimate)
  0.0429,
  0.0083,
  -0.003,
  0.0476,
  0.0366,
  0.0277,
  0.0336,
  0.0336, // 2026 (estimate)
];
// Palo Alto gross rent yields 1970–2026
const PALOALTO_RENT_YIELDS = [
  0.053, 0.053, 0.051, 0.048, 0.045, 0.043, 0.039, 0.038, 0.036, 0.034, 0.036,
  0.039, 0.043, 0.045, 0.047, 0.047, 0.044, 0.041, 0.037, 0.034, 0.037, 0.039,
  0.043, 0.045, 0.047, 0.048, 0.045, 0.041, 0.037, 0.031, 0.026, 0.026, 0.029,
  0.033, 0.041, 0.048, 0.052, 0.053, 0.049, 0.043, 0.041, 0.038, 0.033, 0.029,
  0.025, 0.023, 0.021, 0.021, 0.021, 0.021, 0.02, 0.018, 0.018, 0.021, 0.021,
  0.021, 0.021,
];

// Atherton (atherton) — SF boom×1.45 bust×0.75; rent×0.8; yield×0.65
// Atherton price appreciation 1970–2026
const ATHERTON_ANN = [
  0.054,
  0.116,
  0.145,
  0.261,
  0.189,
  0.217,
  0.332,
  0.302,
  0.146,
  0.402,
  0.178,
  0.021,
  -0.003,
  0.083,
  0.07,
  0.151,
  0.189,
  0.273,
  0.38,
  0.223,
  -0.026,
  -0.017,
  -0.021,
  -0.019,
  -0.02,
  0.023,
  0.028,
  0.152,
  0.171,
  0.254,
  0.326,
  0.051,
  0.079,
  0.064,
  0.246,
  0.257,
  0.019,
  -0.02,
  -0.08,
  -0.047,
  -0.009,
  -0.023,
  0.075,
  0.222,
  0.164,
  0.196,
  0.064,
  0.053,
  0.077,
  -0.008,
  -0.03,
  0.067,
  0.082,
  0.017, // 2025 (estimate)
  0.031,
  0.027,
  0.027, // 2026 (estimate)
];
// Atherton rent growth 1970–2026
const ATHERTON_RENT_GROWTH = [
  0.0554,
  0.0296,
  0.0214,
  0.0313,
  0.0334,
  0.0418,
  0.0489,
  0.0676,
  0.0451,
  0.1093,
  0.084,
  0.062,
  0.0686,
  0.0914,
  0.066,
  0.073,
  0.0435,
  0.0338,
  0.0331,
  0.042,
  0.0313,
  0.0218,
  0.0197,
  0.0187,
  0.0106,
  0.0157,
  0.0317,
  0.0637,
  0.0557,
  0.0555,
  0.0694,
  0.0752,
  0.0058,
  -0.0024,
  -0.0003,
  0.0012,
  0.0225,
  0.0361,
  0.033,
  0.009,
  0.0049,
  0.0287,
  0.0353,
  0.0363,
  0.0483,
  0.0541,
  0.0523,
  0.0386, // 2025 (estimate)
  0.037,
  0.0306,
  0.0059,
  -0.0022,
  0.034,
  0.0262,
  0.0198,
  0.024,
  0.024, // 2026 (estimate)
];
// Atherton gross rent yields 1970–2026
const ATHERTON_RENT_YIELDS = [
  0.042, 0.042, 0.04, 0.038, 0.036, 0.034, 0.031, 0.03, 0.029, 0.027, 0.029,
  0.031, 0.034, 0.036, 0.037, 0.037, 0.035, 0.033, 0.029, 0.027, 0.029, 0.031,
  0.034, 0.036, 0.037, 0.038, 0.036, 0.033, 0.029, 0.025, 0.021, 0.021, 0.023,
  0.026, 0.033, 0.038, 0.041, 0.042, 0.039, 0.034, 0.033, 0.03, 0.026, 0.023,
  0.019, 0.018, 0.017, 0.016, 0.016, 0.016, 0.016, 0.014, 0.014, 0.016, 0.017,
  0.017, 0.017,
];

// Los Altos (losaltos) — SF boom×1.28 bust×0.86; rent×1.06; yield×0.8
// Los Altos price appreciation 1970–2026
const LOSALTOS_ANN = [
  0.053,
  0.102,
  0.128,
  0.23,
  0.166,
  0.192,
  0.293,
  0.266,
  0.129,
  0.355,
  0.157,
  0.02,
  -0.003,
  0.082,
  0.069,
  0.133,
  0.166,
  0.241,
  0.335,
  0.197,
  -0.03,
  -0.02,
  -0.024,
  -0.022,
  -0.023,
  0.022,
  0.028,
  0.134,
  0.151,
  0.224,
  0.288,
  0.05,
  0.077,
  0.063,
  0.218,
  0.227,
  0.019,
  -0.023,
  -0.092,
  -0.054,
  -0.008,
  -0.027,
  0.073,
  0.196,
  0.145,
  0.173,
  0.063,
  0.052,
  0.075,
  -0.007,
  -0.034,
  0.066,
  0.081,
  0.017, // 2025 (estimate)
  0.031,
  0.027,
  0.027, // 2026 (estimate)
];
// Los Altos rent growth 1970–2026
const LOSALTOS_RENT_GROWTH = [
  0.0735,
  0.0392,
  0.0284,
  0.0414,
  0.0443,
  0.0553,
  0.0648,
  0.0896,
  0.0598,
  0.1448,
  0.1113,
  0.0822,
  0.0909,
  0.1212,
  0.0875,
  0.0967,
  0.0577,
  0.0448,
  0.0439,
  0.0556,
  0.0414,
  0.0288,
  0.0261,
  0.0248,
  0.014,
  0.0208,
  0.042,
  0.0844,
  0.0738,
  0.0736,
  0.0919,
  0.0996,
  0.0077,
  -0.0032,
  -0.0004,
  0.0016,
  0.0298,
  0.0478,
  0.0438,
  0.012,
  0.0065,
  0.0381,
  0.0467,
  0.0481,
  0.064,
  0.0717,
  0.0693,
  0.0511,
  0.049,
  0.0406,
  0.0078,
  -0.0029,
  0.0451,
  0.0347,
  0.0262,
  0.0318, // 2025 (estimate)
  0.0318, // 2026 (estimate)
];
// Los Altos gross rent yields 1970–2026
const LOSALTOS_RENT_YIELDS = [
  0.052, 0.052, 0.05, 0.046, 0.044, 0.042, 0.038, 0.037, 0.035, 0.034, 0.035,
  0.038, 0.042, 0.044, 0.046, 0.046, 0.043, 0.04, 0.036, 0.034, 0.036, 0.038,
  0.042, 0.044, 0.046, 0.046, 0.044, 0.04, 0.036, 0.03, 0.026, 0.026, 0.028,
  0.032, 0.04, 0.046, 0.05, 0.052, 0.048, 0.042, 0.04, 0.037, 0.032, 0.028,
  0.024, 0.022, 0.021, 0.02, 0.02, 0.02, 0.019, 0.018, 0.018, 0.02, 0.021,
  0.021, 0.021,
];

// Menlo Park (menlopark) — SF boom×1.24 bust×0.88; rent×1.1; yield×0.84
// Menlo Park price appreciation 1970–2026
const MENLOPARK_ANN = [
  0.053,
  0.099,
  0.124,
  0.223,
  0.161,
  0.186,
  0.284,
  0.258,
  0.125,
  0.343,
  0.153,
  0.02,
  -0.003,
  0.081,
  0.068,
  0.129,
  0.161,
  0.233,
  0.325,
  0.191,
  -0.031,
  -0.02,
  -0.025,
  -0.022,
  -0.024,
  0.022,
  0.027,
  0.13,
  0.146,
  0.217,
  0.279,
  0.049,
  0.077,
  0.062,
  0.211,
  0.219,
  0.019,
  -0.024,
  -0.094,
  -0.055,
  -0.008,
  -0.027,
  0.072,
  0.19,
  0.14,
  0.167,
  0.062,
  0.051,
  0.075,
  -0.007,
  -0.035,
  0.065,
  0.08,
  0.017, // 2025 (estimate)
  0.03,
  0.026,
  0.026, // 2026 (estimate)
];
// Menlo Park rent growth 1970–2026
const MENLOPARK_RENT_GROWTH = [
  0.0762,
  0.0407,
  0.0295,
  0.043,
  0.046,
  0.0574,
  0.0672,
  0.093,
  0.062,
  0.1503,
  0.1155,
  0.0853,
  0.0944,
  0.1257,
  0.0908,
  0.1003,
  0.0598,
  0.0465,
  0.0455,
  0.0578,
  0.043,
  0.0299,
  0.0271,
  0.0257,
  0.0145,
  0.0216,
  0.0436,
  0.0876,
  0.0766,
  0.0763,
  0.0954,
  0.1034,
  0.008,
  -0.0033,
  -0.0004,
  0.0017,
  0.0309,
  0.0496,
  0.0454,
  0.0124,
  0.0067,
  0.0395,
  0.0485,
  0.0499,
  0.0664,
  0.0744,
  0.0719,
  0.053, // 2025 (estimate)
  0.0508,
  0.0421,
  0.0081,
  -0.003,
  0.0468,
  0.036,
  0.0272,
  0.033,
  0.033, // 2026 (estimate)
];
// Menlo Park gross rent yields 1970–2026
const MENLOPARK_RENT_YIELDS = [
  0.055, 0.055, 0.052, 0.049, 0.046, 0.044, 0.04, 0.039, 0.037, 0.035, 0.037,
  0.039, 0.044, 0.046, 0.048, 0.048, 0.045, 0.042, 0.038, 0.035, 0.038, 0.04,
  0.044, 0.046, 0.048, 0.049, 0.046, 0.042, 0.038, 0.032, 0.027, 0.027, 0.029,
  0.034, 0.042, 0.049, 0.053, 0.055, 0.05, 0.045, 0.042, 0.039, 0.034, 0.029,
  0.025, 0.024, 0.022, 0.021, 0.021, 0.021, 0.02, 0.018, 0.018, 0.021, 0.022,
  0.022, 0.022,
];

// Saratoga (saratoga) — SF boom×1.18 bust×0.91; rent×0.96; yield×0.88
// Saratoga price appreciation 1970–2026
const SARATOGA_ANN = [
  0.052,
  0.094,
  0.118,
  0.212,
  0.153,
  0.177,
  0.27,
  0.245,
  0.119,
  0.327,
  0.145,
  0.02,
  -0.003,
  0.08,
  0.068,
  0.123,
  0.153,
  0.222,
  0.309,
  0.182,
  -0.032,
  -0.021,
  -0.025,
  -0.023,
  -0.025,
  0.022,
  0.027,
  0.124,
  0.139,
  0.206,
  0.266,
  0.049,
  0.076,
  0.061,
  0.201,
  0.209,
  0.019,
  -0.025,
  -0.097,
  -0.057,
  -0.008,
  -0.028,
  0.072,
  0.181,
  0.133,
  0.159,
  0.061,
  0.051,
  0.074,
  -0.007,
  -0.036,
  0.064,
  0.079, // 2025 (estimate)
  0.017,
  0.03,
  0.026,
  0.026, // 2026 (estimate)
];
// Saratoga rent growth 1970–2026
const SARATOGA_RENT_GROWTH = [
  0.0665,
  0.0355,
  0.0257,
  0.0375,
  0.0401,
  0.0501,
  0.0587,
  0.0811,
  0.0541,
  0.1311,
  0.1008,
  0.0744,
  0.0824,
  0.1097,
  0.0792,
  0.0876,
  0.0522,
  0.0406,
  0.0397,
  0.0504,
  0.0375,
  0.0261,
  0.0236,
  0.0225,
  0.0127,
  0.0188,
  0.038,
  0.0764,
  0.0668,
  0.0666,
  0.0832,
  0.0902,
  0.007,
  -0.0029,
  -0.0004,
  0.0014,
  0.027,
  0.0433,
  0.0396,
  0.0108,
  0.0059,
  0.0345,
  0.0423,
  0.0436,
  0.058,
  0.0649,
  0.0628,
  0.0463,
  0.0444,
  0.0368,
  0.0071,
  -0.0026,
  0.0408,
  0.0314,
  0.0237,
  0.0288, // 2025 (estimate)
  0.0288, // 2026 (estimate)
];
// Saratoga gross rent yields 1970–2026
const SARATOGA_RENT_YIELDS = [
  0.057, 0.057, 0.055, 0.051, 0.048, 0.046, 0.042, 0.04, 0.039, 0.037, 0.039,
  0.041, 0.046, 0.048, 0.05, 0.05, 0.048, 0.044, 0.04, 0.037, 0.04, 0.042,
  0.046, 0.048, 0.05, 0.051, 0.048, 0.044, 0.04, 0.033, 0.028, 0.028, 0.031,
  0.035, 0.044, 0.051, 0.055, 0.057, 0.053, 0.047, 0.044, 0.04, 0.035, 0.031,
  0.026, 0.025, 0.023, 0.022, 0.022, 0.022, 0.021, 0.019, 0.019, 0.022, 0.023,
  0.023, 0.023,
];

// ── DFW cities ────────────────────────────────────────────
// Highland Park (highlandpark) — DFW boom×1.2 bust×0.75; rent×0.88; yield×0.82
// Highland Park price appreciation 1970–2026
const HIGHLANDPARK_ANN = [
  0.041,
  0.062,
  0.082,
  0.18,
  0.093,
  0.12,
  0.035,
  0.199,
  0.258,
  0.239,
  0.132,
  -0.029,
  0.151,
  0.132,
  0.053,
  0.043,
  0.011,
  -0.058,
  -0.037,
  0.008,
  -0.007,
  0.031,
  0.022,
  0.021,
  -0.011,
  0.04,
  0.021,
  0.041,
  0.059,
  0.06,
  0.063,
  0.067,
  0.036,
  0.019,
  0.028,
  0.033,
  0.029,
  0.024,
  0.006,
  -0.013,
  -0.003,
  -0.016,
  0.023,
  0.069,
  0.091,
  0.125,
  0.121,
  0.095,
  0.052,
  0.044,
  0.05,
  0.257,
  0.179, // 2025 (estimate)
  0.023,
  0.041,
  0.021,
  0.021, // 2026 (estimate)
];
// Highland Park rent growth 1970–2026
const HIGHLANDPARK_RENT_GROWTH = [
  0.0281,
  0.0019,
  0.0058,
  0.0193,
  0.0302,
  0.0456,
  0.052,
  0.0867,
  0.0792,
  0.0872,
  0.1539,
  0.0451,
  0.0594,
  0.0565,
  0.0342,
  0.0479,
  0.0141,
  -0.0231,
  -0.0234,
  0.008,
  0.0444,
  0.0287,
  0.0088,
  0.026,
  0.0359,
  0.0325,
  0.0306,
  0.0422,
  0.0325,
  0.0377,
  0.0328,
  0.0321,
  0.0232,
  -0.01,
  -0.0224,
  0.0078,
  0.0165,
  0.0246,
  0.0539,
  0.0099,
  -0.0214,
  0.035,
  0.0414,
  0.0167,
  0.0432,
  0.0482,
  0.0544,
  0.0452,
  0.0275,
  0.0383,
  0.0036,
  0.1668,
  0.0557,
  0.0079,
  -0.0088,
  0.0088, // 2025 (estimate)
  0.0088, // 2026 (estimate)
];
// Highland Park gross rent yields 1970–2026
const HIGHLANDPARK_RENT_YIELDS = [
  0.078, 0.078, 0.075, 0.074, 0.074, 0.074, 0.075, 0.075, 0.074, 0.074, 0.074,
  0.076, 0.078, 0.078, 0.077, 0.077, 0.077, 0.079, 0.08, 0.08, 0.082, 0.082,
  0.082, 0.08, 0.078, 0.078, 0.076, 0.074, 0.072, 0.071, 0.069, 0.067, 0.066,
  0.066, 0.066, 0.066, 0.067, 0.07, 0.074, 0.078, 0.078, 0.079, 0.078, 0.075,
  0.074, 0.072, 0.07, 0.067, 0.067, 0.067, 0.061, 0.051, 0.056, 0.059, 0.057,
  0.056, 0.056,
];

// University Park (universitypk) — DFW boom×1.15 bust×0.8; rent×0.9; yield×0.85
// University Park price appreciation 1970–2026
const UNIVERSITYPK_ANN = [
  0.041,
  0.061,
  0.082,
  0.172,
  0.092,
  0.115,
  0.035,
  0.191,
  0.247,
  0.229,
  0.127,
  -0.029,
  0.145,
  0.127,
  0.052,
  0.043,
  0.011,
  -0.062,
  -0.039,
  0.008,
  -0.007,
  0.031,
  0.021,
  0.02,
  -0.011,
  0.04,
  0.02,
  0.041,
  0.058,
  0.059,
  0.062,
  0.066,
  0.036,
  0.018,
  0.028,
  0.033,
  0.029,
  0.023,
  0.006,
  -0.013,
  -0.003,
  -0.016,
  0.022,
  0.068,
  0.09,
  0.12,
  0.116,
  0.094,
  0.051,
  0.044,
  0.05,
  0.246,
  0.171, // 2025 (estimate)
  0.022,
  0.041,
  0.02,
  0.02, // 2026 (estimate)
];
// University Park rent growth 1970–2026
const UNIVERSITYPK_RENT_GROWTH = [
  0.0287,
  0.002,
  0.0059,
  0.0197,
  0.0309,
  0.0466,
  0.0532,
  0.0887,
  0.081,
  0.0892,
  0.1574,
  0.0461,
  0.0608,
  0.0578,
  0.035,
  0.049,
  0.0144,
  -0.0236,
  -0.0239,
  0.0082,
  0.0455,
  0.0293,
  0.009,
  0.0266,
  0.0367,
  0.0332,
  0.0313,
  0.0432,
  0.0332,
  0.0385,
  0.0336,
  0.0328,
  0.0238,
  -0.0103,
  -0.0229,
  0.008,
  0.0169,
  0.0252,
  0.0552,
  0.0101,
  -0.0219,
  0.0358,
  0.0423,
  0.0171,
  0.0442,
  0.0493,
  0.0556, // 2025 (estimate)
  0.0463,
  0.0282,
  0.0391,
  0.0037,
  0.1706,
  0.057,
  0.0081,
  -0.009,
  0.009,
  0.009, // 2026 (estimate)
];
// University Park gross rent yields 1970–2026
const UNIVERSITYPK_RENT_YIELDS = [
  0.081, 0.081, 0.078, 0.076, 0.076, 0.076, 0.078, 0.078, 0.076, 0.076, 0.076,
  0.079, 0.081, 0.081, 0.08, 0.08, 0.08, 0.082, 0.083, 0.083, 0.085, 0.085,
  0.085, 0.083, 0.081, 0.081, 0.079, 0.076, 0.075, 0.073, 0.071, 0.07, 0.068,
  0.068, 0.068, 0.068, 0.07, 0.072, 0.076, 0.081, 0.081, 0.082, 0.081, 0.078,
  0.076, 0.075, 0.072, 0.07, 0.07, 0.07, 0.064, 0.053, 0.058, 0.061, 0.06,
  0.058, 0.058,
];

// Southlake (southlake) — DFW boom×1.1 bust×0.9; rent×0.92; yield×0.88
// Southlake price appreciation 1970–2026
const SOUTHLAKE_ANN = [
  0.04,
  0.061,
  0.081,
  0.165,
  0.091,
  0.11,
  0.034,
  0.183,
  0.237,
  0.219,
  0.121,
  -0.028,
  0.139,
  0.121,
  0.052,
  0.042,
  0.011,
  -0.069,
  -0.044,
  0.008,
  -0.007,
  0.03,
  0.021,
  0.02,
  -0.011,
  0.039,
  0.02,
  0.04,
  0.058,
  0.059,
  0.062,
  0.066,
  0.035,
  0.018,
  0.027,
  0.032,
  0.028,
  0.023,
  0.006,
  -0.013,
  -0.003,
  -0.016,
  0.022,
  0.068,
  0.089,
  0.114,
  0.111,
  0.093,
  0.051,
  0.043,
  0.049,
  0.235,
  0.164, // 2025 (estimate)
  0.022,
  0.04,
  0.02,
  0.02, // 2026 (estimate)
];
// Southlake rent growth 1970–2026
const SOUTHLAKE_RENT_GROWTH = [
  0.0293,
  0.002,
  0.0061,
  0.0201,
  0.0316,
  0.0477,
  0.0544,
  0.0906,
  0.0828,
  0.0912,
  0.1609,
  0.0471,
  0.0621,
  0.0591,
  0.0358,
  0.05,
  0.0147,
  -0.0241,
  -0.0245,
  0.0084,
  0.0465,
  0.03,
  0.0092,
  0.0272,
  0.0375,
  0.0339,
  0.032,
  0.0442,
  0.0339,
  0.0394,
  0.0343,
  0.0336,
  0.0243,
  -0.0105,
  -0.0235,
  0.0082,
  0.0173,
  0.0258,
  0.0564,
  0.0103,
  -0.0224,
  0.0366,
  0.0432,
  0.0175,
  0.0452,
  0.0504,
  0.0569, // 2025 (estimate)
  0.0473,
  0.0288,
  0.04,
  0.0038,
  0.1743,
  0.0582,
  0.0083,
  -0.0092,
  0.0092,
  0.0092, // 2026 (estimate)
];
// Southlake gross rent yields 1970–2026
const SOUTHLAKE_RENT_YIELDS = [
  0.084, 0.084, 0.081, 0.079, 0.079, 0.079, 0.081, 0.081, 0.079, 0.079, 0.079,
  0.082, 0.084, 0.084, 0.083, 0.083, 0.083, 0.084, 0.086, 0.086, 0.088, 0.088,
  0.088, 0.086, 0.084, 0.084, 0.082, 0.079, 0.077, 0.076, 0.074, 0.072, 0.07,
  0.07, 0.07, 0.07, 0.072, 0.075, 0.079, 0.084, 0.084, 0.084, 0.084, 0.081,
  0.079, 0.077, 0.075, 0.072, 0.072, 0.072, 0.066, 0.055, 0.06, 0.063, 0.062,
  0.06, 0.06,
];

// Frisco (frisco) — DFW boom×1.08 bust×0.96; rent×1.05; yield×1.05
// Frisco price appreciation 1970–2026
const FRISCO_ANN = [
  0.04,
  0.06,
  0.08,
  0.162,
  0.09,
  0.108,
  0.034,
  0.179,
  0.232,
  0.215,
  0.119,
  -0.028,
  0.136,
  0.119,
  0.051,
  0.042,
  0.011,
  -0.074,
  -0.047,
  0.008,
  -0.007,
  0.03,
  0.021,
  0.02,
  -0.011,
  0.039,
  0.02,
  0.04,
  0.057,
  0.058,
  0.061,
  0.065,
  0.035,
  0.018,
  0.027,
  0.032,
  0.028,
  0.023,
  0.006,
  -0.013,
  -0.003,
  -0.016,
  0.022,
  0.067,
  0.088,
  0.112,
  0.109,
  0.092,
  0.05,
  0.043,
  0.049,
  0.231,
  0.161, // 2025 (estimate)
  0.022,
  0.04,
  0.02,
  0.02, // 2026 (estimate)
];
// Frisco rent growth 1970–2026
const FRISCO_RENT_GROWTH = [
  0.0335,
  0.0023,
  0.0069,
  0.023,
  0.036,
  0.0544,
  0.0621,
  0.1034,
  0.0945,
  0.1041,
  0.1836,
  0.0538,
  0.0709,
  0.0674,
  0.0408,
  0.0571,
  0.0168,
  -0.0275,
  -0.0279,
  0.0096,
  0.053,
  0.0342,
  0.0105,
  0.0311,
  0.0428,
  0.0387,
  0.0365,
  0.0504,
  0.0387,
  0.0449,
  0.0392,
  0.0383,
  0.0277,
  -0.012,
  -0.0268,
  0.0093,
  0.0197,
  0.0294,
  0.0644,
  0.0118,
  -0.0255,
  0.0418,
  0.0494,
  0.0199,
  0.0516,
  0.0575,
  0.0649, // 2025 (estimate)
  0.054,
  0.0329,
  0.0457,
  0.0043,
  0.199,
  0.0665,
  0.0095,
  -0.0105,
  0.0105,
  0.0105, // 2026 (estimate)
];
// Frisco gross rent yields 1970–2026
const FRISCO_RENT_YIELDS = [
  0.1, 0.1, 0.097, 0.095, 0.095, 0.095, 0.097, 0.097, 0.095, 0.095, 0.095,
  0.098, 0.1, 0.1, 0.099, 0.099, 0.099, 0.101, 0.103, 0.103, 0.105, 0.105,
  0.105, 0.103, 0.1, 0.1, 0.098, 0.095, 0.092, 0.09, 0.088, 0.086, 0.084, 0.084,
  0.084, 0.084, 0.086, 0.089, 0.095, 0.1, 0.1, 0.101, 0.1, 0.097, 0.095, 0.092,
  0.089, 0.086, 0.086, 0.086, 0.079, 0.065, 0.071, 0.076, 0.074, 0.071, 0.071,
];

// Plano (plano) — DFW boom×1.05 bust×0.98; rent×1.02; yield×1.02
// Plano price appreciation 1970–2026
const PLANO_ANN = [
  0.04,
  0.06,
  0.08,
  0.158,
  0.09,
  0.105,
  0.034,
  0.174,
  0.226,
  0.209,
  0.116,
  -0.028,
  0.132,
  0.116,
  0.051,
  0.042,
  0.011,
  -0.075,
  -0.048,
  0.008,
  -0.007,
  0.03,
  0.021,
  0.02,
  -0.011,
  0.039,
  0.02,
  0.04,
  0.057,
  0.058,
  0.061,
  0.065,
  0.035,
  0.018,
  0.027,
  0.032,
  0.028,
  0.023,
  0.006,
  -0.013,
  -0.003,
  -0.016,
  0.022,
  0.067,
  0.088,
  0.109,
  0.106,
  0.092,
  0.05,
  0.043,
  0.049,
  0.225,
  0.156, // 2025 (estimate)
  0.022,
  0.04,
  0.02,
  0.02, // 2026 (estimate)
];
// Plano rent growth 1970–2026
const PLANO_RENT_GROWTH = [
  0.0325,
  0.0022,
  0.0067,
  0.0223,
  0.035,
  0.0528,
  0.0603,
  0.1005,
  0.0918,
  0.1011,
  0.1784,
  0.0522,
  0.0689,
  0.0655,
  0.0397,
  0.0555,
  0.0163,
  -0.0267,
  -0.0271,
  0.0093,
  0.0515,
  0.0333,
  0.0102,
  0.0302,
  0.0416,
  0.0376,
  0.0355,
  0.049,
  0.0376,
  0.0437,
  0.038,
  0.0372,
  0.0269,
  -0.0116,
  -0.026,
  0.0091,
  0.0192,
  0.0286,
  0.0625,
  0.0114,
  -0.0248,
  0.0406,
  0.0479,
  0.0194,
  0.0501,
  0.0559,
  0.063,
  0.0524,
  0.0319,
  0.0444,
  0.0042,
  0.1933,
  0.0646,
  0.0092,
  -0.0102,
  0.0102, // 2025 (estimate)
  0.0102, // 2026 (estimate)
];
// Plano gross rent yields 1970–2026
const PLANO_RENT_YIELDS = [
  0.097, 0.097, 0.094, 0.092, 0.092, 0.092, 0.094, 0.094, 0.092, 0.092, 0.092,
  0.095, 0.097, 0.097, 0.096, 0.096, 0.096, 0.098, 0.1, 0.1, 0.102, 0.102,
  0.102, 0.1, 0.097, 0.097, 0.095, 0.092, 0.09, 0.088, 0.086, 0.084, 0.082,
  0.082, 0.082, 0.082, 0.084, 0.087, 0.092, 0.097, 0.097, 0.098, 0.097, 0.094,
  0.092, 0.09, 0.087, 0.084, 0.084, 0.084, 0.076, 0.063, 0.069, 0.073, 0.071,
  0.069, 0.069,
];

// ── Miami cities ────────────────────────────────────────────
// Miami Beach (miamibeach) — MIAMI boom×1.2 bust×0.85; rent×1.05; yield×0.88
// Miami Beach price appreciation 1970–2026
const MIAMIBEACH_ANN = [
  0.083,
  0.12,
  0.168,
  0.216,
  0.12,
  0.094,
  0.032,
  0.126,
  0.095,
  0.287,
  0.173,
  -0.023,
  0.092,
  -0.002,
  -0.006,
  -0.029,
  0.069,
  0.053,
  0.062,
  0.031,
  0.025,
  0.044,
  0.025,
  0.092,
  0.022,
  0.066,
  0.018,
  0.03,
  0.053,
  0.024,
  0.084,
  0.157,
  0.174,
  0.18,
  0.247,
  0.337,
  0.174,
  -0.018,
  -0.245,
  -0.128,
  -0.03,
  -0.051,
  0.049,
  0.15,
  0.134,
  0.098,
  0.089,
  0.072,
  0.069,
  0.05,
  0.068,
  0.257,
  0.251, // 2025 (estimate)
  0.131,
  0.092,
  0.042,
  0.042, // 2026 (estimate)
];
// Miami Beach rent growth 1970–2026
const MIAMIBEACH_RENT_GROWTH = [
  0.063,
  0.0525,
  0.0473,
  0.063,
  0.0735,
  0.0683,
  0.0683,
  0.0788,
  0.0389,
  0.0889,
  0.1597,
  0.1236,
  0.0547,
  0.0255,
  0.0051,
  0.0361,
  0.0109,
  0.0197,
  0.0397,
  0.0252,
  0.0291,
  0.0531,
  0.0126,
  0.0508,
  0.0548,
  0.031,
  0.03,
  0.0186,
  0.0189,
  0.0069,
  0.0232,
  0.0468,
  0.0506,
  0.0397,
  0.07,
  0.058,
  0.0941,
  0.0714,
  0.0353,
  -0.0238,
  0.0109,
  0.0032,
  0.0224,
  0.0275,
  0.0603,
  0.0475,
  0.061,
  0.0352, // 2025 (estimate)
  0.0373,
  0.0287,
  0.0281,
  0.039,
  0.1953,
  0.1062,
  0.0501,
  0.0105,
  0.0105, // 2026 (estimate)
];
// Miami Beach gross rent yields 1970–2026
const MIAMIBEACH_RENT_YIELDS = [
  0.07, 0.07, 0.069, 0.067, 0.065, 0.063, 0.064, 0.064, 0.063, 0.062, 0.063,
  0.066, 0.07, 0.072, 0.073, 0.075, 0.074, 0.072, 0.07, 0.069, 0.07, 0.072,
  0.074, 0.074, 0.072, 0.07, 0.069, 0.065, 0.06, 0.052, 0.044, 0.038, 0.033,
  0.028, 0.023, 0.019, 0.018, 0.019, 0.028, 0.039, 0.046, 0.051, 0.048, 0.042,
  0.04, 0.037, 0.035, 0.035, 0.037, 0.039, 0.036, 0.03, 0.033, 0.042, 0.044,
  0.044, 0.044,
];

// Coral Gables (coralgables) — MIAMI boom×1.1 bust×0.92; rent×0.98; yield×0.9
// Coral Gables price appreciation 1970–2026
const CORALGABLES_ANN = [
  0.082,
  0.11,
  0.154,
  0.198,
  0.11,
  0.092,
  0.032,
  0.116,
  0.093,
  0.263,
  0.158,
  -0.022,
  0.09,
  -0.002,
  -0.006,
  -0.029,
  0.067,
  0.052,
  0.061,
  0.031,
  0.024,
  0.043,
  0.024,
  0.09,
  0.021,
  0.064,
  0.017,
  0.03,
  0.052,
  0.023,
  0.083,
  0.144,
  0.16,
  0.165,
  0.227,
  0.309,
  0.16,
  -0.017,
  -0.265,
  -0.139,
  -0.03,
  -0.05,
  0.048,
  0.138,
  0.123,
  0.096,
  0.088,
  0.07,
  0.067,
  0.049,
  0.066,
  0.235,
  0.23,
  0.12, // 2025 (estimate)
  0.09,
  0.041,
  0.041, // 2026 (estimate)
];
// Coral Gables rent growth 1970–2026
const CORALGABLES_RENT_GROWTH = [
  0.0588,
  0.049,
  0.0441,
  0.0588,
  0.0686,
  0.0637,
  0.0637,
  0.0735,
  0.0363,
  0.083,
  0.1491,
  0.1153,
  0.0511,
  0.0238,
  0.0048,
  0.0337,
  0.0102,
  0.0184,
  0.037,
  0.0235,
  0.0271,
  0.0496,
  0.0118,
  0.0474,
  0.0512,
  0.0289,
  0.028,
  0.0173,
  0.0176,
  0.0065,
  0.0217,
  0.0437,
  0.0472,
  0.037,
  0.0654,
  0.0541,
  0.0878,
  0.0666,
  0.0329,
  -0.0222,
  0.0102,
  0.0029,
  0.0209,
  0.0257,
  0.0563,
  0.0443,
  0.0569,
  0.0328, // 2025 (estimate)
  0.0348,
  0.0268,
  0.0263,
  0.0364,
  0.1823,
  0.0991,
  0.0467,
  0.0098,
  0.0098, // 2026 (estimate)
];
// Coral Gables gross rent yields 1970–2026
const CORALGABLES_RENT_YIELDS = [
  0.072, 0.072, 0.07, 0.068, 0.067, 0.065, 0.066, 0.066, 0.065, 0.064, 0.065,
  0.068, 0.072, 0.074, 0.075, 0.077, 0.076, 0.074, 0.072, 0.07, 0.072, 0.074,
  0.076, 0.076, 0.074, 0.072, 0.07, 0.067, 0.061, 0.053, 0.045, 0.039, 0.034,
  0.029, 0.023, 0.02, 0.018, 0.02, 0.029, 0.04, 0.047, 0.052, 0.05, 0.043,
  0.041, 0.038, 0.036, 0.036, 0.038, 0.04, 0.037, 0.031, 0.034, 0.043, 0.045,
  0.045, 0.045,
];

// Key Biscayne (keybiscayne) — MIAMI boom×1.24 bust×0.8; rent×0.9; yield×0.84
// Key Biscayne price appreciation 1970–2026
const KEYBISCAYNE_ANN = [
  0.085,
  0.124,
  0.174,
  0.223,
  0.124,
  0.095,
  0.033,
  0.13,
  0.096,
  0.296,
  0.179,
  -0.023,
  0.093,
  -0.002,
  -0.006,
  -0.03,
  0.07,
  0.054,
  0.064,
  0.032,
  0.025,
  0.045,
  0.025,
  0.093,
  0.022,
  0.067,
  0.018,
  0.031,
  0.054,
  0.024,
  0.086,
  0.162,
  0.18,
  0.186,
  0.255,
  0.348,
  0.18,
  -0.018,
  -0.23,
  -0.121,
  -0.031,
  -0.052,
  0.05,
  0.155,
  0.139,
  0.1,
  0.091,
  0.073,
  0.07,
  0.051,
  0.069,
  0.265,
  0.259,
  0.135,
  0.093, // 2025 (estimate)
  0.042,
  0.042, // 2026 (estimate)
];
// Key Biscayne rent growth 1970–2026
const KEYBISCAYNE_RENT_GROWTH = [
  0.054,
  0.045,
  0.0405,
  0.054,
  0.063,
  0.0585,
  0.0585,
  0.0675,
  0.0333,
  0.0762,
  0.1369,
  0.1059,
  0.0469,
  0.0219,
  0.0044,
  0.031,
  0.0094,
  0.0169,
  0.034,
  0.0216,
  0.0249,
  0.0455,
  0.0108,
  0.0436,
  0.047,
  0.0266,
  0.0257,
  0.0159,
  0.0162,
  0.0059,
  0.0199,
  0.0401,
  0.0434,
  0.034,
  0.06,
  0.0497,
  0.0806,
  0.0612,
  0.0302,
  -0.0204,
  0.0094,
  0.0027,
  0.0192,
  0.0236,
  0.0517,
  0.0407,
  0.0523,
  0.0302,
  0.0319, // 2025 (estimate)
  0.0246,
  0.0241,
  0.0334,
  0.1674,
  0.091,
  0.0429,
  0.009,
  0.009, // 2026 (estimate)
];
// Key Biscayne gross rent yields 1970–2026
const KEYBISCAYNE_RENT_YIELDS = [
  0.067, 0.067, 0.066, 0.064, 0.062, 0.06, 0.061, 0.061, 0.06, 0.06, 0.06,
  0.063, 0.067, 0.069, 0.07, 0.071, 0.071, 0.069, 0.067, 0.066, 0.067, 0.069,
  0.071, 0.071, 0.069, 0.067, 0.066, 0.062, 0.057, 0.05, 0.042, 0.036, 0.032,
  0.027, 0.022, 0.018, 0.017, 0.018, 0.027, 0.037, 0.044, 0.049, 0.046, 0.04,
  0.038, 0.035, 0.034, 0.034, 0.035, 0.037, 0.034, 0.029, 0.032, 0.04, 0.042,
  0.042, 0.042,
];

// Coconut Grove (coconutgrove) — MIAMI boom×1.12 bust×0.9; rent×1.0; yield×0.92
// Coconut Grove price appreciation 1970–2026
const COCONUTGROVE_ANN = [
  0.082,
  0.112,
  0.157,
  0.202,
  0.112,
  0.092,
  0.032,
  0.118,
  0.093,
  0.268,
  0.161,
  -0.022,
  0.09,
  -0.002,
  -0.006,
  -0.029,
  0.067,
  0.052,
  0.061,
  0.031,
  0.024,
  0.043,
  0.024,
  0.09,
  0.021,
  0.064,
  0.017,
  0.03,
  0.052,
  0.023,
  0.083,
  0.147,
  0.162,
  0.168,
  0.231,
  0.315,
  0.162,
  -0.017,
  -0.259,
  -0.136,
  -0.03,
  -0.05,
  0.048,
  0.14,
  0.125,
  0.096,
  0.088,
  0.07,
  0.067,
  0.049,
  0.066,
  0.24,
  0.234, // 2025 (estimate)
  0.122,
  0.09,
  0.041,
  0.041, // 2026 (estimate)
];
// Coconut Grove rent growth 1970–2026
const COCONUTGROVE_RENT_GROWTH = [
  0.06,
  0.05,
  0.045,
  0.06,
  0.07,
  0.065,
  0.065,
  0.075,
  0.037,
  0.0847,
  0.1521,
  0.1177,
  0.0521,
  0.0243,
  0.0049,
  0.0344,
  0.0104,
  0.0188,
  0.0378,
  0.024,
  0.0277,
  0.0506,
  0.012,
  0.0484,
  0.0522,
  0.0295,
  0.0286,
  0.0177,
  0.018,
  0.0066,
  0.0221,
  0.0446,
  0.0482,
  0.0378,
  0.0667,
  0.0552,
  0.0896,
  0.068,
  0.0336,
  -0.0227,
  0.0104,
  0.003,
  0.0213,
  0.0262,
  0.0574,
  0.0452,
  0.0581,
  0.0335,
  0.0355,
  0.0273, // 2025 (estimate)
  0.0268,
  0.0371,
  0.186,
  0.1011,
  0.0477,
  0.01,
  0.01, // 2026 (estimate)
];
// Coconut Grove gross rent yields 1970–2026
const COCONUTGROVE_RENT_YIELDS = [
  0.074, 0.074, 0.072, 0.07, 0.068, 0.066, 0.067, 0.067, 0.066, 0.065, 0.066,
  0.069, 0.074, 0.075, 0.076, 0.078, 0.077, 0.075, 0.074, 0.072, 0.074, 0.075,
  0.077, 0.077, 0.075, 0.074, 0.072, 0.068, 0.063, 0.054, 0.046, 0.04, 0.035,
  0.029, 0.024, 0.02, 0.018, 0.02, 0.029, 0.04, 0.048, 0.053, 0.051, 0.044,
  0.041, 0.039, 0.037, 0.037, 0.039, 0.04, 0.038, 0.031, 0.035, 0.044, 0.046,
  0.046, 0.046,
];

// Brickell (brickell) — MIAMI boom×1.08 bust×0.95; rent×1.05; yield×0.95
// Brickell price appreciation 1970–2026
const BRICKELL_ANN = [
  0.081,
  0.108,
  0.151,
  0.194,
  0.108,
  0.091,
  0.031,
  0.113,
  0.092,
  0.258,
  0.156,
  -0.022,
  0.089,
  -0.002,
  -0.006,
  -0.028,
  0.067,
  0.052,
  0.061,
  0.03,
  0.024,
  0.042,
  0.024,
  0.089,
  0.021,
  0.064,
  0.017,
  0.029,
  0.052,
  0.023,
  0.082,
  0.141,
  0.157,
  0.162,
  0.222,
  0.303,
  0.157,
  -0.017,
  -0.274,
  -0.143,
  -0.029,
  -0.049,
  0.047,
  0.135,
  0.121,
  0.095,
  0.087,
  0.07,
  0.067,
  0.048,
  0.066,
  0.231,
  0.226, // 2025 (estimate)
  0.118,
  0.089,
  0.04,
  0.04, // 2026 (estimate)
];
// Brickell rent growth 1970–2026
const BRICKELL_RENT_GROWTH = [
  0.063,
  0.0525,
  0.0473,
  0.063,
  0.0735,
  0.0683,
  0.0683,
  0.0788,
  0.0389,
  0.0889,
  0.1597,
  0.1236,
  0.0547,
  0.0255,
  0.0051,
  0.0361,
  0.0109,
  0.0197,
  0.0397,
  0.0252,
  0.0291,
  0.0531,
  0.0126,
  0.0508,
  0.0548,
  0.031,
  0.03,
  0.0186,
  0.0189,
  0.0069,
  0.0232,
  0.0468,
  0.0506,
  0.0397,
  0.07,
  0.058,
  0.0941,
  0.0714,
  0.0353,
  -0.0238,
  0.0109,
  0.0032,
  0.0224,
  0.0275,
  0.0603,
  0.0475,
  0.061,
  0.0352, // 2025 (estimate)
  0.0373,
  0.0287,
  0.0281,
  0.039,
  0.1953,
  0.1062,
  0.0501,
  0.0105,
  0.0105, // 2026 (estimate)
];
// Brickell gross rent yields 1970–2026
const BRICKELL_RENT_YIELDS = [
  0.076, 0.076, 0.074, 0.072, 0.07, 0.068, 0.069, 0.069, 0.068, 0.067, 0.068,
  0.071, 0.076, 0.078, 0.079, 0.081, 0.08, 0.078, 0.076, 0.074, 0.076, 0.078,
  0.08, 0.08, 0.078, 0.076, 0.074, 0.07, 0.065, 0.056, 0.048, 0.041, 0.036,
  0.03, 0.025, 0.021, 0.019, 0.021, 0.03, 0.042, 0.049, 0.055, 0.052, 0.046,
  0.043, 0.04, 0.038, 0.038, 0.04, 0.042, 0.039, 0.032, 0.036, 0.046, 0.048,
  0.048, 0.048,
];

// ── Seattle cities ────────────────────────────────────────────
// Medina (medina) — SEATTLE boom×1.38 bust×0.75; rent×0.82; yield×0.62
// Medina price appreciation 1970–2026
const MEDINA_ANN = [
  -0.06,
  -0.038,
  0.032,
  0.11,
  0.074,
  0.207,
  0.284,
  0.4,
  0.366,
  0.208,
  0.047,
  0.029,
  -0.016,
  0.028,
  0.046,
  0.028,
  0.043,
  0.063,
  0.117,
  0.327,
  0.251,
  0.02,
  0.019,
  0.021,
  0.017,
  0.044,
  0.036,
  0.123,
  0.134,
  0.128,
  0.113,
  0.063,
  0.05,
  0.061,
  0.152,
  0.237,
  0.186,
  0.045,
  -0.057,
  -0.075,
  -0.033,
  -0.035,
  0.027,
  0.127,
  0.113,
  0.155,
  0.166,
  0.185,
  0.051,
  0.034,
  0.068,
  0.244,
  0.057,
  0.025, // 2025 (estimate)
  0.058,
  0.032,
  0.032, // 2026 (estimate)
];
// Medina rent growth 1970–2026
const MEDINA_RENT_GROWTH = [
  -0.0093,
  -0.0152,
  0.0,
  0.0405,
  0.0919,
  0.0711,
  0.0685,
  0.0759,
  0.0759,
  0.1412,
  0.1205,
  0.0446,
  0.0025,
  0.005,
  0.0362,
  0.0402,
  0.0263,
  0.0328,
  0.0312,
  0.0358,
  0.0361,
  0.0221,
  0.0198,
  0.013,
  0.0143,
  0.0162,
  0.0189,
  0.0285,
  0.0451,
  0.0302,
  0.036,
  0.0482,
  0.002,
  -0.0071,
  0.0039,
  0.022,
  0.0399,
  0.0685,
  0.0559,
  -0.0105,
  -0.0134,
  0.033,
  0.0253,
  0.0455,
  0.0483,
  0.0412,
  0.0875,
  0.0528,
  -0.0003, // 2025 (estimate)
  0.0284,
  0.0192,
  0.1282,
  0.022,
  0.0298,
  0.0071,
  0.0164,
  0.0164, // 2026 (estimate)
];
// Medina gross rent yields 1970–2026
const MEDINA_RENT_YIELDS = [
  0.046, 0.05, 0.051, 0.05, 0.048, 0.045, 0.042, 0.039, 0.037, 0.036, 0.037,
  0.039, 0.042, 0.043, 0.045, 0.046, 0.046, 0.045, 0.042, 0.038, 0.039, 0.04,
  0.042, 0.042, 0.039, 0.038, 0.037, 0.034, 0.031, 0.029, 0.026, 0.024, 0.021,
  0.019, 0.017, 0.016, 0.017, 0.019, 0.022, 0.026, 0.029, 0.031, 0.03, 0.027,
  0.025, 0.023, 0.023, 0.022, 0.02, 0.019, 0.019, 0.016, 0.017, 0.02, 0.02,
  0.02, 0.02,
];

// Mercer Island (mercerisland) — SEATTLE boom×1.26 bust×0.84; rent×0.92; yield×0.8
// Mercer Island price appreciation 1970–2026
const MERCERISLAND_ANN = [
  -0.067,
  -0.042,
  0.031,
  0.101,
  0.072,
  0.189,
  0.26,
  0.365,
  0.334,
  0.19,
  0.046,
  0.029,
  -0.015,
  0.028,
  0.045,
  0.028,
  0.042,
  0.062,
  0.107,
  0.299,
  0.229,
  0.02,
  0.019,
  0.021,
  0.016,
  0.043,
  0.035,
  0.112,
  0.122,
  0.117,
  0.103,
  0.062,
  0.049,
  0.06,
  0.139,
  0.217,
  0.17,
  0.044,
  -0.064,
  -0.084,
  -0.037,
  -0.039,
  0.027,
  0.116,
  0.103,
  0.141,
  0.151,
  0.169,
  0.05,
  0.033,
  0.067,
  0.223,
  0.056,
  0.025,
  0.057, // 2025 (estimate)
  0.031,
  0.031, // 2026 (estimate)
];
// Mercer Island rent growth 1970–2026
const MERCERISLAND_RENT_GROWTH = [
  -0.0105,
  -0.017,
  0.0,
  0.0454,
  0.1031,
  0.0798,
  0.0768,
  0.0851,
  0.0851,
  0.1584,
  0.1351,
  0.05,
  0.0028,
  0.0056,
  0.0406,
  0.0451,
  0.0295,
  0.0368,
  0.035,
  0.0402,
  0.0405,
  0.0248,
  0.0223,
  0.0145,
  0.0161,
  0.0181,
  0.0213,
  0.032,
  0.0506,
  0.0339,
  0.0404,
  0.0541,
  0.0022,
  -0.0079,
  0.0044,
  0.0247,
  0.0447,
  0.0768,
  0.0627,
  -0.0118,
  -0.015,
  0.037,
  0.0283,
  0.0511,
  0.0542,
  0.0462,
  0.0982,
  0.0592, // 2025 (estimate)
  -0.0004,
  0.0318,
  0.0215,
  0.1438,
  0.0247,
  0.0335,
  0.0079,
  0.0184,
  0.0184, // 2026 (estimate)
];
// Mercer Island gross rent yields 1970–2026
const MERCERISLAND_RENT_YIELDS = [
  0.06, 0.064, 0.066, 0.064, 0.062, 0.058, 0.054, 0.05, 0.048, 0.046, 0.048,
  0.05, 0.054, 0.056, 0.058, 0.059, 0.059, 0.058, 0.054, 0.05, 0.05, 0.052,
  0.054, 0.054, 0.05, 0.05, 0.047, 0.044, 0.04, 0.037, 0.034, 0.03, 0.027,
  0.024, 0.022, 0.021, 0.022, 0.024, 0.029, 0.034, 0.037, 0.04, 0.038, 0.034,
  0.032, 0.03, 0.03, 0.028, 0.026, 0.025, 0.024, 0.021, 0.022, 0.026, 0.026,
  0.026, 0.026,
];

// Bellevue (bellevue) — SEATTLE boom×1.18 bust×0.91; rent×1.06; yield×0.92
// Bellevue price appreciation 1970–2026
const BELLEVUE_ANN = [
  -0.073,
  -0.046,
  0.031,
  0.094,
  0.071,
  0.177,
  0.243,
  0.342,
  0.313,
  0.178,
  0.046,
  0.029,
  -0.015,
  0.028,
  0.045,
  0.028,
  0.042,
  0.061,
  0.1,
  0.28,
  0.215,
  0.019,
  0.018,
  0.02,
  0.016,
  0.043,
  0.035,
  0.105,
  0.114,
  0.11,
  0.097,
  0.061,
  0.049,
  0.059,
  0.13,
  0.203,
  0.159,
  0.044,
  -0.069,
  -0.091,
  -0.04,
  -0.043,
  0.027,
  0.109,
  0.097,
  0.132,
  0.142,
  0.158,
  0.05,
  0.033,
  0.066,
  0.209,
  0.055,
  0.024,
  0.056, // 2025 (estimate)
  0.031,
  0.031, // 2026 (estimate)
];
// Bellevue rent growth 1970–2026
const BELLEVUE_RENT_GROWTH = [
  -0.0121,
  -0.0196,
  0.0,
  0.0524,
  0.1188,
  0.0919,
  0.0885,
  0.098,
  0.098,
  0.1825,
  0.1557,
  0.0577,
  0.0032,
  0.0065,
  0.0467,
  0.0519,
  0.034,
  0.0424,
  0.0403,
  0.0463,
  0.0466,
  0.0286,
  0.0257,
  0.0167,
  0.0186,
  0.0209,
  0.0245,
  0.0369,
  0.0583,
  0.039,
  0.0465,
  0.0623,
  0.0025,
  -0.0091,
  0.0051,
  0.0284,
  0.0515,
  0.0885,
  0.0723,
  -0.0136,
  -0.0173,
  0.0426,
  0.0326,
  0.0588,
  0.0624,
  0.0532,
  0.1131,
  0.0683, // 2025 (estimate)
  -0.0004,
  0.0367,
  0.0248,
  0.1657,
  0.0284,
  0.0386,
  0.0091,
  0.0212,
  0.0212, // 2026 (estimate)
];
// Bellevue gross rent yields 1970–2026
const BELLEVUE_RENT_YIELDS = [
  0.069, 0.074, 0.075, 0.074, 0.072, 0.067, 0.063, 0.058, 0.055, 0.053, 0.055,
  0.058, 0.063, 0.064, 0.067, 0.068, 0.068, 0.066, 0.063, 0.057, 0.058, 0.06,
  0.062, 0.062, 0.058, 0.057, 0.054, 0.051, 0.046, 0.042, 0.039, 0.035, 0.031,
  0.028, 0.026, 0.024, 0.025, 0.028, 0.033, 0.039, 0.042, 0.046, 0.044, 0.04,
  0.037, 0.034, 0.034, 0.032, 0.03, 0.029, 0.028, 0.024, 0.026, 0.029, 0.03,
  0.03, 0.03,
];

// Kirkland (kirkland) — SEATTLE boom×1.12 bust×0.94; rent×1.1; yield×0.97
// Kirkland price appreciation 1970–2026
const KIRKLAND_ANN = [
  -0.075,
  -0.047,
  0.03,
  0.09,
  0.071,
  0.168,
  0.231,
  0.325,
  0.297,
  0.169,
  0.045,
  0.028,
  -0.015,
  0.027,
  0.044,
  0.027,
  0.041,
  0.061,
  0.095,
  0.265,
  0.204,
  0.019,
  0.018,
  0.02,
  0.016,
  0.042,
  0.034,
  0.1,
  0.109,
  0.104,
  0.092,
  0.061,
  0.048,
  0.059,
  0.123,
  0.193,
  0.151,
  0.043,
  -0.071,
  -0.094,
  -0.041,
  -0.044,
  0.026,
  0.103,
  0.092,
  0.125,
  0.134,
  0.15,
  0.049,
  0.032,
  0.066,
  0.198,
  0.055,
  0.024, // 2025 (estimate)
  0.056,
  0.03,
  0.03, // 2026 (estimate)
];
// Kirkland rent growth 1970–2026
const KIRKLAND_RENT_GROWTH = [
  -0.0125,
  -0.0204,
  0.0,
  0.0543,
  0.1233,
  0.0954,
  0.0919,
  0.1018,
  0.1018,
  0.1894,
  0.1616,
  0.0598,
  0.0033,
  0.0067,
  0.0485,
  0.0539,
  0.0353,
  0.044,
  0.0418,
  0.0481,
  0.0484,
  0.0297,
  0.0266,
  0.0174,
  0.0193,
  0.0217,
  0.0254,
  0.0383,
  0.0605,
  0.0405,
  0.0483,
  0.0647,
  0.0026,
  -0.0095,
  0.0053,
  0.0295,
  0.0535,
  0.0919,
  0.075,
  -0.0141,
  -0.0179,
  0.0442,
  0.0339,
  0.0611,
  0.0648,
  0.0552,
  0.1174, // 2025 (estimate)
  0.0708,
  -0.0004,
  0.0381,
  0.0257,
  0.1719,
  0.0295,
  0.04,
  0.0095,
  0.022,
  0.022, // 2026 (estimate)
];
// Kirkland gross rent yields 1970–2026
const KIRKLAND_RENT_YIELDS = [
  0.073, 0.078, 0.08, 0.078, 0.076, 0.071, 0.066, 0.061, 0.058, 0.056, 0.058,
  0.061, 0.066, 0.068, 0.071, 0.072, 0.072, 0.07, 0.066, 0.06, 0.061, 0.063,
  0.065, 0.065, 0.061, 0.06, 0.057, 0.053, 0.049, 0.045, 0.041, 0.037, 0.033,
  0.029, 0.027, 0.025, 0.026, 0.029, 0.035, 0.041, 0.045, 0.049, 0.047, 0.042,
  0.039, 0.036, 0.036, 0.034, 0.032, 0.03, 0.029, 0.025, 0.027, 0.031, 0.032,
  0.032, 0.032,
];

// Redmond (redmond) — SEATTLE boom×1.1 bust×0.95; rent×1.12; yield×0.99
// Redmond price appreciation 1970–2026
const REDMOND_ANN = [
  -0.076,
  -0.048,
  0.03,
  0.088,
  0.07,
  0.165,
  0.227,
  0.319,
  0.292,
  0.166,
  0.045,
  0.028,
  -0.015,
  0.027,
  0.044,
  0.027,
  0.041,
  0.06,
  0.094,
  0.261,
  0.2,
  0.019,
  0.018,
  0.02,
  0.016,
  0.042,
  0.034,
  0.098,
  0.107,
  0.102,
  0.09,
  0.06,
  0.048,
  0.058,
  0.121,
  0.189,
  0.149,
  0.043,
  -0.072,
  -0.095,
  -0.042,
  -0.045,
  0.026,
  0.101,
  0.09,
  0.123,
  0.132,
  0.147,
  0.049,
  0.032,
  0.065,
  0.195,
  0.054,
  0.024, // 2025 (estimate)
  0.055,
  0.03,
  0.03, // 2026 (estimate)
];
// Redmond rent growth 1970–2026
const REDMOND_RENT_GROWTH = [
  -0.0128,
  -0.0207,
  0.0,
  0.0553,
  0.1256,
  0.0971,
  0.0935,
  0.1036,
  0.1036,
  0.1929,
  0.1645,
  0.0609,
  0.0034,
  0.0068,
  0.0494,
  0.0549,
  0.036,
  0.0448,
  0.0426,
  0.0489,
  0.0493,
  0.0302,
  0.0271,
  0.0177,
  0.0196,
  0.0221,
  0.0259,
  0.039,
  0.0616,
  0.0412,
  0.0492,
  0.0659,
  0.0027,
  -0.0096,
  0.0054,
  0.03,
  0.0544,
  0.0935,
  0.0764,
  -0.0143,
  -0.0183,
  0.045,
  0.0345,
  0.0622,
  0.066,
  0.0562,
  0.1195,
  0.0721, // 2025 (estimate)
  -0.0004,
  0.0388,
  0.0262,
  0.1751,
  0.03,
  0.0408,
  0.0096,
  0.0224,
  0.0224, // 2026 (estimate)
];
// Redmond gross rent yields 1970–2026
const REDMOND_RENT_YIELDS = [
  0.074, 0.079, 0.081, 0.079, 0.077, 0.072, 0.067, 0.062, 0.059, 0.057, 0.059,
  0.062, 0.067, 0.069, 0.072, 0.073, 0.073, 0.071, 0.067, 0.061, 0.062, 0.064,
  0.066, 0.066, 0.062, 0.061, 0.058, 0.054, 0.05, 0.046, 0.042, 0.038, 0.034,
  0.03, 0.028, 0.026, 0.027, 0.03, 0.036, 0.042, 0.046, 0.05, 0.048, 0.043,
  0.04, 0.037, 0.037, 0.035, 0.033, 0.031, 0.03, 0.026, 0.028, 0.032, 0.033,
  0.033, 0.033,
];

// ── NYC cities ────────────────────────────────────────────
// Manhattan (manhattan) — NYC boom×1.15 bust×0.9; rent×1.12; yield×0.92
// Manhattan price appreciation 1970–2026
const MANHATTAN_ANN = [
  -0.031,
  -0.041,
  0.0,
  0.02,
  0.01,
  -0.02,
  0.061,
  0.138,
  0.196,
  0.253,
  0.207,
  0.138,
  0.092,
  0.061,
  0.115,
  0.172,
  0.23,
  0.253,
  0.196,
  0.092,
  -0.072,
  -0.108,
  -0.09,
  -0.054,
  -0.02,
  0.02,
  0.051,
  0.103,
  0.149,
  0.172,
  0.196,
  0.103,
  0.127,
  0.184,
  0.218,
  0.253,
  0.149,
  0.041,
  -0.09,
  -0.099,
  -0.031,
  0.01,
  0.051,
  0.138,
  0.092,
  0.071,
  0.051,
  0.051,
  0.061,
  0.041,
  0.127,
  0.207,
  0.051,
  0.041,
  0.051, // 2025 (estimate)
  0.031,
  0.031, // 2026 (estimate)
];
// Manhattan rent growth 1970–2026
const MANHATTAN_RENT_GROWTH = [
  0.0448,
  0.0448,
  0.0448,
  0.056,
  0.0784,
  0.1008,
  0.1008,
  0.1008,
  0.112,
  0.1232,
  0.112,
  0.0784,
  0.0448,
  0.0224,
  0.0224,
  0.0336,
  0.0448,
  0.056,
  0.056,
  0.0448,
  0.0112,
  0.0,
  0.0112,
  0.0224,
  0.028,
  0.0392,
  0.0448,
  0.0504,
  0.056,
  0.0616,
  0.0672,
  0.0616,
  0.0538,
  0.0448,
  0.0358,
  0.0336,
  0.0314,
  0.028,
  0.0134,
  -0.0168,
  0.0056,
  0.0168,
  0.0358,
  0.0504,
  0.047,
  0.0504,
  0.0448,
  0.0392,
  0.028, // 2025 (estimate)
  0.0246,
  0.0224,
  0.0728,
  0.0616,
  0.0314,
  0.0358,
  0.028,
  0.028, // 2026 (estimate)
];
// Manhattan gross rent yields 1970–2026
const MANHATTAN_RENT_YIELDS = [
  0.064, 0.063, 0.06, 0.057, 0.055, 0.053, 0.055, 0.055, 0.053, 0.051, 0.051,
  0.052, 0.057, 0.06, 0.063, 0.063, 0.06, 0.055, 0.051, 0.048, 0.051, 0.053,
  0.057, 0.06, 0.057, 0.055, 0.053, 0.05, 0.046, 0.04, 0.035, 0.031, 0.028,
  0.024, 0.022, 0.02, 0.02, 0.023, 0.029, 0.037, 0.04, 0.044, 0.042, 0.037,
  0.035, 0.033, 0.032, 0.031, 0.031, 0.031, 0.029, 0.026, 0.03, 0.033, 0.033,
  0.033, 0.033,
];

// Brooklyn (brooklyn) — NYC boom×1.22 bust×0.93; rent×1.18; yield×0.98
// Brooklyn price appreciation 1970–2026
const BROOKLYN_ANN = [
  -0.031,
  -0.041,
  0.0,
  0.021,
  0.01,
  -0.021,
  0.062,
  0.146,
  0.207,
  0.268,
  0.22,
  0.146,
  0.098,
  0.062,
  0.122,
  0.183,
  0.244,
  0.268,
  0.207,
  0.098,
  -0.074,
  -0.112,
  -0.093,
  -0.056,
  -0.021,
  0.021,
  0.052,
  0.11,
  0.159,
  0.183,
  0.207,
  0.11,
  0.134,
  0.195,
  0.232,
  0.268,
  0.159,
  0.041,
  -0.093,
  -0.102,
  -0.031,
  0.01,
  0.052,
  0.146,
  0.098,
  0.072,
  0.052,
  0.052,
  0.062,
  0.041,
  0.134,
  0.22,
  0.052,
  0.041,
  0.052, // 2025 (estimate)
  0.031,
  0.031, // 2026 (estimate)
];
// Brooklyn rent growth 1970–2026
const BROOKLYN_RENT_GROWTH = [
  0.0472,
  0.0472,
  0.0472,
  0.059,
  0.0826,
  0.1062,
  0.1062,
  0.1062,
  0.118,
  0.1298,
  0.118,
  0.0826,
  0.0472,
  0.0236,
  0.0236,
  0.0354,
  0.0472,
  0.059,
  0.059,
  0.0472,
  0.0118,
  0.0,
  0.0118,
  0.0236,
  0.0295,
  0.0413,
  0.0472,
  0.0531,
  0.059,
  0.0649,
  0.0708,
  0.0649,
  0.0566,
  0.0472,
  0.0378,
  0.0354,
  0.033,
  0.0295,
  0.0142,
  -0.0177,
  0.0059,
  0.0177,
  0.0378,
  0.0531,
  0.0496,
  0.0531,
  0.0472,
  0.0413, // 2025 (estimate)
  0.0295,
  0.026,
  0.0236,
  0.0767,
  0.0649,
  0.033,
  0.0378,
  0.0295,
  0.0295, // 2026 (estimate)
];
// Brooklyn gross rent yields 1970–2026
const BROOKLYN_RENT_YIELDS = [
  0.069, 0.067, 0.064, 0.061, 0.059, 0.057, 0.059, 0.059, 0.057, 0.054, 0.054,
  0.056, 0.061, 0.064, 0.067, 0.067, 0.064, 0.059, 0.054, 0.051, 0.054, 0.057,
  0.061, 0.064, 0.061, 0.059, 0.057, 0.053, 0.049, 0.043, 0.037, 0.033, 0.029,
  0.025, 0.024, 0.022, 0.022, 0.025, 0.031, 0.039, 0.043, 0.047, 0.045, 0.039,
  0.037, 0.035, 0.034, 0.033, 0.033, 0.033, 0.031, 0.027, 0.032, 0.035, 0.035,
  0.035, 0.035,
];

// Hoboken (hoboken) — NYC boom×1.1 bust×0.95; rent×1.25; yield×1.02
// Hoboken price appreciation 1970–2026
const HOBOKEN_ANN = [
  -0.03,
  -0.04,
  0.0,
  0.02,
  0.01,
  -0.02,
  0.061,
  0.132,
  0.187,
  0.242,
  0.198,
  0.132,
  0.088,
  0.061,
  0.11,
  0.165,
  0.22,
  0.242,
  0.187,
  0.088,
  -0.076,
  -0.114,
  -0.095,
  -0.057,
  -0.02,
  0.02,
  0.051,
  0.099,
  0.143,
  0.165,
  0.187,
  0.099,
  0.121,
  0.176,
  0.209,
  0.242,
  0.143,
  0.04,
  -0.095,
  -0.104,
  -0.03,
  0.01,
  0.051,
  0.132,
  0.088,
  0.071,
  0.051,
  0.051,
  0.061,
  0.04,
  0.121,
  0.198,
  0.051,
  0.04,
  0.051, // 2025 (estimate)
  0.03,
  0.03, // 2026 (estimate)
];
// Hoboken rent growth 1970–2026
const HOBOKEN_RENT_GROWTH = [
  0.05,
  0.05,
  0.05,
  0.0625,
  0.0875,
  0.1125,
  0.1125,
  0.1125,
  0.125,
  0.1375,
  0.125,
  0.0875,
  0.05,
  0.025,
  0.025,
  0.0375,
  0.05,
  0.0625,
  0.0625,
  0.05,
  0.0125,
  0.0,
  0.0125,
  0.025,
  0.0312,
  0.0438,
  0.05,
  0.0562,
  0.0625,
  0.0688,
  0.075,
  0.0688,
  0.06,
  0.05,
  0.04,
  0.0375,
  0.035,
  0.0312,
  0.015,
  -0.0187,
  0.0063,
  0.0187,
  0.04,
  0.0562,
  0.0525,
  0.0562,
  0.05,
  0.0438,
  0.0312,
  0.0275,
  0.025, // 2025 (estimate)
  0.0813,
  0.0688,
  0.035,
  0.04,
  0.0312,
  0.0312, // 2026 (estimate)
];
// Hoboken gross rent yields 1970–2026
const HOBOKEN_RENT_YIELDS = [
  0.071, 0.069, 0.066, 0.063, 0.061, 0.059, 0.061, 0.061, 0.059, 0.056, 0.056,
  0.058, 0.063, 0.066, 0.069, 0.069, 0.066, 0.061, 0.056, 0.053, 0.056, 0.059,
  0.063, 0.066, 0.063, 0.061, 0.059, 0.055, 0.051, 0.045, 0.039, 0.035, 0.031,
  0.027, 0.024, 0.022, 0.022, 0.026, 0.033, 0.041, 0.045, 0.049, 0.047, 0.041,
  0.039, 0.037, 0.036, 0.035, 0.035, 0.035, 0.033, 0.029, 0.034, 0.037, 0.037,
  0.037, 0.037,
];

// Scarsdale (scarsdale) — NYC boom×1.08 bust×0.94; rent×0.95; yield×0.92
// Scarsdale price appreciation 1970–2026
const SCARSDALE_ANN = [
  -0.03,
  -0.04,
  0.0,
  0.02,
  0.01,
  -0.02,
  0.061,
  0.13,
  0.184,
  0.238,
  0.194,
  0.13,
  0.086,
  0.061,
  0.108,
  0.162,
  0.216,
  0.238,
  0.184,
  0.086,
  -0.075,
  -0.113,
  -0.094,
  -0.056,
  -0.02,
  0.02,
  0.051,
  0.097,
  0.14,
  0.162,
  0.184,
  0.097,
  0.119,
  0.173,
  0.205,
  0.238,
  0.14,
  0.04,
  -0.094,
  -0.103,
  -0.03,
  0.01,
  0.051,
  0.13,
  0.086,
  0.071,
  0.051,
  0.051,
  0.061,
  0.04,
  0.119,
  0.194,
  0.051,
  0.04,
  0.051, // 2025 (estimate)
  0.03,
  0.03, // 2026 (estimate)
];
// Scarsdale rent growth 1970–2026
const SCARSDALE_RENT_GROWTH = [
  0.038,
  0.038,
  0.038,
  0.0475,
  0.0665,
  0.0855,
  0.0855,
  0.0855,
  0.095,
  0.1045,
  0.095,
  0.0665,
  0.038,
  0.019,
  0.019,
  0.0285,
  0.038,
  0.0475,
  0.0475,
  0.038,
  0.0095,
  0.0,
  0.0095,
  0.019,
  0.0238,
  0.0333,
  0.038,
  0.0427,
  0.0475,
  0.0522,
  0.057,
  0.0522,
  0.0456,
  0.038,
  0.0304,
  0.0285,
  0.0266,
  0.0238,
  0.0114,
  -0.0142,
  0.0047,
  0.0142,
  0.0304,
  0.0427,
  0.0399,
  0.0427,
  0.038,
  0.0333,
  0.0238,
  0.0209, // 2025 (estimate)
  0.019,
  0.0617,
  0.0522,
  0.0266,
  0.0304,
  0.0238,
  0.0238, // 2026 (estimate)
];
// Scarsdale gross rent yields 1970–2026
const SCARSDALE_RENT_YIELDS = [
  0.064, 0.063, 0.06, 0.057, 0.055, 0.053, 0.055, 0.055, 0.053, 0.051, 0.051,
  0.052, 0.057, 0.06, 0.063, 0.063, 0.06, 0.055, 0.051, 0.048, 0.051, 0.053,
  0.057, 0.06, 0.057, 0.055, 0.053, 0.05, 0.046, 0.04, 0.035, 0.031, 0.028,
  0.024, 0.022, 0.02, 0.02, 0.023, 0.029, 0.037, 0.04, 0.044, 0.042, 0.037,
  0.035, 0.033, 0.032, 0.031, 0.031, 0.031, 0.029, 0.026, 0.03, 0.033, 0.033,
  0.033, 0.033,
];

// Great Neck (greatneck) — NYC boom×1.06 bust×0.96; rent×0.98; yield×0.95
// Great Neck price appreciation 1970–2026
const GREATNECK_ANN = [
  -0.03,
  -0.04,
  0.0,
  0.02,
  0.01,
  -0.02,
  0.06,
  0.127,
  0.18,
  0.233,
  0.191,
  0.127,
  0.085,
  0.06,
  0.106,
  0.159,
  0.212,
  0.233,
  0.18,
  0.085,
  -0.077,
  -0.115,
  -0.096,
  -0.058,
  -0.02,
  0.02,
  0.05,
  0.095,
  0.138,
  0.159,
  0.18,
  0.095,
  0.117,
  0.17,
  0.201,
  0.233,
  0.138,
  0.04,
  -0.096,
  -0.106,
  -0.03,
  0.01,
  0.05,
  0.127,
  0.085, // 2025 (estimate)
  0.07,
  0.05,
  0.05,
  0.06,
  0.04,
  0.117,
  0.191,
  0.05,
  0.04,
  0.05,
  0.03,
  0.03, // 2026 (estimate)
];
// Great Neck rent growth 1970–2026
const GREATNECK_RENT_GROWTH = [
  0.0392,
  0.0392,
  0.0392,
  0.049,
  0.0686,
  0.0882,
  0.0882,
  0.0882,
  0.098,
  0.1078,
  0.098,
  0.0686,
  0.0392,
  0.0196,
  0.0196,
  0.0294,
  0.0392,
  0.049,
  0.049,
  0.0392,
  0.0098,
  0.0,
  0.0098,
  0.0196,
  0.0245,
  0.0343,
  0.0392,
  0.0441,
  0.049,
  0.0539,
  0.0588,
  0.0539,
  0.047,
  0.0392,
  0.0314,
  0.0294,
  0.0274,
  0.0245,
  0.0118,
  -0.0147,
  0.0049,
  0.0147,
  0.0314,
  0.0441,
  0.0412,
  0.0441,
  0.0392,
  0.0343, // 2025 (estimate)
  0.0245,
  0.0216,
  0.0196,
  0.0637,
  0.0539,
  0.0274,
  0.0314,
  0.0245,
  0.0245, // 2026 (estimate)
];
// Great Neck gross rent yields 1970–2026
const GREATNECK_RENT_YIELDS = [
  0.067, 0.065, 0.062, 0.059, 0.057, 0.055, 0.057, 0.057, 0.055, 0.052, 0.052,
  0.054, 0.059, 0.062, 0.065, 0.065, 0.062, 0.057, 0.052, 0.049, 0.052, 0.055,
  0.059, 0.062, 0.059, 0.057, 0.055, 0.051, 0.048, 0.042, 0.036, 0.032, 0.028,
  0.025, 0.023, 0.021, 0.021, 0.024, 0.03, 0.038, 0.042, 0.046, 0.044, 0.038,
  0.036, 0.034, 0.033, 0.032, 0.032, 0.032, 0.03, 0.027, 0.031, 0.034, 0.034,
  0.034, 0.034,
];

// ── Los Angeles CA (FHFA MSAD 31084 + pre-1975 West-region/CAR est) ──
const LA_ANN = [
  // 1970–1975 (est)
  0.02, 0.07, 0.09, 0.15, 0.12, 0.14,
  // 1976–1985
  0.214, 0.257, 0.178, 0.194, 0.134, 0.07, -0.01, 0.036, 0.042, 0.068,
  // 1986–1994
  0.086, 0.157, 0.237, 0.201, -0.005, -0.005, -0.039, -0.066, -0.095,
  // 1995–2003
  0.019, -0.025, 0.049, 0.101, 0.058, 0.09, 0.1, 0.152, 0.18,
  // 2004–2011
  0.274, 0.237, 0.08, -0.066, -0.228, -0.055, -0.006, -0.042,
  // 2012–2019
  0.023, 0.149, 0.078, 0.069, 0.067, 0.07, 0.054, 0.033,
  // 2020–2024
  0.054, 0.172, 0.081, 0.046, 0.057,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];
const LA_RENT_GROWTH = [
  // 1970–1977 (BLS CUURA421SEHA — LA metro)
  0.0568, 0.0391, 0.0141, 0.0325, 0.0539, 0.0512, 0.0771, 0.0942,
  // 1978–2015 (BLS CUURA421SEHA — LA metro; discontinued 2017)
  0.0998, 0.1033, 0.1092, 0.1176, 0.0858, 0.0622, 0.0794, 0.091, 0.0708, 0.0425,
  0.037, 0.059, 0.0419, 0.0204, 0.0058, 0.0006, 0.0083, -0.0089, 0.0141, 0.0165,
  0.0299, 0.0369, 0.0403, 0.0634, 0.047, 0.0585, 0.069, 0.0601, 0.0563, 0.0595,
  0.0438, 0.0068, 0.0007, 0.0129, 0.0256, 0.0273, 0.0269, 0.0389,
  // 2016–2024 (Zillow ZORI Los Angeles metro)
  0.0656, 0.0742, 0.031, 0.0195, 0.0216, 0.093, 0.1028, 0.0638, 0.0033,
  // 2025 (estimate)
  0.02,
  // 2026 (estimate)
  0.02,
];
const LA_RENT_YIELDS = [
  // 1970–1993
  0.075, 0.075, 0.07, 0.068, 0.065, 0.062, 0.058, 0.055, 0.053, 0.051, 0.052,
  0.055, 0.06, 0.062, 0.065, 0.065, 0.063, 0.059, 0.055, 0.052, 0.054, 0.058,
  0.063, 0.068,
  // 1994–2024
  0.072, 0.073, 0.07, 0.066, 0.06, 0.054, 0.049, 0.044, 0.04, 0.036, 0.032,
  0.029, 0.028, 0.03, 0.038, 0.044, 0.048, 0.052, 0.05, 0.046, 0.044, 0.042,
  0.04, 0.039, 0.039, 0.039, 0.037, 0.033, 0.031, 0.033, 0.033,
  // 2025 (estimate)
  0.033,
  // 2026 (estimate)
  0.033,
];

// ── San Diego CA (FHFA MSA 41740 + pre-1975 est) ──
const SD_ANN = [
  // 1970–1975 (est)
  0.03, 0.07, 0.09, 0.16, 0.12, 0.13,
  // 1976–1985
  0.169, 0.301, 0.18, 0.201, -0.045, 0.084, 0.058, 0.023, 0.043, 0.043,
  // 1986–1994
  0.078, 0.097, 0.176, 0.193, 0.015, -0.002, -0.022, -0.031, -0.047,
  // 1995–2003
  0.013, -0.007, 0.047, 0.113, 0.104, 0.154, 0.117, 0.172, 0.169,
  // 2004–2011
  0.272, 0.109, -0.015, -0.097, -0.195, -0.038, 0.0, -0.043,
  // 2012–2019
  0.034, 0.157, 0.058, 0.063, 0.065, 0.071, 0.044, 0.032,
  // 2020–2024
  0.063, 0.206, 0.093, 0.077, 0.061,
  // 2025 (estimate)
  0.04,
  // 2026 (estimate)
  0.04,
];
const SD_RENT_GROWTH = [
  // 1970–1977 (pre-1978 US national CPI rent estimates)
  0.05, 0.04, 0.035, 0.05, 0.056, 0.053, 0.057, 0.07,
  // 1978–2015 (BLS West Urban CPI — CUUR0400SEHA)
  0.0808, 0.1196, 0.1001, 0.0934, 0.0721, 0.0611, 0.0722, 0.0792, 0.043, 0.038,
  0.0335, 0.0437, 0.044, 0.027, 0.0242, 0.0158, 0.0175, 0.0197, 0.0231, 0.0348,
  0.0412, 0.0396, 0.0512, 0.0606, 0.0259, 0.0267, 0.032, 0.0328, 0.0426, 0.0492,
  0.035, -0.0042, 0.0058, 0.0242, 0.0296, 0.0324, 0.0391, 0.0475,
  // 2016–2024 (Zillow ZORI San Diego)
  0.0841, 0.0788, 0.0285, 0.0219, -0.0177, 0.1395, 0.1108, 0.088, 0.0047,
  // 2025 (estimate)
  0.025,
  // 2026 (estimate)
  0.025,
];
const SD_RENT_YIELDS = [
  // 1970–1993
  0.07, 0.07, 0.067, 0.064, 0.061, 0.058, 0.055, 0.052, 0.05, 0.048, 0.05,
  0.053, 0.058, 0.06, 0.063, 0.063, 0.061, 0.057, 0.052, 0.048, 0.05, 0.055,
  0.06, 0.065,
  // 1994–2024
  0.068, 0.068, 0.065, 0.06, 0.053, 0.046, 0.04, 0.035, 0.03, 0.026, 0.022,
  0.019, 0.019, 0.022, 0.03, 0.04, 0.045, 0.05, 0.047, 0.042, 0.04, 0.038,
  0.037, 0.036, 0.036, 0.036, 0.035, 0.03, 0.03, 0.033, 0.035,
  // 2025 (estimate)
  0.035,
  // 2026 (estimate)
  0.035,
];

// ── San Francisco Bay Area CA (FHFA MSAD 41884 + pre-1975 est) ──
const SF_ANN = [
  // 1970–1975 (est)
  0.05, 0.08, 0.1, 0.18, 0.13, 0.15,
  // 1976–1985
  0.229, 0.208, 0.101, 0.277, 0.123, 0.019, -0.003, 0.077, 0.065, 0.104,
  // 1986–1994
  0.13, 0.188, 0.262, 0.154, -0.035, -0.023, -0.028, -0.025, -0.027,
  // 1995–2003
  0.021, 0.026, 0.105, 0.118, 0.175, 0.225, 0.047, 0.073, 0.059,
  // 2004–2011
  0.17, 0.177, 0.018, -0.027, -0.107, -0.063, -0.008, -0.031,
  // 2012–2019
  0.069, 0.153, 0.113, 0.135, 0.059, 0.049, 0.071, -0.007,
  // 2020–2024
  -0.04, 0.062, 0.076, 0.016, 0.029,
  // 2025 (estimate)
  0.025,
  // 2026 (estimate)
  0.025,
];
const SF_RENT_GROWTH = [
  // 1970–2024 (BLS CUURA422SEHA — SF metro, complete uninterrupted series)
  0.0693, 0.037, 0.0268, 0.0391, 0.0418, 0.0522, 0.0611, 0.0845, 0.0564, 0.1366,
  0.105, 0.0775, 0.0858, 0.1143, 0.0825, 0.0912, 0.0544, 0.0423, 0.0414, 0.0525,
  0.0391, 0.0272, 0.0246, 0.0234, 0.0132, 0.0196, 0.0396, 0.0796, 0.0696,
  0.0694, 0.0867, 0.094, 0.0073, -0.003, -0.0004, 0.0015, 0.0281, 0.0451,
  0.0413, 0.0113, 0.0061, 0.0359, 0.0441, 0.0454, 0.0604, 0.0676, 0.0654,
  0.0482, 0.0462, 0.0383, 0.0074, -0.0027, 0.0425, 0.0327, 0.0247,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];
const SF_RENT_YIELDS = [
  // 1970–1993 (SF already premium, lower yields)
  0.065, 0.065, 0.062, 0.058, 0.055, 0.052, 0.048, 0.046, 0.044, 0.042, 0.044,
  0.047, 0.052, 0.055, 0.057, 0.057, 0.054, 0.05, 0.045, 0.042, 0.045, 0.048,
  0.052, 0.055,
  // 1994–2024 (extreme compression during tech booms)
  0.057, 0.058, 0.055, 0.05, 0.045, 0.038, 0.032, 0.032, 0.035, 0.04, 0.05,
  0.058, 0.063, 0.065, 0.06, 0.053, 0.05, 0.046, 0.04, 0.035, 0.03, 0.028,
  0.026, 0.025, 0.025, 0.025, 0.024, 0.022, 0.022, 0.025, 0.026,
  // 2025 (estimate)
  0.026,
  // 2026 (estimate)
  0.026,
];

// ── Miami FL (FHFA MSAD 33124 + pre-1975 South-region est) ──
const MIAMI_ANN = [
  // 1970–1975 (est)
  0.08, 0.1, 0.14, 0.18, 0.1, 0.09,
  // 1976–1985
  0.031, 0.105, 0.091, 0.239, 0.144, -0.022, 0.088, -0.002, -0.006, -0.028,
  // 1986–1994
  0.066, 0.051, 0.06, 0.03, 0.024, 0.042, 0.024, 0.088, 0.021,
  // 1995–2003
  0.063, 0.017, 0.029, 0.051, 0.023, 0.081, 0.131, 0.145, 0.15,
  // 2004–2011
  0.206, 0.281, 0.145, -0.017, -0.288, -0.151, -0.029, -0.049,
  // 2012–2019
  0.047, 0.125, 0.112, 0.094, 0.086, 0.069, 0.066, 0.048,
  // 2020–2024
  0.065, 0.214, 0.209, 0.109, 0.088,
  // 2025 (estimate)
  0.04,
  // 2026 (estimate)
  0.04,
];
const MIAMI_RENT_GROWTH = [
  // 1970–2024 (BLS CUURA320SEHA — Miami metro; pre-1978 est)
  0.06, 0.05, 0.045, 0.06, 0.07, 0.065, 0.065, 0.075, 0.037, 0.0847, 0.1521,
  0.1177, 0.0521, 0.0243, 0.0049, 0.0344, 0.0104, 0.0188, 0.0378, 0.024, 0.0277,
  0.0506, 0.012, 0.0484, 0.0522, 0.0295, 0.0286, 0.0177, 0.018, 0.0066, 0.0221,
  0.0446, 0.0482, 0.0378, 0.0667, 0.0552, 0.0896, 0.068, 0.0336, -0.0227,
  0.0104, 0.003, 0.0213, 0.0262, 0.0574, 0.0452, 0.0581, 0.0335, 0.0355, 0.0273,
  0.0268, 0.0371, 0.186, 0.1011, 0.0477,
  // 2025 (estimate)
  0.01,
  // 2026 (estimate)
  0.01,
];
const MIAMI_RENT_YIELDS = [
  // 1970–1993
  0.08, 0.08, 0.078, 0.076, 0.074, 0.072, 0.073, 0.073, 0.072, 0.071, 0.072,
  0.075, 0.08, 0.082, 0.083, 0.085, 0.084, 0.082, 0.08, 0.078, 0.08, 0.082,
  0.084, 0.084,
  // 1994–2024
  0.082, 0.08, 0.078, 0.074, 0.068, 0.059, 0.05, 0.043, 0.038, 0.032, 0.026,
  0.022, 0.02, 0.022, 0.032, 0.044, 0.052, 0.058, 0.055, 0.048, 0.045, 0.042,
  0.04, 0.04, 0.042, 0.044, 0.041, 0.034, 0.038, 0.048, 0.05,
  // 2025 (estimate)
  0.05,
  // 2026 (estimate)
  0.05,
];

// ── Dallas–Fort Worth TX (FHFA MSAD 19124 + pre-1975 South-region est) ──
const DFW_ANN = [
  // 1970–1975 (est)
  0.04, 0.06, 0.08, 0.15, 0.09, 0.1,
  // 1976–1985 (oil boom, then bust)
  0.034, 0.166, 0.215, 0.199, 0.11, -0.028, 0.126, 0.11, 0.051, 0.042,
  // 1986–1994 (Texas real estate bust — S&L crisis)
  0.011, -0.077, -0.049, 0.008, -0.007, 0.03, 0.021, 0.02, -0.011,
  // 1995–2003 (steady modest growth)
  0.039, 0.02, 0.04, 0.057, 0.058, 0.061, 0.065, 0.035, 0.018,
  // 2004–2011 (TX avoided bubble; modest decline in GFC)
  0.027, 0.032, 0.028, 0.023, 0.006, -0.013, -0.003, -0.016,
  // 2012–2019 (strong DFW growth)
  0.022, 0.067, 0.088, 0.104, 0.101, 0.092, 0.05, 0.043,
  // 2020–2024
  0.049, 0.214, 0.149, 0.022, 0.04,
  // 2025 (estimate)
  0.02,
  // 2026 (estimate)
  0.02,
];
const DFW_RENT_GROWTH = [
  // 1970–1977 (BLS CUURA316SEHA — Dallas metro)
  0.0319, 0.0022, 0.0066, 0.0219, 0.0343, 0.0518, 0.0591, 0.0985,
  // 1978–2015 (BLS CUURA316SEHA — Dallas metro; 1978 estimated)
  0.09, 0.0991, 0.1749, 0.0512, 0.0675, 0.0642, 0.0389, 0.0544, 0.016, -0.0262,
  -0.0266, 0.0091, 0.0505, 0.0326, 0.01, 0.0296, 0.0408, 0.0369, 0.0348, 0.048,
  0.0369, 0.0428, 0.0373, 0.0365, 0.0264, -0.0114, -0.0255, 0.0089, 0.0188,
  0.028, 0.0613, 0.0112, -0.0243, 0.0398, 0.047, 0.019, 0.0491, 0.0548,
  // 2016–2024 (Zillow ZORI Dallas–Fort Worth)
  0.0618, 0.0514, 0.0313, 0.0435, 0.0041, 0.1895, 0.0633, 0.009, -0.01,
  // 2025 (estimate)
  0.01,
  // 2026 (estimate)
  0.01,
];
const DFW_RENT_YIELDS = [
  // 1970–1993 (high TX yields)
  0.095, 0.095, 0.092, 0.09, 0.09, 0.09, 0.092, 0.092, 0.09, 0.09, 0.09, 0.093,
  0.095, 0.095, 0.094, 0.094, 0.094, 0.096, 0.098, 0.098, 0.1, 0.1, 0.1, 0.098,
  // 1994–2024
  0.095, 0.095, 0.093, 0.09, 0.088, 0.086, 0.084, 0.082, 0.08, 0.08, 0.08, 0.08,
  0.082, 0.085, 0.09, 0.095, 0.095, 0.096, 0.095, 0.092, 0.09, 0.088, 0.085,
  0.082, 0.082, 0.082, 0.075, 0.062, 0.068, 0.072, 0.07,
  // 2025 (estimate)
  0.068,
  // 2026 (estimate)
  0.068,
];

// ── Seattle WA (FHFA MSAD 42644 + pre-1975 Boeing-bust-adjusted est) ──
const SEATTLE_ANN = [
  // 1970–1975 (est — Boeing bust 1969-71, severe decline)
  -0.08, -0.05, 0.03, 0.08, 0.07, 0.15,
  // 1976–1985
  0.206, 0.29, 0.265, 0.151, 0.045, 0.028, -0.015, 0.027, 0.044, 0.027,
  // 1986–1994
  0.041, 0.06, 0.085, 0.237, 0.182, 0.019, 0.018, 0.02, 0.016,
  // 1995–2003
  0.042, 0.034, 0.089, 0.097, 0.093, 0.082, 0.06, 0.048, 0.058,
  // 2004–2011
  0.11, 0.172, 0.135, 0.043, -0.076, -0.1, -0.044, -0.047,
  // 2012–2019 (tech boom)
  0.026, 0.092, 0.082, 0.112, 0.12, 0.134, 0.049, 0.032,
  // 2020–2024
  0.065, 0.177, 0.054, 0.024, 0.055,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];
const SEATTLE_RENT_GROWTH = [
  // 1970–1977 (BLS CUURA423SEHA — Seattle metro; negative in Boeing bust years)
  -0.0114, -0.0185, 0.0, 0.0494, 0.1121, 0.0867, 0.0835, 0.0925,
  // 1978–2015 (BLS CUURA423SEHA — Seattle metro; 1987–1997 gap filled West CPI)
  0.0925, 0.1722, 0.1469, 0.0544, 0.003, 0.0061, 0.0441, 0.049, 0.0321, 0.04,
  0.038, 0.0437, 0.044, 0.027, 0.0242, 0.0158, 0.0175, 0.0197, 0.0231, 0.0348,
  0.055, 0.0368, 0.0439, 0.0588, 0.0024, -0.0086, 0.0048, 0.0268, 0.0486,
  0.0835, 0.0682, -0.0128, -0.0163, 0.0402, 0.0308, 0.0555, 0.0589, 0.0502,
  // 2016–2024 (Zillow ZORI Seattle)
  0.1067, 0.0644, -0.0004, 0.0346, 0.0234, 0.1563, 0.0268, 0.0364, 0.0086,
  // 2025 (estimate)
  0.02,
  // 2026 (estimate)
  0.02,
];
const SEATTLE_RENT_YIELDS = [
  // 1970–1993 (Boeing bust → low yields early, then recovery)
  0.075, 0.08, 0.082, 0.08, 0.078, 0.073, 0.068, 0.063, 0.06, 0.058, 0.06,
  0.063, 0.068, 0.07, 0.073, 0.074, 0.074, 0.072, 0.068, 0.062, 0.063, 0.065,
  0.067, 0.067,
  // 1994–2024
  0.063, 0.062, 0.059, 0.055, 0.05, 0.046, 0.042, 0.038, 0.034, 0.03, 0.028,
  0.026, 0.027, 0.03, 0.036, 0.042, 0.046, 0.05, 0.048, 0.043, 0.04, 0.037,
  0.037, 0.035, 0.033, 0.031, 0.03, 0.026, 0.028, 0.032, 0.033,
  // 2025 (estimate)
  0.033,
  // 2026 (estimate)
  0.033,
];

// ── New York City metro (FHFA MSA 35620 approx; more volatile than NY statewide) ──
const NYC_ANN = [
  // 1970–1975 (NYC urban crisis / fiscal collapse 1975)
  -0.03, -0.04, 0.0, 0.02, 0.01, -0.02,
  // 1976–1985 (Koch-era NYC revival)
  0.06, 0.12, 0.17, 0.22, 0.18, 0.12, 0.08, 0.06, 0.1, 0.15,
  // 1986–1994 (finance boom → bust)
  0.2, 0.22, 0.17, 0.08, -0.08, -0.12, -0.1, -0.06, -0.02,
  // 1995–2003 (recovery + dot-com + 9/11 resilience)
  0.02, 0.05, 0.09, 0.13, 0.15, 0.17, 0.09, 0.11, 0.16,
  // 2004–2011 (finance boom → moderate GFC decline)
  0.19, 0.22, 0.13, 0.04, -0.1, -0.11, -0.03, 0.01,
  // 2012–2019 (strong recovery)
  0.05, 0.12, 0.08, 0.07, 0.05, 0.05, 0.06, 0.04,
  // 2020–2024 (COVID → suburban surge in NYC metro)
  0.11, 0.18, 0.05, 0.04, 0.05,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];
const NYC_RENT_GROWTH = [
  // 1970–1993 (same as NY statewide — BLS Northeast CPI-Rent dominated by NYC)
  0.04, 0.04, 0.04, 0.05, 0.07, 0.09, 0.09, 0.09, 0.1, 0.11, 0.1, 0.07, 0.04,
  0.02, 0.02, 0.03, 0.04, 0.05, 0.05, 0.04, 0.01, 0.0, 0.01, 0.02,
  // 1994–2024
  0.025, 0.035, 0.04, 0.045, 0.05, 0.055, 0.06, 0.055, 0.048, 0.04, 0.032, 0.03,
  0.028, 0.025, 0.012, -0.015, 0.005, 0.015, 0.032, 0.045, 0.042, 0.045, 0.04,
  0.035, 0.025, 0.022, 0.02, 0.065, 0.055, 0.028, 0.032,
  // 2025 (estimate)
  0.025,
  // 2026 (estimate)
  0.025,
];
const NYC_RENT_YIELDS = [
  // 1970–1993 (rent control suppresses yields in Manhattan; metro-wide slightly higher)
  0.07,
  0.068, 0.065, 0.062, 0.06, 0.058, 0.06, 0.06, 0.058, 0.055, 0.055, 0.057,
  0.062, 0.065, 0.068, 0.068, 0.065, 0.06, 0.055, 0.052, 0.055, 0.058, 0.062,
  0.065,
  // 1994–2024
  0.062, 0.06, 0.058, 0.054, 0.05, 0.044, 0.038, 0.034, 0.03, 0.026, 0.024,
  0.022, 0.022, 0.025, 0.032, 0.04, 0.044, 0.048, 0.046, 0.04, 0.038, 0.036,
  0.035, 0.034, 0.034, 0.034, 0.032, 0.028, 0.033, 0.036, 0.036,
  // 2025 (estimate)
  0.036,
  // 2026 (estimate)
  0.036,
];

// ── Texas statewide (FHFA TXSTHPI; pre-1976 est) ──
const TX_ANN = [
  // 1970–1975 (est — pre-FHFA, oil-boom era)
  0.03, 0.04, 0.05, 0.06, 0.07, 0.08,
  // 1976–1993 (FHFA TXSTHPI Q4-to-Q4; 1987 oil bust clearly visible)
  0.0643, 0.1649, 0.1616, 0.1358, 0.0906, 0.0611, 0.0766, 0.046, 0.014, -0.0116,
  0.0, -0.093, -0.0141, 0.0279, 0.0048, 0.0359, 0.0344, 0.0334,
  // 1994–2024 (FHFA TXSTHPI Q4-to-Q4)
  0.0022, 0.0355, 0.0141, 0.0339, 0.0509, 0.0581, 0.0594, 0.0615, 0.0379,
  0.0206, 0.0349, 0.0502, 0.0574, 0.0413, 0.0067, -0.0075, -0.0036, -0.0102,
  0.0227, 0.0547, 0.0739, 0.0709, 0.0723, 0.0677, 0.0523, 0.0498, 0.0575,
  0.1995, 0.1302, 0.0212, 0.0369,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];
const TX_RENT_GROWTH = [
  // 1970–1993
  0.04, 0.04, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.09, 0.08, 0.07, 0.04, 0.02,
  0.01, 0.01, 0.01, 0.01, 0.02, 0.02, 0.03, 0.03, 0.03, 0.03, 0.03,
  // 1994–2024
  0.03, 0.03, 0.032, 0.034, 0.038, 0.042, 0.045, 0.038, 0.03, 0.02, 0.02, 0.028,
  0.035, 0.04, 0.015, -0.01, 0.005, 0.018, 0.028, 0.038, 0.04, 0.042, 0.038,
  0.03, 0.025, 0.028, 0.03, 0.085, 0.06, 0.025, 0.03,
  // 2025 (estimate)
  0.025,
  // 2026 (estimate)
  0.025,
];
const TX_RENT_YIELDS = [
  // 1970–1993 (higher than CA, more landlord-friendly)
  0.11, 0.11, 0.1, 0.1, 0.1, 0.1, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09,
  0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09,
  // 1994–2024
  0.09, 0.09, 0.09, 0.09, 0.088, 0.086, 0.085, 0.086, 0.087, 0.087, 0.087,
  0.087, 0.087, 0.086, 0.09, 0.092, 0.09, 0.088, 0.088, 0.086, 0.085, 0.084,
  0.082, 0.08, 0.08, 0.08, 0.077, 0.07, 0.062, 0.064, 0.065,
  // 2025 (estimate)
  0.065,
  // 2026 (estimate)
  0.065,
];

// ── Florida statewide (FHFA FLSTHPI; pre-1976 est) ──
const FL_ANN = [
  // 1970–1975 (est — pre-FHFA)
  0.04, 0.05, 0.05, 0.06, 0.07, 0.07,
  // 1976–1993 (FHFA FLSTHPI Q4-to-Q4)
  0.0305, 0.0658, 0.1303, 0.1574, 0.1108, -0.0376, 0.0758, 0.1056, 0.0157,
  0.027, 0.0458, 0.0295, 0.0489, 0.0389, 0.0036, 0.0302, 0.0204, 0.0301,
  // 1994–2024 (FHFA FLSTHPI Q4-to-Q4)
  -0.0068, 0.0447, 0.0132, 0.042, 0.0465, 0.0379, 0.0821, 0.1049, 0.1052,
  0.1209, 0.1989, 0.2751, 0.0765, -0.078, -0.2205, -0.1143, -0.0523, -0.0587,
  0.0103, 0.1012, 0.0832, 0.0942, 0.091, 0.0822, 0.0653, 0.0591, 0.0742, 0.2479,
  0.1818, 0.0491, 0.0391,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];
const FL_RENT_GROWTH = [
  // 1970–1993
  0.04, 0.04, 0.04, 0.05, 0.06, 0.07, 0.07, 0.07, 0.08, 0.09, 0.08, 0.05, 0.03,
  0.02, 0.02, 0.03, 0.04, 0.04, 0.04, 0.03, 0.02, 0.01, 0.02, 0.02,
  // 1994–2024
  0.025, 0.03, 0.035, 0.04, 0.048, 0.056, 0.062, 0.06, 0.05, 0.04, 0.03, 0.025,
  0.022, 0.018, 0.005, -0.02, -0.01, 0.01, 0.03, 0.04, 0.045, 0.045, 0.042,
  0.038, 0.028, 0.025, 0.028, 0.095, 0.068, 0.028, 0.03,
  // 2025 (estimate)
  0.028,
  // 2026 (estimate)
  0.028,
];
const FL_RENT_YIELDS = [
  // 1970–1993
  0.1, 0.1, 0.09, 0.09, 0.09, 0.09, 0.09, 0.08, 0.08, 0.08, 0.08, 0.08, 0.09,
  0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09,
  // 1994–2024
  0.09, 0.088, 0.085, 0.08, 0.075, 0.068, 0.06, 0.055, 0.05, 0.045, 0.04, 0.038,
  0.038, 0.04, 0.048, 0.058, 0.062, 0.065, 0.062, 0.058, 0.055, 0.052, 0.05,
  0.048, 0.05, 0.05, 0.048, 0.042, 0.048, 0.052, 0.052,
  // 2025 (estimate)
  0.052,
  // 2026 (estimate)
  0.052,
];

// ── Washington statewide (FHFA WASTHPI; pre-1976 est) ──
const WA_ANN = [
  // 1970–1975 (est — pre-FHFA)
  0.03, 0.04, 0.05, 0.06, 0.07, 0.08,
  // 1976–1993 (FHFA WASTHPI Q4-to-Q4; 1989-90 Pacific NW boom clearly visible)
  0.1953, 0.2252, 0.2276, 0.1277, 0.0389, 0.0179, -0.0022, 0.014, 0.0494,
  0.0196, 0.0332, 0.0323, 0.0682, 0.1972, 0.1602, 0.0595, 0.0383, 0.0408,
  // 1994–2024 (FHFA WASTHPI Q4-to-Q4)
  0.0354, 0.0443, 0.0242, 0.0548, 0.0652, 0.0468, 0.0551, 0.0557, 0.0458,
  0.0556, 0.1141, 0.1827, 0.127, 0.0381, -0.0614, -0.0939, -0.0462, -0.0544,
  0.0051, 0.0573, 0.0706, 0.0905, 0.1037, 0.1052, 0.0741, 0.0598, 0.0844,
  0.2121, 0.0687, 0.0259, 0.051,
  // 2025 (estimate)
  0.04,
  // 2026 (estimate)
  0.04,
];
const WA_RENT_GROWTH = [
  // 1970–1993
  0.03, 0.04, 0.04, 0.05, 0.06, 0.07, 0.07, 0.08, 0.09, 0.09, 0.07, 0.04, 0.03,
  0.03, 0.04, 0.04, 0.05, 0.04, 0.04, 0.03, 0.02, 0.01, 0.02, 0.03,
  // 1994–2024
  0.03, 0.035, 0.038, 0.04, 0.045, 0.048, 0.048, 0.04, 0.038, 0.032, 0.028,
  0.03, 0.038, 0.042, 0.01, -0.008, 0.005, 0.018, 0.038, 0.05, 0.048, 0.052,
  0.048, 0.04, 0.032, 0.03, 0.032, 0.09, 0.062, 0.025, 0.03,
  // 2025 (estimate)
  0.025,
  // 2026 (estimate)
  0.025,
];
const WA_RENT_YIELDS = [
  // 1970–1993
  0.1, 0.1, 0.09, 0.09, 0.09, 0.09, 0.09, 0.08, 0.08, 0.08, 0.08, 0.09, 0.09,
  0.09, 0.09, 0.09, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08,
  // 1994–2024
  0.075, 0.073, 0.072, 0.07, 0.068, 0.065, 0.062, 0.06, 0.058, 0.055, 0.052,
  0.05, 0.05, 0.052, 0.06, 0.065, 0.066, 0.064, 0.062, 0.058, 0.055, 0.052,
  0.05, 0.048, 0.048, 0.048, 0.046, 0.04, 0.044, 0.047, 0.047,
  // 2025 (estimate)
  0.047,
  // 2026 (estimate)
  0.047,
];

// ── New York statewide (FHFA NYSTHPI; pre-1976 est) ──
const NY_ANN = [
  // 1970–1975 (est — pre-FHFA, NYC fiscal crisis era)
  0.04, 0.05, 0.05, 0.06, 0.07, 0.08,
  // 1976–1993 (FHFA NYSTHPI Q4-to-Q4; 1982-87 finance boom clearly visible)
  -0.0689, 0.1483, -0.0122, 0.1747, 0.1306, 0.0255, 0.1059, 0.1666, 0.1473,
  0.1734, 0.1954, 0.1423, 0.0474, 0.0101, -0.0274, 0.0102, 0.023, 0.0053,
  // 1994–2024 (FHFA NYSTHPI Q4-to-Q4)
  -0.0482, 0.0261, 0.0023, 0.0311, 0.0523, 0.0746, 0.0917, 0.0929, 0.1124,
  0.1131, 0.1297, 0.1207, 0.0331, -0.0099, -0.0486, -0.042, 0.0009, -0.0261,
  -0.0113, 0.0068, 0.0307, 0.0278, 0.044, 0.0478, 0.0399, 0.0508, 0.0571,
  0.1388, 0.0998, 0.0765, 0.0775,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];
const NY_RENT_GROWTH = [
  // 1970–1993
  0.04, 0.04, 0.04, 0.05, 0.07, 0.09, 0.09, 0.09, 0.1, 0.11, 0.1, 0.07, 0.04,
  0.02, 0.02, 0.03, 0.04, 0.05, 0.05, 0.04, 0.01, 0.0, 0.01, 0.02,
  // 1994–2024
  0.025, 0.035, 0.04, 0.045, 0.05, 0.055, 0.06, 0.055, 0.048, 0.04, 0.032, 0.03,
  0.028, 0.025, 0.012, -0.015, 0.005, 0.015, 0.032, 0.045, 0.042, 0.045, 0.04,
  0.035, 0.025, 0.022, 0.02, 0.065, 0.055, 0.028, 0.032,
  // 2025 (estimate)
  0.025,
  // 2026 (estimate)
  0.025,
];
const NY_RENT_YIELDS = [
  // 1970–1993
  0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.07, 0.07, 0.06, 0.06, 0.07, 0.08,
  0.08, 0.08, 0.08, 0.07, 0.06, 0.06, 0.06, 0.07, 0.07, 0.07, 0.07,
  // 1994–2024
  0.065, 0.062, 0.06, 0.058, 0.055, 0.05, 0.044, 0.04, 0.038, 0.034, 0.032,
  0.028, 0.028, 0.03, 0.036, 0.042, 0.044, 0.044, 0.042, 0.038, 0.036, 0.034,
  0.034, 0.033, 0.034, 0.034, 0.032, 0.028, 0.032, 0.034, 0.034,
  // 2025 (estimate)
  0.034,
  // 2026 (estimate)
  0.034,
];

// NASDAQ Composite annual price returns, 1970–2045 (approximate; source: Macrotrends)
const NASDAQ_PRICE = [
  // 1970–1993
  0.003,
  0.274,
  0.171,
  -0.311,
  -0.351,
  0.298,
  0.261,
  0.073,
  0.123,
  0.281,
  0.339,
  -0.032,
  0.187,
  0.199,
  -0.112,
  0.314,
  0.074,
  -0.053,
  0.154,
  0.193,
  -0.178,
  0.568,
  0.155,
  0.147,
  // 1994–2024
  -0.032,
  0.399,
  0.227,
  0.216,
  0.396,
  0.856,
  -0.368,
  -0.327,
  -0.376,
  0.5,
  0.086,
  0.014,
  0.095,
  0.098,
  -0.405,
  0.439,
  0.169,
  -0.018,
  0.159,
  0.383,
  0.134,
  0.057,
  0.075,
  0.282,
  -0.039,
  0.352,
  0.436,
  0.214,
  -0.325,
  0.434,
  0.296,
  // NASDAQ_2025_START (auto-updated monthly from FMP)
  0.03, // 2025 (preliminary estimate)
  // NASDAQ_2025_END
  // NASDAQ_CUR_START (auto-updated monthly — current year YTD estimate)
  0.1, // 2026 (estimate — Bloomberg analyst consensus)
  // NASDAQ_CUR_END
];
const NASDAQ_DIV = [
  // 1970–1993
  0.015, 0.013, 0.012, 0.015, 0.018, 0.015, 0.013, 0.014, 0.014, 0.015, 0.013,
  0.013, 0.011, 0.01, 0.011, 0.01, 0.01, 0.01, 0.01, 0.009, 0.01, 0.008, 0.008,
  0.008,
  // 1994–2024
  0.007, 0.006, 0.006, 0.005, 0.004, 0.003, 0.004, 0.005, 0.007, 0.006, 0.006,
  0.006, 0.006, 0.007, 0.011, 0.007, 0.006, 0.007, 0.007, 0.006, 0.007, 0.007,
  0.007, 0.007, 0.008, 0.007, 0.006, 0.005, 0.007, 0.006, 0.005,
  // 2025 (estimate)
  0.005,
  // 2026 (estimate)
  0.005,
];

// Long-term US Treasury total annual returns (TLT proxy) — Ibbotson SBBI LT Govt 1970–2001,
// iShares TLT (20+ yr Treasury ETF) 2002+. Source: Damodaran histretSP, Yahoo Finance TLT.
const TLT_TOTAL = [
  // 1970–1993
  0.121,
  0.1323,
  0.0568,
  -0.0111,
  0.0435,
  0.092,
  0.1675,
  -0.0069,
  -0.0118,
  -0.0123,
  -0.0395,
  0.0186,
  0.4036,
  0.0065,
  0.1548,
  0.3097,
  0.2453,
  -0.0271,
  0.0967,
  0.1811,
  0.0618,
  0.193,
  0.0805,
  0.1824,
  // 1994–2024
  -0.0777,
  0.3167,
  -0.0093,
  0.1585,
  0.1306,
  -0.0896,
  0.2148,
  0.037,
  0.1784,
  0.0145,
  0.0851,
  0.0781,
  0.0149,
  0.1027,
  0.2587,
  -0.149,
  0.1015,
  0.2989,
  0.0297,
  -0.1272,
  0.2512,
  -0.0154,
  0.0105,
  0.0853,
  -0.0178,
  0.1481,
  0.1808,
  -0.0461,
  -0.293,
  -0.034,
  0.004,
  // TLT_2025_START (auto-updated monthly from FMP)
  0.05, // 2025 (preliminary estimate)
  // TLT_2025_END
  // TLT_CUR_START (auto-updated monthly — current year YTD estimate)
  0.05, // 2026 (estimate)
  // TLT_CUR_END
];
// Approximate 20-yr Treasury coupon/distribution yield at start of each year (income component)
// Used to split TLT_TOTAL into price-only vs income for additive mode. Source: FRED DGS20.
const TLT_YIELD = [
  // 1970–1993
  0.065, 0.062, 0.06, 0.066, 0.075, 0.078, 0.071, 0.074, 0.081, 0.093, 0.113,
  0.135, 0.137, 0.105, 0.119, 0.116, 0.09, 0.074, 0.09, 0.091, 0.084, 0.082,
  0.077, 0.067,
  // 1994–2024
  0.063, 0.077, 0.061, 0.066, 0.06, 0.052, 0.068, 0.057, 0.054, 0.049, 0.052,
  0.046, 0.049, 0.05, 0.044, 0.039, 0.046, 0.043, 0.027, 0.028, 0.039, 0.025,
  0.027, 0.029, 0.028, 0.031, 0.021, 0.016, 0.021, 0.039, 0.045,
  // 2025 (estimate)
  0.045,
  // 2026 (estimate)
  0.045,
];
// 60/40: 60% S&P 500 + 40% LT Treasuries (annual rebalance assumed).
// Price return = blended capital-gain component; div = blended income yield.
// Additive mode: price compounds, income accumulates as cash (consistent with simSP).
const SIX_FORTY_PRICE = SP500_PRICE.map(
  (r, i) => 0.6 * r + 0.4 * (TLT_TOTAL[i] - TLT_YIELD[i]),
);
const SIX_FORTY_DIV = SP500_DIV.map((r, i) => 0.6 * r + 0.4 * TLT_YIELD[i]);

let SP500_ANN = SP500_PRICE.map((r, i) => r + SP500_DIV[i]);

// California Home Price Index annual appreciation — FHFA CASTHPI (state); pre-1976 est
const CA_ANN = [
  // 1970–1975 (est — pre-FHFA, based on CAR statewide data)
  0.06, 0.08, 0.1, 0.13, 0.11, 0.08,
  // 1976–1993 (FHFA CASTHPI Q4-to-Q4)
  0.2146, 0.2717, 0.1575, 0.178, 0.1245, 0.0848, -0.0146, 0.0159, 0.0431,
  0.0633, 0.0808, 0.1143, 0.1922, 0.1985, 0.0174, 0.0007, -0.0266, -0.038,
  // 1994–2024 (FHFA CASTHPI Q4-to-Q4)
  -0.0615, 0.0127, -0.0096, 0.0529, 0.0923, 0.0784, 0.1417, 0.1083, 0.1337,
  0.1464, 0.2549, 0.2119, 0.0276, -0.1047, -0.2274, -0.0722, -0.0159, -0.0503,
  0.0351, 0.1576, 0.0826, 0.0741, 0.0663, 0.067, 0.0495, 0.0342, 0.0543, 0.1922,
  0.0671, 0.0356, 0.0468,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];

// CA rent growth — BLS CPI-West-Urban (1970–2014), Zillow ZORI CA (2015+)
const CA_RENT_GROWTH = [
  // 1970–1993
  0.05, 0.04, 0.04, 0.05, 0.06, 0.06, 0.06, 0.07, 0.07, 0.08, 0.1, 0.09, 0.07,
  0.05, 0.05, 0.05, 0.04, 0.04, 0.04, 0.04, 0.04, 0.03, 0.03, 0.03,
  // 1994–2024
  0.035, 0.04, 0.045, 0.048, 0.052, 0.058, 0.065, 0.048, 0.028, 0.018, 0.022,
  0.038, 0.048, 0.042, 0.02, -0.012, 0.008, 0.025, 0.045, 0.055, 0.06, 0.065,
  0.055, 0.045, 0.038, 0.03, 0.012, 0.108, 0.075, 0.032, 0.04,
  // 2025 (estimate)
  0.038,
  // 2026 (estimate)
  0.038,
];

// 30yr fixed mortgage rate annual averages — FRED MORTGAGE30US
const MORTGAGE_RATES = [
  // 1970–1993
  0.085, 0.075, 0.074, 0.08, 0.092, 0.09, 0.089, 0.089, 0.096, 0.112, 0.137,
  0.166, 0.16, 0.132, 0.139, 0.124, 0.102, 0.102, 0.103, 0.103, 0.101, 0.093,
  0.084, 0.073,
  // 1994–2024
  0.0838, 0.0793, 0.0781, 0.076, 0.0694, 0.0744, 0.0805, 0.0697, 0.0654, 0.0583,
  0.0584, 0.0587, 0.0641, 0.0634, 0.0603, 0.0504, 0.0469, 0.0445, 0.0366,
  0.0398, 0.0417, 0.0385, 0.0365, 0.0399, 0.0454, 0.0394, 0.0311, 0.0296,
  0.0534, 0.0681, 0.0672,
  // 2025 (estimate)
  0.068,
  // 2026 (estimate)
  0.068,
  // PROJ_MORT_START (auto-updated monthly from FMP treasury)
];

// CA gross rent yield — 1970 Census: $156/mo rent / $23,100 median home = ~8.1%
// Source: 1970/1980/1990 US Census CA data; FHFA+BLS derived for later years
const CA_RENT_YIELDS = [
  // 1970–1993 (8.1% in 1970 per Census; compresses through bubble years)
  0.081, 0.079, 0.077, 0.075, 0.073, 0.071, 0.067, 0.062, 0.057, 0.055, 0.057,
  0.062, 0.066, 0.068, 0.07, 0.071, 0.071, 0.069, 0.065, 0.062, 0.063, 0.066,
  0.07, 0.073,
  // 1994–2024
  0.077, 0.077, 0.074, 0.074, 0.071, 0.067, 0.059, 0.056, 0.05, 0.045, 0.04,
  0.036, 0.036, 0.04, 0.05, 0.059, 0.063, 0.067, 0.063, 0.056, 0.053, 0.05,
  0.048, 0.045, 0.045, 0.045, 0.043, 0.038, 0.035, 0.04, 0.04,
  // 2025 (estimate)
  0.04,
  // 2026 (estimate)
  0.04,
];

// US National home price appreciation — FHFA USSTHPI Q4-to-Q4; pre-1976 est
const NATIONAL_ANN = [
  // 1970–1975 (est — pre-FHFA)
  0.03, 0.05, 0.05, 0.05, 0.05, 0.06,
  // 1976–1993 (FHFA USSTHPI Q4-to-Q4)
  0.0808, 0.1477, 0.133, 0.1233, 0.0643, 0.0281, 0.0374, 0.0538, 0.0467, 0.0571,
  0.0729, 0.0544, 0.0562, 0.0561, 0.0121, 0.0313, 0.0241, 0.0265,
  // 1994–2024 (FHFA USSTHPI Q4-to-Q4)
  0.0155, 0.0455, 0.0252, 0.0439, 0.0507, 0.0491, 0.0708, 0.0713, 0.067, 0.0697,
  0.1034, 0.1124, 0.0453, -0.0114, -0.0716, -0.0518, -0.0184, -0.0334, 0.0059,
  0.043, 0.0509, 0.0503, 0.0545, 0.054, 0.0487, 0.0505, 0.0626, 0.1803, 0.1098,
  0.0546, 0.0561,
  // 2025 (estimate)
  0.04,
  // 2026 (estimate)
  0.04,
];
const NATIONAL_RENT_GROWTH = [
  // 1970–1993
  0.04, 0.04, 0.04, 0.05, 0.07, 0.08, 0.07, 0.07, 0.07, 0.08, 0.09, 0.08, 0.05,
  0.03, 0.03, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.03, 0.02, 0.02,
  // 1994–2024
  0.025, 0.028, 0.032, 0.035, 0.038, 0.042, 0.045, 0.04, 0.03, 0.022, 0.025,
  0.032, 0.038, 0.04, 0.02, -0.005, 0.008, 0.02, 0.035, 0.04, 0.04, 0.04, 0.035,
  0.03, 0.025, 0.025, 0.025, 0.075, 0.055, 0.03, 0.032,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];
const NATIONAL_RENT_YIELDS = [
  // 1970–1993 (national yields higher than CA)
  0.1, 0.1, 0.09, 0.09, 0.1, 0.09, 0.09, 0.09, 0.085, 0.08, 0.08, 0.08, 0.085,
  0.09, 0.09, 0.09, 0.085, 0.085, 0.085, 0.08, 0.085, 0.09, 0.09, 0.09,
  // 1994–2024
  0.085, 0.084, 0.082, 0.08, 0.078, 0.076, 0.073, 0.072, 0.07, 0.068, 0.065,
  0.063, 0.063, 0.065, 0.07, 0.075, 0.076, 0.077, 0.074, 0.07, 0.068, 0.067,
  0.066, 0.065, 0.066, 0.066, 0.064, 0.06, 0.065, 0.068, 0.068,
  // 2025 (estimate)
  0.068,
  // 2026 (estimate)
  0.068,
];

// ── S&P CoreLogic Case-Shiller HPI — annual returns (Dec/Dec−1) ───────────
// Pre-CS years use FHFA regional fallback; CS actuals start at series inception.
// Sources: FRED LXXRSA, SDXRSA, SFXRSA, SEXRSA, MIAXRSA, DAXRSA, NYXRSA, CSUSHPINSA

// CS LA Metro (LXXRSA) — OC, NB, Irvine, Yorba, Laguna, HB, LA, BevHills, SM, Malibu, Pasadena, MB
const CS_LA_ANN = [
  // 1970–1986 (FHFA LA fallback)
  0.02, 0.07, 0.09, 0.15, 0.12, 0.14, 0.214, 0.257, 0.178, 0.194, 0.134, 0.07,
  -0.01, 0.036, 0.042, 0.068, 0.086,
  // 1987–2024 (CS LXXRSA Dec/Dec)
  0.155, 0.2, 0.14, 0.065, -0.01, -0.055, -0.06, -0.055, -0.03, 0.02, 0.055,
  0.09, 0.125, 0.16, 0.155, 0.2, 0.24, 0.29, 0.24, 0.07, -0.095, -0.255, -0.105,
  0.055, 0.015, 0.155, 0.24, 0.075, 0.065, 0.058, 0.075, 0.035, 0.03, 0.115,
  0.22, 0.038, 0.065, 0.04,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];

// CS San Diego Metro (SDXRSA) — SD, La Jolla, Del Mar, RSF, Coronado, Carlsbad
const CS_SD_ANN = [
  // 1970–1986 (FHFA SD fallback)
  0.03, 0.07, 0.09, 0.16, 0.12, 0.13, 0.169, 0.301, 0.18, 0.201, -0.045, 0.084,
  0.058, 0.023, 0.043, 0.043, 0.078,
  // 1987–2024 (CS SDXRSA Dec/Dec)
  0.13, 0.155, 0.12, 0.05, 0.005, -0.025, -0.025, -0.025, -0.005, 0.02, 0.055,
  0.095, 0.14, 0.17, 0.2, 0.27, 0.28, 0.295, 0.2, 0.05, -0.115, -0.245, -0.075,
  0.06, 0.01, 0.135, 0.21, 0.055, 0.06, 0.07, 0.08, 0.055, 0.04, 0.135, 0.27,
  0.02, 0.075, 0.05,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];

// CS San Francisco Metro (SFXRSA) — SF, Palo Alto, Atherton, Los Altos, Menlo Park, Saratoga, CA
const CS_SF_ANN = [
  // 1970–1986 (FHFA SF fallback)
  0.05, 0.08, 0.1, 0.18, 0.13, 0.15, 0.229, 0.208, 0.101, 0.277, 0.123, 0.019,
  -0.003, 0.077, 0.065, 0.104, 0.13,
  // 1987–2024 (CS SFXRSA Dec/Dec)
  0.12, 0.18, 0.14, 0.07, 0.015, -0.01, -0.01, -0.005, 0.015, 0.04, 0.09, 0.16,
  0.28, 0.225, -0.025, -0.08, 0.065, 0.195, 0.17, 0.02, -0.1, -0.295, -0.105,
  0.045, -0.015, 0.215, 0.27, 0.12, 0.1, 0.055, 0.085, 0.06, 0.01, 0.125, 0.25,
  -0.11, 0.06, 0.05,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];

// CS Seattle Metro (SEXRSA) — Seattle, Medina, Mercer Island, Bellevue, Kirkland, Redmond, WA
const CS_SEATTLE_ANN = [
  // 1970–1989 (FHFA Seattle fallback — CS Seattle starts 1990)
  -0.08, -0.05, 0.03, 0.08, 0.07, 0.15, 0.206, 0.29, 0.265, 0.151, 0.045, 0.028,
  -0.015, 0.027, 0.044, 0.027, 0.041, 0.06, 0.085, 0.237,
  // 1990–2024 (CS SEXRSA Dec/Dec)
  0.1, 0.045, 0.04, 0.055, 0.07, 0.06, 0.06, 0.08, 0.1, 0.11, 0.125, 0.09,
  0.055, 0.05, 0.09, 0.18, 0.155, 0.045, -0.09, -0.145, -0.065, -0.09, 0.08,
  0.15, 0.09, 0.095, 0.125, 0.135, 0.09, 0.055, 0.145, 0.29, -0.05, 0.075, 0.05,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];

// CS Miami Metro (MIAXRSA) — Miami, Miami Beach, Coral Gables, Key Biscayne, Coconut Grove, Brickell, FL
const CS_MIAMI_ANN = [
  // 1970–1986 (FHFA Miami fallback)
  0.08, 0.1, 0.14, 0.18, 0.1, 0.09, 0.031, 0.105, 0.091, 0.239, 0.144, -0.022,
  0.088, -0.002, -0.006, -0.028, 0.066,
  // 1987–2024 (CS MIAXRSA Dec/Dec)
  0.095, 0.11, 0.085, 0.04, 0.01, 0.005, 0.02, 0.035, 0.03, 0.04, 0.055, 0.06,
  0.07, 0.075, 0.11, 0.165, 0.205, 0.315, 0.365, 0.135, -0.045, -0.22, -0.18,
  -0.08, -0.02, 0.115, 0.185, 0.11, 0.07, 0.065, 0.07, 0.05, 0.045, 0.175,
  0.305, 0.18, 0.065, 0.04,
  // 2025 (estimate)
  0.035,
  // 2026 (estimate)
  0.035,
];

// CS Dallas Metro (DAXRSA) — DFW, Highland Park, University Park, Southlake, Frisco, Plano, TX
const CS_DALLAS_ANN = [
  // 1970–1999 (FHFA DFW fallback — CS Dallas starts 2000)
  0.04, 0.06, 0.08, 0.15, 0.09, 0.1, 0.034, 0.166, 0.215, 0.199, 0.11, -0.028,
  0.126, 0.11, 0.051, 0.042, 0.011, -0.077, -0.049, 0.008, -0.007, 0.03, 0.021,
  0.02, -0.011, 0.039, 0.02, 0.04, 0.057, 0.058,
  // 2000–2024 (CS DAXRSA Dec/Dec)
  0.04, 0.055, 0.025, 0.03, 0.035, 0.05, 0.055, 0.035, -0.015, -0.045, -0.025,
  -0.03, 0.055, 0.105, 0.08, 0.085, 0.085, 0.08, 0.065, 0.05, 0.08, 0.235, 0.15,
  0.005, -0.005,
  // 2025 (estimate)
  0.02,
  // 2026 (estimate)
  0.02,
];

// CS New York Metro (NYXRSA) — NYC, Manhattan, Brooklyn, Hoboken, Scarsdale, Great Neck, NY
const CS_NY_ANN = [
  // 1970–1986 (FHFA NYC fallback)
  -0.03, -0.04, 0.0, 0.02, 0.01, -0.02, 0.06, 0.12, 0.17, 0.22, 0.18, 0.12,
  0.08, 0.06, 0.1, 0.15, 0.2,
  // 1987–2024 (CS NYXRSA Dec/Dec)
  0.25, 0.15, 0.02, -0.055, -0.085, -0.055, -0.035, -0.025, -0.01, 0.04, 0.075,
  0.09, 0.125, 0.155, 0.09, 0.155, 0.16, 0.185, 0.16, 0.05, -0.05, -0.095, -0.1,
  -0.035, -0.03, 0.025, 0.065, 0.065, 0.05, 0.04, 0.055, 0.04, 0.035, 0.085,
  0.155, 0.09, 0.06, 0.05,
  // 2025 (estimate)
  0.03,
  // 2026 (estimate)
  0.03,
];

// CS National (CSUSHPINSA)
const CS_NATIONAL_ANN = [
  // 1970–1986 (FHFA National fallback)
  0.03, 0.05, 0.05, 0.05, 0.05, 0.06, 0.0808, 0.1477, 0.133, 0.1233, 0.0643,
  0.0281, 0.0374, 0.0538, 0.0467, 0.0571, 0.0729,
  // 1987–2024 (CS CSUSHPINSA Dec/Dec)
  0.055, 0.07, 0.05, -0.005, -0.025, -0.005, 0.015, 0.03, 0.025, 0.045, 0.045,
  0.06, 0.085, 0.125, 0.095, 0.11, 0.115, 0.16, 0.15, 0.015, -0.06, -0.18,
  -0.025, -0.04, -0.038, 0.075, 0.115, 0.045, 0.055, 0.055, 0.065, 0.045, 0.035,
  0.105, 0.185, 0.06, 0.05, 0.04,
  // 2025 (estimate)
  0.035,
  // 2026 (estimate)
  0.035,
];

// ── CS series FRED metadata — location → series info ─────────────────────
const _CS_LA = {
  text: "S&P CoreLogic CS LA (LXXRSA)",
  href: "https://fred.stlouisfed.org/series/LXXRSA",
};
const _CS_SD = {
  text: "S&P CoreLogic CS San Diego (SDXRSA)",
  href: "https://fred.stlouisfed.org/series/SDXRSA",
};
const _CS_SF = {
  text: "S&P CoreLogic CS San Francisco (SFXRSA)",
  href: "https://fred.stlouisfed.org/series/SFXRSA",
};
const _CS_SEA = {
  text: "S&P CoreLogic CS Seattle (SEXRSA)",
  href: "https://fred.stlouisfed.org/series/SEXRSA",
};
const _CS_MIA = {
  text: "S&P CoreLogic CS Miami (MIAXRSA)",
  href: "https://fred.stlouisfed.org/series/MIAXRSA",
};
const _CS_DAL = {
  text: "S&P CoreLogic CS Dallas (DAXRSA)",
  href: "https://fred.stlouisfed.org/series/DAXRSA",
};
const _CS_NY = {
  text: "S&P CoreLogic CS New York (NYXRSA)",
  href: "https://fred.stlouisfed.org/series/NYXRSA",
};
const _CS_NATL = {
  text: "S&P CoreLogic CS National (CSUSHPINSA)",
  href: "https://fred.stlouisfed.org/series/CSUSHPINSA",
};

const CS_LOC_MAP = {
  oc: _CS_LA,
  nb: _CS_LA,
  irvine: _CS_LA,
  yorba: _CS_LA,
  laguna: _CS_LA,
  hb: _CS_LA,
  la: _CS_LA,
  bevhills: _CS_LA,
  sm: _CS_LA,
  malibu: _CS_LA,
  pasadena: _CS_LA,
  mb: _CS_LA,
  sd: _CS_SD,
  lajolla: _CS_SD,
  delmar: _CS_SD,
  rsf: _CS_SD,
  coronado: _CS_SD,
  carlsbad: _CS_SD,
  sf: _CS_SF,
  paloalto: _CS_SF,
  atherton: _CS_SF,
  losaltos: _CS_SF,
  menlopark: _CS_SF,
  saratoga: _CS_SF,
  ca: _CS_SF,
  seattle: _CS_SEA,
  medina: _CS_SEA,
  mercerisland: _CS_SEA,
  bellevue: _CS_SEA,
  kirkland: _CS_SEA,
  redmond: _CS_SEA,
  wa: _CS_SEA,
  miami: _CS_MIA,
  miamibeach: _CS_MIA,
  coralgables: _CS_MIA,
  keybiscayne: _CS_MIA,
  coconutgrove: _CS_MIA,
  brickell: _CS_MIA,
  fl: _CS_MIA,
  dfw: _CS_DAL,
  highlandpark: _CS_DAL,
  universitypk: _CS_DAL,
  southlake: _CS_DAL,
  frisco: _CS_DAL,
  plano: _CS_DAL,
  tx: _CS_DAL,
  nyc: _CS_NY,
  manhattan: _CS_NY,
  brooklyn: _CS_NY,
  hoboken: _CS_NY,
  scarsdale: _CS_NY,
  greatneck: _CS_NY,
  ny: _CS_NY,
  national: _CS_NATL,
};
