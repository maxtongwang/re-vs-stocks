// ── Scenario metadata ──────────────────────────────────────────────────────
const SCENARIOS = [
  { label: "S&P 500 (total)" },
  { label: "RE All Cash" },
  { label: "RE 50% Down" },
  { label: "RE 20% Down" },
  { label: "RE 10% Down" },
  { label: "RE 3.5% Down" },
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
    labelCashflow: "Cash flow:",
    labelImprov: "Improvement %:",
    labelPropMode: "Prop:",
    labelRefi: "Refi:",
    labelLTVPct: "LTV %:",
    tipBalLine:
      "Rate-and-term: keeps the same remaining balance, resets to a new 30-yr schedule at the lower rate.",
    tipLtvLine:
      "Loan-to-Value: new loan ÷ current property value. Bank won't lend above this ceiling.",
    tipImprov:
      "IRS: only the structure (not land) depreciates on a 27.5yr schedule. CA metro ~40%, TX ~60%.",
    tipCashflow:
      "Additive: dividends & rent collected as cash, not compounded.\nReinvested: income compounds back into the portfolio.",
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
    labelCostsNote: "(tax · ins · maint)",
    tipCosts:
      "Property tax (location-specific rate).\nInsurance: 0.5%/yr of current value.\nMaintenance: 1%/yr of current value.",
    legendLabels: [
      "S&P 500 (total)",
      "RE All Cash",
      "RE 50% Down",
      "RE 20% Down",
      "RE 10% Down",
      "RE 3.5% Down",
    ],
    legendLabelsPrimary: [
      "S&P 500 (total)",
      "Primary All Cash",
      "Primary 50% Down",
      "Primary 20% Down",
      "Primary 10% Down",
      "Primary 3.5% Down",
    ],
    thYear: "Year",
    assmDyn: "Assumptions (dynamic)",
    assmFix: "Assumptions (fixed)",
    assmFixNote:
      "* property tax, tax rate & improvement % update with selected location",
    labelSources: "Sources",
    buildSources: (idxLabel, locLabel, iSrc, lSrc, lnk) => [
      `${idxLabel} returns: ${lnk(iSrc.returns)} &amp; ${lnk(iSrc.live)} (current year live)`,
      `${locLabel} home prices: ${lnk(lSrc.homePrice)}`,
      `Mortgage rates: <a href="https://fred.stlouisfed.org/series/MORTGAGE30US" target="_blank">FRED MORTGAGE30US</a>`,
      `Rent growth pre-2015: ${lnk(lSrc.rentPre2015)}`,
      `Rent growth 2015+: ${lnk(lSrc.rentPost2015)}`,
      `Rent yields: estimated from ${lnk(lSrc.rentYield)}`,
      `2026 projection: S&amp;P 500 +8% &amp; NASDAQ +10% per Wall Street consensus range (<a href="https://yardeni.com/charts/wall-streets-sp-500-targets/" target="_blank">Yardeni Research</a>); home prices +1–5% by market per <a href="https://www.cotality.com/intelligence/reports/home-price-insights" target="_blank">Cotality</a> (formerly CoreLogic) &amp; <a href="https://www.fanniemae.com/data-and-insights/forecast" target="_blank">Fannie Mae</a> forecasts`,
    ],
    builtBy: "Built by Max Wang · DRE 02225524",
    disclaimer: "for entertainment purpose only",
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
    ) => {
      const W = (s) =>
        `<strong style="color:${getCSSVar("--decomp-hi")}">${s}</strong>`;
      const line2 = isPrimary
        ? `Primary: no rental income; standard deduction (no mortgage interest benefit)`
        : `Rent yield: ${W(ry + "%")} · Improvement: ${W(ip + "%")}`;
      const refiLabel =
        actual < nr ? `${actual}/${nr}x ⚠ skip: higher rates` : `${nr}x`;
      const refiStr =
        nr > 0
          ? `Refi: ${W(refiLabel + " " + (isLTV ? "(LTV)" : "(Balance)"))} · `
          : "";
      return `${sy}–${ey} · ${W(yrs + " yrs")} · Mortgage: ${W(mr + "%")}<br>${line2}${refiStr ? `<br>${refiStr.replace(/ · $/, "")}` : ""}<br>Cash flow: ${W(mode)}`;
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
        label: "Property & Tax",
        items: [
          `Property tax: ${activeLocConfig.propTaxNote}`,
          "Insurance: 0.5% of current property value/yr",
          "Maintenance: 1% of current property value/yr",
          "Depreciation (rental only): IRS 27.5-yr schedule; improvement % adjustable above. Primary residences are not eligible for depreciation deductions.",
          `Tax rate: ${activeLocConfig.taxNote} on paper rental gain/loss`,
        ],
      },
      {
        label: "Capital & Returns",
        items: [
          "Initial capital: $100K for all scenarios",
          "Wealth = Current Equity + Cumulative Net Cash Flows — equity is home value minus remaining mortgage balance; cash flows are total rent collected minus all expenses paid out of pocket",
          "Reinvested mode: positive cash flows compound at S&P 500 monthly returns; deficit periods accumulate additively (treated as out-of-pocket cost, not leveraged against the market)",
          "Note: for highly leveraged scenarios (e.g. 20% down with high mortgage rates), net cash flows are often negative throughout — Reinvested and Additive modes produce identical results since there is no positive pool to compound",
          "Additive mode: dividends & rent cash flows accumulate without compounding",
        ],
      },
      {
        label: "Refinance",
        items: [
          "Refi count (0–3): number of refinances during the holding period",
          "Purchase rate is the 30-yr fixed average for the start year, locked until a refi occurs",
          "Rate rule: selects the N cheapest years to refi from historical data in the chosen period (N = refi count, excl. purchase year); a refi fires only if the new rate is ≥1% below the current rate and at least 2 years have passed since the last refi or purchase",
          `Balance (rate-and-term): refi to same remaining balance at the new lower rate`,
          `LTV (cash-out): new loan = max(remaining balance, ${Math.round(ltvPct * 100)}% of current property value). Difference credited to investor cash position`,
          "Each refi resets to a new 30-yr amortization at the new rate; no closing costs modeled",
          'Rental + refi (tax interaction): rental mortgage interest is tax-deductible. When interest + depreciation exceed rent income, you have a "paper loss" — you owe no tax and may receive a refund, even though you are depositing rent checks. Refinancing to a lower rate reduces that interest deduction, shrinking the paper loss and its tax refund — partially offsetting the payment savings. In some cases the paper loss flips to taxable profit, adding a tax bill. Net refi benefit for rentals is always lower than the face-value payment savings suggest.',
          "Primary + refi: standard deduction assumed — no tax complication. Benefit lands in two places: (1) lower monthly PI reduces cumulative costs, improving the cash-flow component of wealth; (2) each refi resets to a new 30-yr amortization, so equity builds more slowly and the loan payoff date extends. Within a typical 30-yr window the equity loss often offsets the payment savings — full net benefit usually requires holding 10+ years past the refi date.",
        ],
      },
    ],
    methodologyNote:
      'Historical data: FHFA · S&amp;P 500 · FRED · <a href="#note-section">full methodology ↓</a>',
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
    labelCashflow: "现金流：",
    labelImprov: "建筑占比：",
    labelPropMode: "类型：",
    labelRefi: "重贷：",
    labelLTVPct: "LTV比例：",
    tipBalLine:
      "利率调整型：维持剩余贷款金额不变，以新低利率重新计算30年还款计划。",
    tipLtvLine: "贷款价值比：新贷款 ÷ 当前房产价值。银行不超此比例放贷。",
    tipImprov:
      "IRS：只有建筑物（非土地）可按27.5年折旧。加州约40%，德州约60%。",
    tipCashflow:
      "叠加：股息和房租以现金收取，不复利。\n复投：收益重新投入组合，产生复利。",
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
    labelCostsNote: "（税·保险·维护）",
    tipCosts:
      "房产税（税率因地区而异）。\n保险：房产现值0.5%/年。\n维护费：房产现值1%/年。",
    legendLabels: [
      "S&P 500 (总回报)",
      "房产 全现金",
      "房产 50%首付",
      "房产 20%首付",
      "房产 10%首付",
      "房产 3.5%首付",
    ],
    legendLabelsPrimary: [
      "S&P 500 (总回报)",
      "自住 全现金",
      "自住 50%首付",
      "自住 20%首付",
      "自住 10%首付",
      "自住 3.5%首付",
    ],
    thYear: "年份",
    assmDyn: "动态假设",
    assmFix: "固定假设",
    assmFixNote: "* 财产税、税率及折旧比例随所选地区更新",
    labelSources: "数据来源",
    buildSources: (idxLabel, locLabel, iSrc, lSrc, lnk) => [
      `${idxLabel}收益数据：${lnk(iSrc.returns)} &amp; ${lnk(iSrc.live)}（当年实时数据）`,
      `${locLabel}房价：${lnk(lSrc.homePrice)}`,
      `房贷利率：<a href="https://fred.stlouisfed.org/series/MORTGAGE30US" target="_blank">美联储 FRED MORTGAGE30US</a>`,
      `2015年前租金涨幅：${lnk(lSrc.rentPre2015)}`,
      `2015年后租金涨幅：${lnk(lSrc.rentPost2015)}`,
      `租金回报率：来源于 ${lnk(lSrc.rentYield)}`,
      `2026年预测：S&amp;P 500 +8%、纳斯达克 +10%，基于华尔街共识区间（<a href="https://yardeni.com/charts/wall-streets-sp-500-targets/" target="_blank">Yardeni Research</a>）；各市场房价 +1–5%，来自 <a href="https://www.cotality.com/intelligence/reports/home-price-insights" target="_blank">Cotality</a>（原CoreLogic）及 <a href="https://www.fanniemae.com/data-and-insights/forecast" target="_blank">Fannie Mae</a> 预测`,
    ],
    builtBy: "由 Max Wang 制作 · DRE 02225524",
    disclaimer: "仅供娱乐参考",
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
    ) => {
      const W = (s) =>
        `<strong style="color:${getCSSVar("--decomp-hi")}">${s}</strong>`;
      const line2 = isPrimary
        ? `自住：无租金收入；标准扣除额（房贷利息无节税效果）`
        : `租金回报率：${W(ry + "%")} · 建筑：${W(ip + "%")}`;
      const refiLabel =
        actual < nr ? `${actual}/${nr}次 ⚠ 跳过：利率偏高` : `${nr}次`;
      const refiStr =
        nr > 0
          ? `重贷：${W(refiLabel + (isLTV ? "（LTV）" : "（剩余贷款）"))} · `
          : "";
      return `${sy}–${ey} · ${W(yrs + "年")} · 房贷：${W(mr + "%")}<br>${line2}${refiStr ? `<br>${refiStr.replace(/ · $/, "")}` : ""}<br>现金流：${W(mode)}`;
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
        label: "房产成本与税务",
        items: [
          `房产税：${activeLocConfig.propTaxNoteZh}`,
          "保险：当前房产价值的0.5%/年",
          "维护费：当前房产价值的1%/年",
          "折旧（仅适用出租）：IRS 27.5年住宅折旧规定；建筑占比可在上方调整。自住房产不可享受折旧抵税。",
          `税率：${activeLocConfig.taxNoteZh}（适用出租纸面盈亏）`,
        ],
      },
      {
        label: "资金与收益",
        items: [
          "初始资金：各方案均为 $10万",
          "总资产 = 房产净值 + 累计净现金流（净值 = 房产市值 − 剩余贷款余额；现金流 = 历年租金总收入 − 历年总支出）",
          "复投模式：正现金流按S&P 500月回报率复利增长；亏损期间线性累加（视为自费补贴，非市场杠杆）",
          "注意：高杠杆方案（如高利率下首付20%）的净现金流往往全程为负——此时复投与叠加结果相同，因无正值现金流可复投",
          "叠加模式：股息和房租现金流线性累加，不复利",
        ],
      },
      {
        label: "重新贷款",
        items: [
          "重贷次数（0–3）：持有期间进行重新贷款的次数",
          "购房利率锁定为开始年份的30年固定利率均值，直至发生重贷",
          "利率规则：从所选区间历史数据中选出利率最低的N个年份作为重贷时机（N等于重贷次数，不含购房年）；触发条件：新利率须低于当前利率至少1%，且距购房或上次重贷满2年",
          `剩余贷款（利率调整）：以新低利率对剩余本金重新贷款，不增加贷款金额`,
          `LTV（套现）：新贷款 = max(剩余本金, 当前房产价值×${Math.round(ltvPct * 100)}%)，差额计入投资者现金持仓`,
          "每次重贷均以新贷款金额按新利率重新计算30年摊销，不计交易成本",
          "出租+重贷（税务联动）：出租房贷款利息可从租金收入中抵税。当利息+折旧超过租金收入时，产生「纸面亏损」——即使每月都在收租，报税时仍显示亏损并可获得退税。重贷降低利率后，利息减少，可抵扣金额减少，纸面亏损缩小，退税也随之减少——从而部分抵消月供节省的效果。极端情况下纸面亏损转为应税利润，还会增加税务负担。出租房重贷的实际净收益始终低于月供节省的表面数字。",
          "自住+重贷：假设标准扣除额，无税务复杂性。收益体现在两处：（1）月供（本息）降低，每月少付出，累计现金流亏损缩小，提升总资产中的现金流部分；（2）但每次重贷均重置为新的30年摊销，前期还款以利息为主，房产净值积累变慢，贷款还清日期延后。在典型30年持有周期内，净值损失往往抵消月供节省——通常需在重贷后再持有10年以上才能真正受益。",
        ],
      },
    ],
    methodologyNote:
      '数据来源：FHFA · 标普500 · FRED · <a href="#note-section">完整方法论 ↓</a>',
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
    improvPct: 0.4,
    typicalYieldRange: [0.03, 0.05],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
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
    improvPct: 0.32,
    typicalYieldRange: [0.03, 0.045],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
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
    improvPct: 0.22,
    typicalYieldRange: [0.018, 0.03],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
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
    improvPct: 0.38,
    typicalYieldRange: [0.025, 0.038],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
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
    improvPct: 0.38,
    typicalYieldRange: [0.028, 0.04],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
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
    improvPct: 0.2,
    typicalYieldRange: [0.015, 0.025],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
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
    improvPct: 0.35,
    typicalYieldRange: [0.028, 0.04],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
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
    improvPct: 0.33,
    typicalYieldRange: [0.03, 0.05],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
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
    improvPct: 0.38,
    typicalYieldRange: [0.03, 0.05],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
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
    improvPct: 0.28,
    typicalYieldRange: [0.025, 0.04],
    propTaxNote: "CA Prop 13: 1.25% of purchase price, +2%/yr max",
    propTaxNoteZh: "加州13号提案：购价1.25%，每年最多上涨2%",
    taxNote: "44% (35% fed + 9.3% CA)",
    taxNoteZh: "44%（联邦35% + 加州9.3%）",
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
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    propTaxAnnualCap: 0.1,
    taxRate: 0.35,
    improvPct: 0.55,
    typicalYieldRange: [0.045, 0.065],
    propTaxNote:
      "FL Save Our Homes: ~1.0% of assessed value; non-homestead rental capped +10%/yr",
    propTaxNoteZh: "佛州《拯救家园》：评估价值约1.0%；非自住出租上限+10%/年",
    taxNote: "35% (35% fed + 0% FL — no income tax)",
    taxNoteZh: "35%（联邦35% + 佛州0%，无州所得税）",
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
    improvPct: 0.6,
    typicalYieldRange: [0.05, 0.07],
    propTaxNote: "TX: ~2.1% of current market value, no income tax state",
    propTaxNoteZh: "德州：约当前市值2.1%，无州所得税",
    taxNote: "35% (35% fed + 0% TX — no income tax)",
    taxNoteZh: "35%（联邦35% + 德州0%，无州所得税）",
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
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    taxRate: 0.35,
    improvPct: 0.55,
    typicalYieldRange: [0.035, 0.055],
    propTaxNote: "WA: ~0.93% of current market value, no income tax state",
    propTaxNoteZh: "华州：约当前市值0.93%，无州所得税",
    taxNote: "35% (35% fed + 0% WA — no income tax)",
    taxNoteZh: "35%（联邦35% + 华州0%，无州所得税）",
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
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    propTaxAnnualCap: 0.06,
    taxRate: 0.457,
    improvPct: 0.22,
    typicalYieldRange: [0.025, 0.045],
    propTaxNote:
      "NYC Class 1-2 residential: ~1.5% of assessed value; assessed value capped +6%/yr",
    propTaxNoteZh: "纽约市第1-2类住宅：评估价值约1.5%；年增上限+6%",
    taxNote: "45.7% (35% fed + 10.9% NY)",
    taxNoteZh: "45.7%（联邦35% + 纽约州10.9%）",
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
    improvPct: 0.55,
    typicalYieldRange: [0.045, 0.065],
    propTaxNote:
      "National avg: ~1.1% of current market value (reassessed annually)",
    propTaxNoteZh: "全国均值：约当前市值1.1%（每年重新评估）",
    taxNote: "38% (35% fed + ~3% avg state)",
    taxNoteZh: "38%（联邦35% + 州均约3%）",
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
    improvPct: 0.7,
    typicalYieldRange: [0.05, 0.07],
    propTaxNote: "TX: ~2.1% of current market value, no income tax state",
    propTaxNoteZh: "德州：约当前市值2.1%，无州所得税",
    taxNote: "35% (35% fed + 0% TX — no income tax)",
    taxNoteZh: "35%（联邦35% + 德州0%，无州所得税）",
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
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    propTaxAnnualCap: 0.1,
    taxRate: 0.35,
    improvPct: 0.65,
    typicalYieldRange: [0.05, 0.07],
    propTaxNote:
      "FL Save Our Homes: ~1.0% of assessed value; non-homestead rental capped +10%/yr",
    propTaxNoteZh: "佛州《拯救家园》：评估价值约1.0%；非自住出租上限+10%/年",
    taxNote: "35% (35% fed + 0% FL — no income tax)",
    taxNoteZh: "35%（联邦35% + 佛州0%，无州所得税）",
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
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    taxRate: 0.35,
    improvPct: 0.5,
    typicalYieldRange: [0.035, 0.055],
    propTaxNote: "WA: ~0.93% of current market value, no income tax state",
    propTaxNoteZh: "华盛顿州：约当前市值0.93%，无州所得税",
    taxNote: "35% (35% fed + 0% WA — no income tax)",
    taxNoteZh: "35%（联邦35% + 华州0%，无州所得税）",
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
    propTaxTracksValue: true,
    propTaxAnnualIncrease: 0.0,
    taxRate: 0.457,
    improvPct: 0.35,
    typicalYieldRange: [0.04, 0.06],
    propTaxNote: "NY metro: ~1.5% of current market value",
    propTaxNoteZh: "纽约都市区：约当前市值1.5%",
    taxNote: "45.7% (35% fed + 10.9% NY)",
    taxNoteZh: "45.7%（联邦35% + 纽约州10.9%）",
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
};

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
          { key: "nb", label: "Newport Beach", abbr: "NB" },
          { key: "irvine", label: "Irvine", abbr: "IR" },
          { key: "yorba", label: "Yorba Linda", abbr: "YL" },
          { key: "laguna", label: "Laguna Beach", abbr: "LB" },
          { key: "hb", label: "Huntington Beach", abbr: "HB" },
        ],
      },
      { key: "la", label: "Los Angeles", abbr: "LA", cities: [] },
      { key: "sd", label: "San Diego", abbr: "SD", cities: [] },
      { key: "sf", label: "Bay Area", abbr: "SF Bay", cities: [] },
      { key: "ca", label: "Statewide", abbr: "CA", cities: [] },
    ],
  },
  {
    key: "tx",
    label: "Texas",
    abbr: "TX",
    metros: [
      { key: "dfw", label: "Dallas-Fort Worth", abbr: "DFW", cities: [] },
      { key: "tx", label: "Statewide", abbr: "TX", cities: [] },
    ],
  },
  {
    key: "fl",
    label: "Florida",
    abbr: "FL",
    metros: [
      { key: "miami", label: "Miami", abbr: "Miami", cities: [] },
      { key: "fl", label: "Statewide", abbr: "FL", cities: [] },
    ],
  },
  {
    key: "wa",
    label: "Washington",
    abbr: "WA",
    metros: [
      { key: "seattle", label: "Seattle", abbr: "Seattle", cities: [] },
      { key: "wa", label: "Statewide", abbr: "WA", cities: [] },
    ],
  },
  {
    key: "ny",
    label: "New York",
    abbr: "NY",
    metros: [
      { key: "nyc", label: "New York City", abbr: "NYC", cities: [] },
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
