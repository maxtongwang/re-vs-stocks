// ── Theme ─────────────────────────────────────────────────────────────────
function getCSSVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

const _mq = window.matchMedia("(prefers-color-scheme: dark)");

function getThemePref() {
  return localStorage.getItem("theme") || "auto";
}

function resolveTheme(pref) {
  if (pref === "auto") return _mq.matches ? "dark" : "light";
  return pref;
}

function updateThemeBtn(pref) {
  const btn = document.getElementById("theme-btn");
  if (!btn) return;
  btn.textContent = pref === "light" ? "○" : pref === "dark" ? "●" : "◑";
  btn.title =
    pref === "light"
      ? "Light theme"
      : pref === "dark"
        ? "Dark theme"
        : "Auto (follows device)";
}

function applyTheme(pref) {
  const theme = resolveTheme(pref);
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", pref);
  updateThemeBtn(pref);
  buildTable();
  syncTableCols();
  updateAssumptions();
  renderDecomp(curMonth);
  updateOutcomeCallout(curMonth);
  draw(curMonth - 1);
}

function toggleTheme() {
  const pref = getThemePref();
  applyTheme(pref === "auto" ? "light" : pref === "light" ? "dark" : "auto");
}

_mq.addEventListener("change", () => {
  if (getThemePref() === "auto") applyTheme("auto");
});

// ── Mutable state ─────────────────────────────────────────────────────────
let startYear = 1995;
let endYear = 2026;
let reinvest = false;
let reinvestIdx = "sp500"; // index used to compound RE cash flows in reinvest mode
let showIndexOverlay = false; // "common chart" overlay: S&P total return vs RE price only
let hpiSource = "cs"; // "cs" | "fhfa" — default Case-Shiller
let indexSpWealth = []; // populated by buildAllWealth
let indexReWealth = [];
let improvPct = activeLocConfig.improvPct; // keep in sync with default location
let isPrimary = false;
let inclTaxBenefits = true,
  inclDepreciation = true,
  inclCosts = true,
  inclTxCosts = false;
let inclMgmtFee = true;
let inclHoa = false,
  hoaMonthly = 300;
let inclCapGains = false,
  use1031 = true,
  primaryExclusion = "married";
let numRefis = 0;
let refiLTV = false;
let refiLTVPct = 0.75;
let incomeTier = 1; // default: $150K (index 1)
let lang = "en";
let allDecomp = [];
let allWealth = buildAllWealth(startYear);
let totalMonths = (endYear - startYear + 1) * 12;
let projStartM = (DATA_THROUGH_YEAR - startYear) * 12 + DATA_THROUGH_MONTH - 1;
let curMonth = Math.min(projStartM + 1, totalMonths);

// Initially hidden: 25% Down (idx 4), 3.5% Down (idx 5) — 40% Down (idx 3) shown by default
const hidden = new Set([4, 5]);

// ── Formatting ────────────────────────────────────────────────────────────
function fmt(v) {
  if (v === undefined || v === null) return "—";
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${Math.round(abs / 1000)}K`;
}

// ── Table ─────────────────────────────────────────────────────────────────
const tbody = document.getElementById("table-body");
function buildTable() {
  const s = STRINGS[lang];
  // Sync RE scenario column headers from RE_DOWN_PMTS
  RE_DOWN_PMTS.forEach((p, i) => {
    const th = document.getElementById(`th-s${i + 2}`);
    if (th) th.textContent = `${dpPct(p)}%Dn`;
  });
  tbody.innerHTML = "";
  const dur = endYear - startYear + 1;
  const crashYearSet = new Set(
    MARKET_EVENTS.filter((e) => e.type === "crash").map((e) => e.year),
  );
  const crashEvByYear = Object.fromEntries(
    MARKET_EVENTS.filter((e) => e.type === "crash").map((e) => [e.year, e]),
  );
  const checks = [];
  for (let y = 5; y <= dur; y += 5) checks.push(y);
  // Compute mData here so 5-yr loop can detect data-cutoff coincidence
  const mData = projStartM;
  // Last 5-yr mark that doesn't get capped (yrs*12 < totalMonths)
  let lastValidFiveYrM = 0;
  for (const yrs of checks) {
    // Skip rows where the true year-end extends past the simulation —
    // those would show a wrong future year label AND duplicate the projection row
    if (yrs * 12 >= totalMonths) continue;
    const m = yrs * 12; // not capped
    if (m > lastValidFiveYrM) lastValidFiveYrM = m;
    const yr = startYear + yrs;
    const ev = crashEvByYear[yr];
    const tr = document.createElement("tr");
    if (ev) tr.classList.add("row-crash");
    const evName = ev ? (lang === "zh" ? ev.nameZh : ev.name) : null;
    // When this 5-yr row coincides with the actual data cutoff, include the month
    const isCutoff = m === mData && !ev;
    const mo = (m % 12) + 1;
    const cutoffLabel = `Yr ${yrs} (${yr}/${mo.toString().padStart(2, "0")})`;
    tr.innerHTML =
      `<td>${ev ? s.crashRowLabel(yr, evName) : isCutoff ? cutoffLabel : s.tableRowLabel(yrs, yr)}</td>` +
      allWealth
        .map((w, i) => {
          const cls = hidden.has(i) ? ' class="col-hidden"' : "";
          return `<td${cls}>${fmt(w[m])}</td>`;
        })
        .join("");
    tbody.appendChild(tr);
  }
  if (lastValidFiveYrM < mData) {
    const yrF = startYear + Math.floor(mData / 12);
    const moF = (mData % 12) + 1;
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td>${yrF}/${moF.toString().padStart(2, "0")}</td>` +
      allWealth
        .map((w, i) => {
          const cls = hidden.has(i) ? ' class="col-hidden"' : "";
          return `<td${cls}>${fmt(w[mData])}</td>`;
        })
        .join("");
    tbody.appendChild(tr);
  }
  // Projection row: year-end estimate (dimmed italic)
  if (totalMonths - 1 > mData) {
    const mProj = totalMonths - 1;
    const yrP = startYear + Math.floor(mProj / 12);
    const moP = (mProj % 12) + 1;
    const projYrs = (mProj - mData) / 12; // fraction of year (e.g. 11/12)
    const tr = document.createElement("tr");
    tr.classList.add("row-spike");
    tr.innerHTML =
      `<td>${yrP}/${moP.toString().padStart(2, "0")} est.</td>` +
      allWealth
        .map((w, i) => {
          const cls = hidden.has(i) ? ' class="col-hidden"' : "";
          const base = w[mData];
          const proj = w[mProj];
          let pctStr = "";
          if (base > 0 && projYrs > 0) {
            const cagr = (Math.pow(proj / base, 1 / projYrs) - 1) * 100;
            const sign = cagr >= 0 ? "+" : "";
            const color =
              cagr >= 0
                ? getCSSVar("--cagr-positive")
                : getCSSVar("--cagr-negative");
            pctStr = `<br><span style="font-size:0.85em;color:${color}">${sign}${cagr.toFixed(0)}%/yr</span>`;
          }
          return `<td${cls}>${fmt(proj)}${pctStr}</td>`;
        })
        .join("");
    tbody.appendChild(tr);
  }
  // Insert crash years not already on a 5-year interval
  const crashOffsets = MARKET_EVENTS.filter((e) => e.type === "crash")
    .map((e) => ({ offset: e.year - startYear, ev: e }))
    .filter(({ offset }) => offset > 0 && offset <= dur && offset % 5 !== 0);
  for (const { offset, ev } of crashOffsets) {
    const m = Math.min(offset * 12, totalMonths - 1);
    if (m >= totalMonths) continue;
    const yr = startYear + offset;
    const evName = lang === "zh" ? ev.nameZh : ev.name;
    const tr = document.createElement("tr");
    tr.classList.add("row-crash");
    tr.innerHTML =
      `<td>${s.crashRowLabel(yr, evName)}</td>` +
      allWealth
        .map((w, i) => {
          const cls = hidden.has(i) ? ' class="col-hidden"' : "";
          return `<td${cls}>${fmt(w[m])}</td>`;
        })
        .join("");
    const rows = [...tbody.querySelectorAll("tr")];
    const insertBefore = rows.find((r) => {
      const m2 = parseInt(r.cells[0].textContent.match(/\d{4}/)?.[0] || "9999");
      return m2 > yr;
    });
    if (insertBefore) tbody.insertBefore(tr, insertBefore);
    else tbody.appendChild(tr);
  }
}

// ── Legend + table column sync ────────────────────────────────────────────
document.getElementById("legend").addEventListener("click", (e) => {
  const item = e.target.closest(".leg-item");
  if (!item) return;
  const idx = parseInt(item.dataset.idx);
  if (hidden.has(idx)) {
    hidden.delete(idx);
    item.classList.remove("hidden");
  } else {
    hidden.add(idx);
    item.classList.add("hidden");
  }
  syncTableCols();
  draw(curMonth - 1);
});

function syncTableCols() {
  const headers = document.querySelectorAll("thead th");
  headers.forEach((th, i) => {
    if (i === 0) return;
    th.classList.toggle("col-hidden", hidden.has(i - 1));
  });
  document.querySelectorAll("tbody tr").forEach((tr) => {
    [...tr.cells].forEach((td, i) => {
      if (i === 0) return;
      td.classList.toggle("col-hidden", hidden.has(i - 1));
    });
  });
}

// ── Assumptions display ───────────────────────────────────────────────────
function updateAssumptions() {
  const s = STRINGS[lang];
  const i = startYear - BASE_YEAR;
  const mr = (MORTGAGE_RATES[i] * 100).toFixed(2);
  const ry = (activeCaRentYields[i] * 100).toFixed(1);
  const yrs = endYear - startYear + 1;
  const p2r = Math.round(1 / activeCaRentYields[i]);
  const ip = Math.round(improvPct * 100);
  const modeLabel = reinvest ? s.modeLabelReinvest : s.modeLabelAdditive;

  const refis = getRefis(startYear, endYear, numRefis);
  const actualRefis = refis.length;

  document.getElementById("assumptions-line").innerHTML = s.assumptionsLine(
    startYear,
    endYear,
    yrs,
    mr,
    ry,
    ip,
    modeLabel,
    isPrimary,
    numRefis,
    refiLTV,
    actualRefis,
  );

  document.getElementById("fixed-assumptions").innerHTML = s
    .fixedGroups(refiLTVPct)
    .flatMap((g) => [
      `<li class="group-hd">${g.label}</li>`,
      ...g.items.map((item) => `<li>${item}</li>`),
    ])
    .join("");
}

// ── Apply language ────────────────────────────────────────────────────────
function buildSourcesList() {
  const s = STRINGS[lang];
  const idxKey = document.getElementById("index-select").value;
  const iSrc = INDEX_SOURCES[idxKey] || INDEX_SOURCES.sp500;
  const lSrc = activeLocConfig.sources;
  const cityWrap = document.getElementById("city-wrap");
  const metroText =
    document.getElementById("metro-select").selectedOptions[0]?.text || "";
  const stateText =
    document.getElementById("state-select").selectedOptions[0]?.text || "";
  const locLabel =
    (cityWrap?.style.display !== "none" &&
      document.getElementById("city-select").selectedOptions[0]?.text) ||
    (metroText === "Statewide" ? stateText : metroText) ||
    stateText ||
    "";
  const idxLabel =
    document.getElementById("index-select").selectedOptions[0].text;
  function lnk(arr) {
    return arr
      .map((l) => `<a href="${l.href}" target="_blank">${l.text}</a>`)
      .join(" &amp; ");
  }
  const locKey = getLocKey();
  const csSrc = CS_LOC_MAP[locKey] || CS_LOC_MAP.national;
  const items = s.buildSources(
    idxLabel,
    locLabel,
    iSrc,
    lSrc,
    lnk,
    csSrc,
    hpiSource,
  );
  document.getElementById("sources-list").innerHTML = items
    .map((i) => `<li>${i}</li>`)
    .join("");
}

function applyLang() {
  const s = STRINGS[lang];
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.getElementById("hero-title").innerHTML = s.heroTitle;
  document.getElementById("disclaimer").textContent = s.disclaimer;
  document.getElementById("label-start").textContent = s.labelStart;
  document.getElementById("label-end").textContent = s.labelEnd;
  document.querySelector("#label-cashflow .tip-text").textContent =
    s.labelCashflow;
  document.getElementById("label-propmode").textContent = s.labelPropMode;
  document.getElementById("label-tax-bracket").textContent = s.labelTaxBracket;
  document.getElementById("label-refi").textContent = s.labelRefi;
  document
    .querySelector("#btn-refi-ltv .tip-icon")
    .setAttribute("data-tip", s.tipLtvLine);
  document
    .querySelector("#btn-refi-rate .tip-icon")
    .setAttribute("data-tip", s.tipBalLine);
  document
    .querySelector("#label-cashflow .tip-icon")
    .setAttribute("data-tip", s.tipCashflow);
  document.getElementById("btn-additive").textContent = s.btnAdditive;
  document.querySelector("#btn-reinvest .tip-text").textContent = s.btnReinvest;
  document
    .querySelector("#btn-reinvest .tip-icon")
    .setAttribute("data-tip", s.tipReinvest);
  document.getElementById("btn-rental").textContent = s.btnRental;
  document.getElementById("btn-primary").textContent = s.btnPrimary;
  document.querySelector("#btn-refi-rate .tip-text").textContent =
    s.btnRefiBalance;
  document.getElementById("label-includes").textContent = s.labelIncludes;
  document.getElementById("btn-incl-taxbenefit").textContent = s.btnTaxBenefits;
  document.getElementById("btn-incl-mgmt").textContent = s.btnPmFee;
  document.getElementById("btn-incl-hoa").textContent = s.btnHoa;
  document.getElementById("btn-incl-depreciation").textContent =
    s.btnDepreciation;
  document.querySelector("#btn-incl-costs .tip-text").textContent = s.btnCosts;
  document
    .querySelector("#btn-incl-costs .tip-icon")
    .setAttribute("data-tip", s.tipCosts);
  document.querySelector("#btn-incl-tx-costs .tip-text").textContent =
    s.btnTxCosts;
  document
    .querySelector("#btn-incl-tx-costs .tip-icon")
    .setAttribute("data-tip", s.tipTxCosts);
  document.querySelector("#btn-incl-cap-gains .tip-text").textContent =
    s.btnCapGains;
  document
    .querySelector("#btn-incl-cap-gains .tip-icon")
    .setAttribute("data-tip", s.tipCapGains);
  document.querySelector("#btn-1031 .tip-text").textContent = use1031
    ? s.btn1031On
    : s.btn1031Off;
  document
    .querySelector("#btn-1031 .tip-icon")
    .setAttribute("data-tip", s.tip1031);
  document.querySelector("#btn-excl .tip-text").textContent =
    primaryExclusion === "married" ? s.btnExclMarried : s.btnExclSingle;
  document
    .querySelector("#btn-excl .tip-icon")
    .setAttribute("data-tip", s.tipExcl);
  const legLabels = isPrimary ? s.legendLabelsPrimary : s.legendLabels;
  document.querySelectorAll(".leg-text").forEach((el, i) => {
    el.innerHTML = legLabels[i];
  });
  // Override first legend label with the actual selected index name
  {
    const idxText =
      document.getElementById("index-select")?.selectedOptions[0]?.text;
    const firstLeg = document.querySelector(".leg-text");
    if (idxText && firstLeg) {
      const suffix = lang === "zh" ? "（总回报）" : " (total)";
      firstLeg.innerHTML = idxText + suffix;
    }
  }
  document.getElementById("th-year").textContent = s.thYear;
  document.getElementById("label-assm-dyn").textContent = s.assmDyn;
  document.getElementById("label-assm-fix").textContent = s.assmFix;
  document.getElementById("label-sources").textContent = s.labelSources;
  document.getElementById("label-built-by").textContent = s.builtBy;
  document.getElementById("methodology-note").innerHTML = s.methodologyNote;
  const primaryNoteEl = document.getElementById("primary-note");
  primaryNoteEl.style.display = isPrimary ? "" : "none";
  if (isPrimary) primaryNoteEl.innerHTML = s.primaryNote;
  updateAssumptions();
  buildSourcesList();
  buildTable();
  syncTableCols();
  const overlayIcon = document.querySelector("#overlay-legend-row .tip-icon");
  if (overlayIcon)
    overlayIcon.setAttribute("data-tip", STRINGS[lang].tipPriceOverlay || "");
  const overlayLegLabel = document.getElementById("overlay-legend-label");
  if (overlayLegLabel) {
    const locAbbr = SELECT_ABBR[getLocKey()] || getLocKey().toUpperCase();
    overlayLegLabel.textContent = `S\u0026P 500 vs ${locAbbr}`;
  }
  const labelHpiSrc = document.getElementById("label-hpi-source");
  if (labelHpiSrc) {
    const tt = labelHpiSrc.querySelector(".tip-text");
    if (tt) tt.textContent = s.labelHpiSourceText || "HPI";
    const ti = labelHpiSrc.querySelector(".tip-icon");
    if (ti) ti.setAttribute("data-tip", s.tipHpiSource || "");
  }
  const btnHpiFhfa = document.getElementById("btn-hpi-fhfa");
  if (btnHpiFhfa) btnHpiFhfa.textContent = s.btnFhfa || "FHFA";
  const btnHpiCs = document.getElementById("btn-hpi-cs");
  if (btnHpiCs) btnHpiCs.textContent = s.btnCs || "Case-Shiller";
  const labelPriceOnly = document.getElementById("label-price-only-comparison");
  if (labelPriceOnly)
    labelPriceOnly.textContent = s.labelPriceOnlyComparison || "Price only";
}

// ── Reinvest toggle ───────────────────────────────────────────────────────
function syncReinvestIdxWrap() {
  const wrap = document.getElementById("reinvest-idx-wrap");
  if (wrap) wrap.style.display = reinvest ? "" : "none";
}

document.getElementById("btn-reinvest").addEventListener("click", () => {
  if (reinvest) return;
  reinvest = true;
  document.getElementById("btn-reinvest").classList.add("active");
  document.getElementById("btn-additive").classList.remove("active");
  syncReinvestIdxWrap();
  allWealth = buildAllWealth(startYear);
  updateAssumptions();
  buildTable();
  syncTableCols();
  draw(curMonth - 1);
});

document.getElementById("btn-additive").addEventListener("click", () => {
  if (!reinvest) return;
  reinvest = false;
  document.getElementById("btn-additive").classList.add("active");
  document.getElementById("btn-reinvest").classList.remove("active");
  syncReinvestIdxWrap();
  allWealth = buildAllWealth(startYear);
  updateAssumptions();
  buildTable();
  syncTableCols();
  draw(curMonth - 1);
});

// ── Reinvest index selector ───────────────────────────────────────────────
["sp500", "nasdaq", "sixty40"].forEach((key) => {
  document.getElementById(`btn-ri-${key}`).addEventListener("click", () => {
    if (reinvestIdx === key) return;
    reinvestIdx = key;
    ["sp500", "nasdaq", "sixty40"].forEach((k) =>
      document
        .getElementById(`btn-ri-${k}`)
        .classList.toggle("active", k === key),
    );
    refreshDatasets(); // recomputes reinvestMonthlyAll and rebuilds
  });
});

// ── S&P 500 price vs VNQ overlay toggle ──────────────────────────────────
document.getElementById("overlay-legend-row").addEventListener("click", () => {
  showIndexOverlay = !showIndexOverlay;
  document
    .getElementById("overlay-legend-row")
    .classList.toggle("active", showIndexOverlay);
  draw(curMonth - 1);
});

// ── Property mode toggle ─────────────────────────────────────────────────
document.getElementById("btn-rental").addEventListener("click", () => {
  if (!isPrimary) return;
  isPrimary = false;
  document.getElementById("btn-rental").classList.add("active");
  document.getElementById("btn-primary").classList.remove("active");
  syncPmFeeBtn();
  allWealth = buildAllWealth(startYear);
  syncCapGainsSubBtn();
  applyLang();
  draw(curMonth - 1);
});

document.getElementById("btn-primary").addEventListener("click", () => {
  if (isPrimary) return;
  isPrimary = true;
  document.getElementById("btn-primary").classList.add("active");
  document.getElementById("btn-rental").classList.remove("active");
  syncPmFeeBtn();
  allWealth = buildAllWealth(startYear);
  syncCapGainsSubBtn();
  applyLang();
  draw(curMonth - 1);
});

// ── Includes toggles ─────────────────────────────────────────────────────
["taxbenefit", "depreciation", "costs", "tx-costs"].forEach((key) => {
  document.getElementById(`btn-incl-${key}`).addEventListener("click", () => {
    if (key === "taxbenefit") inclTaxBenefits = !inclTaxBenefits;
    else if (key === "depreciation") inclDepreciation = !inclDepreciation;
    else if (key === "costs") inclCosts = !inclCosts;
    else if (inclCapGains)
      return; // tx-costs locked while cap gains is on
    else inclTxCosts = !inclTxCosts;
    const val =
      key === "taxbenefit"
        ? inclTaxBenefits
        : key === "depreciation"
          ? inclDepreciation
          : key === "costs"
            ? inclCosts
            : inclTxCosts;
    document.getElementById(`btn-incl-${key}`).classList.toggle("active", val);
    allWealth = buildAllWealth(startYear);
    draw(curMonth - 1);
  });
});

// ── PM fee toggle ────────────────────────────────────────────────────────
function syncPmFeeBtn() {
  const btn = document.getElementById("btn-incl-mgmt");
  if (isPrimary) {
    btn.setAttribute("disabled", "");
  } else {
    btn.removeAttribute("disabled");
  }
}

document.getElementById("btn-incl-mgmt").addEventListener("click", () => {
  if (isPrimary) return;
  inclMgmtFee = !inclMgmtFee;
  document
    .getElementById("btn-incl-mgmt")
    .classList.toggle("active", inclMgmtFee);
  allWealth = buildAllWealth(startYear);
  updateAssumptions();
  buildTable();
  syncTableCols();
  draw(curMonth - 1);
});

// ── HOA toggle + amount ───────────────────────────────────────────────────
document.getElementById("btn-incl-hoa").addEventListener("click", () => {
  inclHoa = !inclHoa;
  document.getElementById("btn-incl-hoa").classList.toggle("active", inclHoa);
  document.getElementById("hoa-amount-select").style.display = inclHoa
    ? ""
    : "none";
  allWealth = buildAllWealth(startYear);
  updateAssumptions();
  buildTable();
  syncTableCols();
  draw(curMonth - 1);
});
document.getElementById("hoa-amount-select").addEventListener("change", (e) => {
  hoaMonthly = parseInt(e.target.value);
  allWealth = buildAllWealth(startYear);
  updateAssumptions();
  buildTable();
  syncTableCols();
  draw(curMonth - 1);
});

// ── Cap Gains toggles ─────────────────────────────────────────────────────
document.getElementById("btn-incl-cap-gains").addEventListener("click", () => {
  inclCapGains = !inclCapGains;
  document
    .getElementById("btn-incl-cap-gains")
    .classList.toggle("active", inclCapGains);
  // Cap gains requires a transaction, so tx costs must be on
  if (inclCapGains && !inclTxCosts) {
    inclTxCosts = true;
    document.getElementById("btn-incl-tx-costs").classList.add("active");
  }
  // Lock tx-costs button when cap gains is on
  const txBtn = document.getElementById("btn-incl-tx-costs");
  if (inclCapGains) txBtn.setAttribute("disabled", "");
  else txBtn.removeAttribute("disabled");
  syncCapGainsSubBtn();
  const assBullet = document.getElementById("assump-capgains");
  if (assBullet) assBullet.style.display = inclCapGains ? "" : "none";
  allWealth = buildAllWealth(startYear);
  draw(curMonth - 1);
});

document.getElementById("btn-1031").addEventListener("click", () => {
  use1031 = !use1031;
  const el = document.getElementById("btn-1031");
  el.querySelector(".tip-text").textContent = use1031
    ? STRINGS[lang].btn1031On
    : STRINGS[lang].btn1031Off;
  el.classList.toggle("active", use1031);
  allWealth = buildAllWealth(startYear);
  draw(curMonth - 1);
});

document.getElementById("btn-excl").addEventListener("click", () => {
  primaryExclusion = primaryExclusion === "married" ? "single" : "married";
  const el = document.getElementById("btn-excl");
  el.querySelector(".tip-text").textContent =
    primaryExclusion === "married"
      ? STRINGS[lang].btnExclMarried
      : STRINGS[lang].btnExclSingle;
  allWealth = buildAllWealth(startYear);
  draw(curMonth - 1);
});

// ── HPI source toggle ────────────────────────────────────────────────────
["fhfa", "cs"].forEach((k) => {
  const btn = document.getElementById(`btn-hpi-${k}`);
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (hpiSource === k) return;
    hpiSource = k;
    document
      .getElementById("btn-hpi-fhfa")
      .classList.toggle("active", k === "fhfa");
    document
      .getElementById("btn-hpi-cs")
      .classList.toggle("active", k === "cs");
    refreshDatasets();
  });
});

// ── Refi count toggle ────────────────────────────────────────────────────
[0, 1, 2, 3].forEach((n) => {
  document.getElementById(`btn-refi-${n}`).addEventListener("click", () => {
    if (numRefis === n) return;
    numRefis = n;
    [0, 1, 2, 3].forEach((i) =>
      document
        .getElementById(`btn-refi-${i}`)
        .classList.toggle("active", i === n),
    );
    const hasRefis = n > 0;
    document.getElementById("refi-type-group").style.display = hasRefis
      ? "flex"
      : "none";
    document.getElementById("row-ltv-pct").style.display =
      hasRefis && refiLTV ? "flex" : "none";
    allWealth = buildAllWealth(startYear);
    updateAssumptions();
    buildTable();
    syncTableCols();
    draw(curMonth - 1);
  });
});

// ── Refi type toggle (Rate-term vs LTV cash-out) ──────────────────────────
document.getElementById("btn-refi-rate").addEventListener("click", () => {
  if (!refiLTV) return;
  refiLTV = false;
  document.getElementById("row-ltv-pct").style.display = "none";
  document.getElementById("btn-refi-rate").classList.add("active");
  document.getElementById("btn-refi-ltv").classList.remove("active");
  allWealth = buildAllWealth(startYear);
  updateAssumptions();
  buildTable();
  syncTableCols();
  draw(curMonth - 1);
});
document.getElementById("btn-refi-ltv").addEventListener("click", () => {
  if (refiLTV) return;
  refiLTV = true;
  document.getElementById("row-ltv-pct").style.display = "flex";
  document.getElementById("btn-refi-ltv").classList.add("active");
  document.getElementById("btn-refi-rate").classList.remove("active");
  allWealth = buildAllWealth(startYear);
  updateAssumptions();
  buildTable();
  syncTableCols();
  draw(curMonth - 1);
});
document.getElementById("ltv-pct-slider").addEventListener("input", (e) => {
  refiLTVPct = parseInt(e.target.value) / 100;
  document.getElementById("ltv-pct-val").textContent = e.target.value + "%";
  if (refiLTV) {
    allWealth = buildAllWealth(startYear);
    updateAssumptions();
    buildTable();
    syncTableCols();
    draw(curMonth - 1);
  }
});

// ── Income tier toggle ────────────────────────────────────────────────────
[0, 1, 2, 3, 4].forEach((n) => {
  document.getElementById(`btn-tier-${n}`).addEventListener("click", () => {
    if (incomeTier === n) return;
    incomeTier = n;
    [0, 1, 2, 3, 4].forEach((i) =>
      document
        .getElementById(`btn-tier-${i}`)
        .classList.toggle("active", i === n),
    );
    allWealth = buildAllWealth(startYear);
    updateAssumptions();
    buildTable();
    syncTableCols();
    draw(curMonth - 1);
  });
});

// ── Share URL ─────────────────────────────────────────────────────────────
function getShareParams() {
  const p = new URLSearchParams();
  if (startYear !== 1995) p.set("s", startYear);
  if (endYear !== MAX_YEAR) p.set("e", endYear);
  if (reinvest) p.set("m", "r");
  if (reinvest && reinvestIdx !== "sp500") p.set("ri", reinvestIdx);
  if (showIndexOverlay) p.set("ov", "1");
  if (isPrimary) p.set("p", "1");
  if (numRefis > 0) p.set("r", numRefis);
  if (refiLTV) p.set("t", "l");
  if (refiLTV && refiLTVPct !== 0.75) p.set("v", Math.round(refiLTVPct * 100));
  if (incomeTier !== 1) p.set("br", incomeTier);
  if (lang !== "en") p.set("l", lang);
  const hArr = [...hidden].sort((a, b) => a - b);
  const isDefault = hArr.length === 2 && hArr[0] === 4 && hArr[1] === 5;
  if (!isDefault) p.set("h", hArr.join(","));
  if (!inclTaxBenefits) p.set("tb", "0");
  if (!inclDepreciation) p.set("dep", "0");
  if (!inclCosts) p.set("cos", "0");
  if (!inclTxCosts) p.set("tx", "0");
  if (!inclMgmtFee) p.set("pm", "0");
  if (inclHoa) p.set("hoa", hoaMonthly);
  if (inclCapGains) p.set("cg", "1");
  if (inclCapGains && !use1031) p.set("1031", "0");
  if (inclCapGains && primaryExclusion === "single") p.set("excl", "single");
  if (INIT !== 100000) p.set("c", INIT);
  if (hpiSource !== "cs") p.set("hpi", hpiSource);
  const idxKey = document.getElementById("index-select").value;
  if (idxKey !== "sp500") p.set("idx", idxKey);
  const stateKey = document.getElementById("state-select").value;
  if (stateKey !== "ca") p.set("st", stateKey);
  const metroKey = document.getElementById("metro-select").value;
  if (metroKey !== "oc") p.set("mt", metroKey);
  const cityWrap = document.getElementById("city-wrap");
  if (cityWrap?.style.display !== "none") {
    p.set("ct", document.getElementById("city-select").value);
  }
  return p.toString();
}

function syncUrl() {
  const qs = getShareParams();
  history.replaceState(
    null,
    "",
    qs ? location.pathname + "?" + qs : location.pathname,
  );
}

// Update URL whenever any setting button/select is interacted with
const _settingsGrid = document.getElementById("settings-grid");
if (_settingsGrid) {
  _settingsGrid.addEventListener("click", syncUrl);
  _settingsGrid.addEventListener("change", syncUrl);
}
// Hero controls: initial capital, index, state, metro, city
const _heroControls = document.querySelector(".hero-controls");
if (_heroControls) {
  _heroControls.addEventListener("change", syncUrl);
}

function loadFromHash() {
  const qs = location.search.slice(1) || location.hash.slice(1);
  if (!qs) return;
  const p = new URLSearchParams(qs);
  if (p.has("s")) {
    const v = parseInt(p.get("s"));
    if (v >= BASE_YEAR && v < MAX_YEAR) startYear = v;
  }
  if (p.has("e")) {
    const v = parseInt(p.get("e"));
    if (v > BASE_YEAR && v <= MAX_YEAR) endYear = v;
  }
  if (startYear >= endYear) endYear = Math.min(startYear + 1, MAX_YEAR);
  if (p.has("m")) reinvest = p.get("m") === "r";
  if (p.has("ri") && ["sp500", "nasdaq", "sixty40"].includes(p.get("ri")))
    reinvestIdx = p.get("ri");
  if (p.has("ov")) showIndexOverlay = p.get("ov") === "1";
  if (p.has("p")) isPrimary = p.get("p") === "1";
  if (p.has("r"))
    numRefis = Math.min(3, Math.max(0, parseInt(p.get("r")) || 0));
  if (p.has("t")) refiLTV = p.get("t") === "l";
  if (p.has("br")) {
    const v = parseInt(p.get("br"));
    if (v >= 0 && v <= 4) incomeTier = v;
  }
  if (p.has("v")) {
    const v = parseInt(p.get("v"));
    if (v >= 50 && v <= 80 && v % 5 === 0) refiLTVPct = v / 100;
  }
  if (p.has("l") && STRINGS[p.get("l")]) lang = p.get("l");

  if (p.has("h")) {
    hidden.clear();
    const hStr = p.get("h");
    if (hStr)
      hStr
        .split(",")
        .filter(Boolean)
        .forEach((n) => {
          const i = parseInt(n);
          if (i >= 0 && i < 6) hidden.add(i);
        });
  }
  if (p.has("tb")) inclTaxBenefits = p.get("tb") !== "0";
  if (p.has("dep")) inclDepreciation = p.get("dep") !== "0";
  if (p.has("cos")) inclCosts = p.get("cos") !== "0";
  if (p.has("tx")) inclTxCosts = p.get("tx") !== "0";
  if (p.has("pm")) inclMgmtFee = p.get("pm") !== "0";
  if (p.has("hoa")) {
    const v = parseInt(p.get("hoa"));
    if (v >= 100 && v <= 2000 && v % 100 === 0) {
      inclHoa = true;
      hoaMonthly = v;
    }
  }
  if (p.has("cg")) inclCapGains = p.get("cg") === "1";
  if (p.has("1031")) use1031 = p.get("1031") !== "0";
  if (p.has("excl") && p.get("excl") === "single") primaryExclusion = "single";
  if (p.has("c")) {
    const cv = parseInt(p.get("c"));
    if ([100000, 200000, 500000, 1000000, 2000000, 5000000].includes(cv))
      INIT = cv;
  }
  if (p.has("hpi") && ["cs", "fhfa"].includes(p.get("hpi")))
    hpiSource = p.get("hpi");
}

function syncOgMeta(l) {
  const s = STRINGS[l] || STRINGS.en;
  const title = s.ogTitle;
  const desc = s.ogDesc;
  document
    .querySelector('meta[property="og:title"]')
    ?.setAttribute("content", title);
  document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute("content", desc);
  document
    .querySelector('meta[name="twitter:title"]')
    ?.setAttribute("content", title);
  document
    .querySelector('meta[name="twitter:description"]')
    ?.setAttribute("content", desc);
  document.title = title;
  // Update canonical so Chrome shares the correct localized URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute(
      "href",
      l === "zh"
        ? "https://chart.maxwangestates.com/?l=zh"
        : "https://chart.maxwangestates.com/",
    );
  }
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute(
      "content",
      l === "zh"
        ? "https://chart.maxwangestates.com/?l=zh"
        : "https://chart.maxwangestates.com/",
    );
  }
}

// ── Lang select ──────────────────────────────────────────────────────────
document.getElementById("lang-select").addEventListener("change", (e) => {
  lang = e.target.value;
  // Navigate so Chrome fetches fresh HTML with correct OG tags from Worker
  const qs = getShareParams();
  location.href = qs ? location.pathname + "?" + qs : location.pathname;
});

// ── Cap Gains sub-button visibility ──────────────────────────────────────
function syncCapGainsSubBtn() {
  const sub = document.getElementById("capgains-sub");
  if (!sub) return;
  if (!inclCapGains) {
    sub.style.display = "none";
    return;
  }
  sub.style.display = "";
  const btn1031El = document.getElementById("btn-1031");
  const btnExclEl = document.getElementById("btn-excl");
  if (btn1031El) btn1031El.style.display = isPrimary ? "none" : "";
  if (btnExclEl) {
    btnExclEl.style.display = isPrimary ? "" : "none";
    btnExclEl.classList.add("active"); // always on — cycles between married/single
  }
  // Show/hide assumptions bullet
  const assBullet = document.getElementById("assump-capgains");
  if (assBullet) assBullet.style.display = "";
}

// ── Cap Gains edu tooltip builder ─────────────────────────────────────────
function buildCapGainsEdu(idx, m, DC, W, isZh, lbl) {
  const d = allDecomp[idx];
  if (!d) return "";
  const dc = d.dComp?.[m];
  if (!dc) return "";

  const FED_CG_RATE = 0.238;
  const stateRate = d.stateCapGainsRate ?? 0;
  const rate = FED_CG_RATE + stateRate;
  const totalRatePct = (rate * 100).toFixed(1);
  const stateRatePct = (stateRate * 100).toFixed(1);
  const price = d.price;
  const appr = dc.appr ?? 0;
  const salePrice = price + appr;
  const cgTax = computeCapGains(idx, m);

  if (isPrimary) {
    const exclusion = primaryExclusion === "married" ? 500_000 : 250_000;
    const gain = salePrice - price;
    const taxableGain = Math.max(0, gain - exclusion);
    return isZh
      ? `<strong style="color:${DC.cg}">${lbl.capGains}</strong><br>• 售价 ${fmt(salePrice)} − 购价 ${fmt(price)} = 收益 ${fmt(gain)}<br>&nbsp;&nbsp;· 第121条豁免（${primaryExclusion === "married" ? "已婚" : "单身"}）：${fmt(exclusion)}<br>&nbsp;&nbsp;· 应税收益 = ${fmt(taxableGain)} | 税率 ${W(totalRatePct + "%")}（联邦23.8%+州${stateRatePct}%）<br>• 资本利得税 = ${W(fmt(cgTax))}`
      : `<strong style="color:${DC.cg}">${lbl.capGains}</strong><br>• sale ${fmt(salePrice)} − basis ${fmt(price)} = gain ${fmt(gain)}<br>&nbsp;&nbsp;· §121 exclusion (${primaryExclusion}): ${fmt(exclusion)}<br>&nbsp;&nbsp;· taxable gain = ${fmt(taxableGain)} | rate ${W(totalRatePct + "%")} (fed 23.8% + state ${stateRatePct}%)<br>• capital gains tax = ${W(fmt(cgTax))}`;
  } else {
    if (use1031) {
      return isZh
        ? `<strong style="color:${DC.cg}">${lbl.capGains}（1031延税）</strong><br>• 1031交换：将收益投入同类资产，延迟缴纳资本利得税<br>&nbsp;&nbsp;· 折旧回收税（25%）及增值税均延迟<br>• 关闭<em>1031</em>查看应税金额`
        : `<strong style="color:${DC.cg}">${lbl.capGains} (1031 Deferred)</strong><br>• 1031 exchange defers all capital gains and depreciation recapture<br>&nbsp;&nbsp;· roll proceeds into like-kind property — no tax due<br>• toggle <em>1031 Off</em> to see taxable amount`;
    }
    const gain = salePrice - price;
    const totalDeprec = dc.totalDeprec ?? 0;
    const recaptureTax = Math.round(totalDeprec * 0.25);
    const ltGain = Math.max(0, gain - totalDeprec);
    const ltTax = Math.round(ltGain * rate);
    return isZh
      ? `<strong style="color:${DC.cg}">${lbl.capGains}</strong><br>• 售价 ${fmt(salePrice)} − 购价 ${fmt(price)} = 收益 ${fmt(gain)}<br>&nbsp;&nbsp;· 折旧回收税：${fmt(totalDeprec)} × 25% = ${W(fmt(recaptureTax))}<br>&nbsp;&nbsp;· 长期资本利得：${fmt(ltGain)} × ${W(totalRatePct + "%")} = ${W(fmt(ltTax))}<br>• 合计资本利得税 = ${W(fmt(cgTax))}`
      : `<strong style="color:${DC.cg}">${lbl.capGains}</strong><br>• sale ${fmt(salePrice)} − basis ${fmt(price)} = gain ${fmt(gain)}<br>&nbsp;&nbsp;· depreciation recapture: ${fmt(totalDeprec)} × 25% = ${W(fmt(recaptureTax))}<br>&nbsp;&nbsp;· LT gain: ${fmt(ltGain)} × ${W(totalRatePct + "%")} = ${W(fmt(ltTax))}<br>• total cap gains tax = ${W(fmt(cgTax))}`;
  }
}

// ── Return decomposition panel ────────────────────────────────────────────
let decompActiveRow = null;
let clickedKey = null; // pinned row — survives mouse leaving barsEl

function renderDecomp(monthsToShow) {
  clickedKey = null; // clear pin on re-render (month changed)
  const titleEl = document.getElementById("decomp-title");
  const barsEl = document.getElementById("decomp-bars");
  const eduEl = document.getElementById("decomp-edu");
  const hrEl = document.getElementById("decomp-divider");
  if (!barsEl || !allDecomp.length) return;

  const m = Math.min(monthsToShow, allWealth[0].length - 1);
  if (m < 5) {
    barsEl.innerHTML = "";
    if (titleEl) titleEl.textContent = "";
    if (hrEl) hrEl.style.display = "none";
    return;
  }
  if (hrEl) hrEl.style.display = "";

  // Read theme colors once for this render pass
  const DC = {
    sp: getCSSVar("--color-s0"),
    div: getCSSVar("--decomp-div"),
    rent: getCSSVar("--decomp-rent"),
    int: getCSSVar("--decomp-int"),
    costs: getCSSVar("--decomp-costs"),
    taxPos: getCSSVar("--decomp-tax-pos"),
    taxNeg: getCSSVar("--decomp-tax-neg"),
    tx: getCSSVar("--decomp-tx"),
    cg: getCSSVar("--decomp-cg"),
    hi: getCSSVar("--decomp-hi"),
    hiMid: getCSSVar("--text-mid"),
    hiSub: getCSSVar("--text-sub"),
  };

  const years = (m + 1) / 12;
  const yr = startYear + Math.floor(m / 12);
  const mo = (m % 12) + 1;

  // Locale labels
  const isZh = lang === "zh";
  const s = STRINGS[lang];
  const lbl = {
    title: isZh ? "收益明细" : "Return Breakdown",
    appreciation: isZh ? "资本" : "Capital",
    dividends: isZh ? "股息" : "Dividends",
    rentIncome: isZh ? "租金收入" : "Rent Income",
    interest: isZh ? "利息支出" : "Interest Paid",
    costs: s.btnCosts,
    taxShield: s.btnTaxBenefits,
    taxBill: isZh ? "税务负担" : "Tax Bill",
    txCosts: isZh ? "交易成本" : "Tx Costs",
    capGains: s.btnCapGains,
    total: isZh ? "→ 净资产" : "→ Net Worth",
  };

  // Find best visible RE scenario
  let bestIdx = -1,
    bestVal = -Infinity;
  for (let i = 1; i < allWealth.length; i++) {
    if (!hidden.has(i) && allWealth[i][m] > bestVal) {
      bestVal = allWealth[i][m];
      bestIdx = i;
    }
  }

  const spWealth = allWealth[0][m];
  const spDc = allDecomp[0]?.dComp?.[m];
  const idxLabel =
    document.getElementById("index-select")?.selectedOptions[0]?.text ||
    "S&P 500";

  if (titleEl) {
    titleEl.innerHTML = `<span style="color:${DC.hiMid}">${lbl.title}</span> · <span style="color:${DC.hiSub}">${yr}/${mo.toString().padStart(2, "0")}</span>`;
  }

  // Build row arrays for each table
  const spRows = [];
  const reRows = [];

  // Helper: highlight key assumptions/numbers in edu text
  const W = (s) => `<strong style="color:${DC.hi}">${s}</strong>`;

  // S&P rows
  const yrs = years.toFixed(1);
  if (spDc != null) {
    const spColor = DC.sp;
    spRows.push({
      key: "sp-appr",
      label: lbl.appreciation,
      val: INIT + spDc.appr,
      base: true,
      color: spColor,
      edu: () => {
        const pct = ((spDc.appr / INIT) * 100).toFixed(0);
        const spCagr = (
          (Math.pow((INIT + spDc.appr) / INIT, 1 / years) - 1) *
          100
        ).toFixed(1);
        return isZh
          ? `<strong style="color:${spColor}">${lbl.appreciation}</strong><br>• ${fmt(INIT)} → ${fmt(INIT + spDc.appr)} | +${pct}% | 年化 ${W(spCagr + "%")} | ${yrs}年（仅价格）<br>• 历史均值 ${W("~10%/年")}；单年 ${W("±30–40%")}<br>&nbsp;&nbsp;· 复利非线性：每次翻倍基数更大，增速加快`
          : `<strong style="color:${spColor}">${lbl.appreciation}</strong><br>• ${fmt(INIT)} → ${fmt(INIT + spDc.appr)} | +${pct}% | ${W(spCagr + "%/yr CAGR")} | ${yrs}yrs (price only)<br>• hist. avg ${W("~10%/yr")}; single yrs ${W("±30–40%")}<br>&nbsp;&nbsp;· compounding nonlinear: each doubling grows from a larger base`;
      },
    });
    spRows.push({
      key: "sp-div",
      label: lbl.dividends,
      val: spDc.cumDiv,
      color: DC.div,
      edu: () => {
        const avgDivYield = ((spDc.cumDiv / (INIT * years)) * 100).toFixed(1);
        return isZh
          ? reinvest
            ? `<strong style="color:${DC.div}">${lbl.dividends}</strong><br>• 再投资额外增长 ${fmt(spDc.cumDiv)} / ${yrs}年 | ~${W(avgDivYield + "%/年")} 贡献<br>&nbsp;&nbsp;· 股息买入更多份额 → 复利滚雪球，含低价加仓<br>• 总回报 ${W("~10%/年")} vs 仅价格 ${W("~7–8%/年")}：差额 = 再投资红利`
            : `<strong style="color:${DC.div}">${lbl.dividends}</strong><br>• ${fmt(spDc.cumDiv)} / ${yrs}年 | ~${W(avgDivYield + "%/年")} | 累加模式，现金收取<br>&nbsp;&nbsp;· 标普股息率 ~${W("1.3–2%/年")}；再投资模式自动买入（含低价时）<br>• 公司利润直接分配 — 切换<em>再投资</em>对比差异`
          : reinvest
            ? `<strong style="color:${DC.div}">${lbl.dividends}</strong><br>• reinvestment growth ${fmt(spDc.cumDiv)} / ${yrs}yrs | ~${W(avgDivYield + "%/yr")} contribution<br>&nbsp;&nbsp;· dividends buy more shares → compounds (incl. buying dips)<br>• total return ${W("~10%/yr")} vs price-only ${W("~7–8%/yr")}: difference = reinvested dividends`
            : `<strong style="color:${DC.div}">${lbl.dividends}</strong><br>• ${fmt(spDc.cumDiv)} / ${yrs}yrs | ~${W(avgDivYield + "%/yr")} | additive mode, cash collected<br>&nbsp;&nbsp;· S&P yield ~${W("1.3–2%/yr")}; Reinvested mode buys more shares (incl. dips)<br>• profit-sharing from index companies — toggle <em>Reinvested</em> to compare`;
      },
    });
    const spCgTax = inclCapGains ? computeCapGains(0, m) : 0;
    if (inclCapGains && spCgTax > 0) {
      spRows.push({
        key: "sp-cg",
        label: lbl.capGains,
        val: -spCgTax,
        color: DC.cg,
        edu: () => {
          const d = allDecomp[0];
          const stateRate = d?.stateCapGainsRate ?? 0;
          const spBonus = d?.capGainsRateSPBonus ?? 0;
          const totalRate = ((0.238 + stateRate + spBonus) * 100).toFixed(1);
          const gain = (allWealth[0][m] ?? 0) - INIT;
          return isZh
            ? `<strong style="color:${DC.cg}">${lbl.capGains}</strong><br>• 出售收益 = ${fmt(gain)} | 税率 ${W(totalRate + "%")}（联邦23.8%+州${((stateRate + spBonus) * 100).toFixed(1)}%）<br>&nbsp;&nbsp;· 成本基础 = 初始投资 ${fmt(INIT)}<br>• 应税金额 = ${fmt(gain)} × ${totalRate}% = ${W(fmt(spCgTax))}<br>• 关闭<em>资本利得</em>可从图表移除`
            : `<strong style="color:${DC.cg}">${lbl.capGains}</strong><br>• gain on sale = ${fmt(gain)} | rate ${W(totalRate + "%")} (fed 23.8% + state ${((stateRate + spBonus) * 100).toFixed(1)}%)<br>&nbsp;&nbsp;· cost basis = initial investment ${fmt(INIT)}<br>• tax = ${fmt(gain)} × ${totalRate}% = ${W(fmt(spCgTax))}<br>• toggle <em>Cap Gains</em> off to remove from chart`;
        },
      });
    }
    spRows.push({
      key: "sp-total",
      label: lbl.total,
      val: inclCapGains ? spWealth - spCgTax : spWealth,
      total: true,
      color: spColor,
      edu: () => {
        const spNetWealth = inclCapGains ? spWealth - spCgTax : spWealth;
        const spCagr = (
          (Math.pow(Math.max(spNetWealth, 1) / INIT, 1 / years) - 1) *
          100
        ).toFixed(1);
        const mult = (spNetWealth / INIT).toFixed(1);
        const yrsStr = years.toFixed(1);
        const modeNote =
          reinvest || spDc?.cumDiv === 0
            ? isZh
              ? "再投资模式：股息自动复投，总回报含价格+股息复利"
              : "Reinvested: dividends compounded back into shares (total return)"
            : isZh
              ? `叠加模式：价格涨幅 + 股息 ${fmt(spDc?.cumDiv || 0)} 分开追踪`
              : `Additive: price gain + ${fmt(spDc?.cumDiv || 0)} dividends tracked separately`;
        return isZh
          ? `<strong style="color:${spColor}">${lbl.total}</strong><br>• ${fmt(INIT)} → <strong style="color:${DC.hi}">${fmt(spNetWealth)}</strong> | ${mult}x | 年化 <strong style="color:${DC.hi}">${spCagr}%</strong> | ${yrsStr}年<br>&nbsp;&nbsp;· ${modeNote}<br>• 历史~10%/年（含再投资）；50年跑程后10年创造财富 > 前40年之和`
          : `<strong style="color:${spColor}">${lbl.total}</strong><br>• ${fmt(INIT)} → <strong style="color:${DC.hi}">${fmt(spNetWealth)}</strong> | ${mult}x | <strong style="color:${DC.hi}">${spCagr}%/yr</strong> | ${yrsStr}yrs<br>&nbsp;&nbsp;· ${modeNote}<br>• hist. ~10%/yr (reinvested); last 10yrs of a 50yr run > first 40yrs combined`;
      },
    });
  }

  // RE rows — one table per visible RE scenario
  const reTableSets = []; // [{rows, label, color}]
  for (let ri = 1; ri < allWealth.length; ri++) {
    if (hidden.has(ri)) continue;
    const reRows = [];
    const reDc = allDecomp[ri]?.dComp?.[m];
    const reColor = getCSSVar("--color-s" + ri);
    const reLabel = SCENARIOS[ri].label;
    if (reDc != null) {
      // Update includes button label from best visible RE (first one wins)
      if (!reTableSets.length) {
        const taxBtnEl = document.getElementById("btn-incl-taxbenefit");
        if (taxBtnEl)
          taxBtnEl.textContent =
            reDc.cumTax >= 0 ? s.btnTaxBenefits : s.btnTaxBill;
      }
      const {
        price,
        mort,
        down,
        mortRate,
        startYield,
        ratePeriods = [],
        txBuyCost = 0,
        txSellRate = 0,
      } = allDecomp[ri];
      const propValAtM = price + reDc.appr;
      const txSellCost = Math.round(propValAtM * txSellRate);
      const txBuyRate = price > 0 ? txBuyCost / price : 0;
      const leverage = down > 0 ? (1 / down).toFixed(1) : "∞";
      const appPct = price > 0 ? ((reDc.appr / price) * 100).toFixed(0) : 0;
      const yrs = years.toFixed(1);
      const propVal = price + reDc.appr;
      const downPct = dpLabel(down);

      reRows.push({
        key: `re${ri}-appr`,
        label: lbl.appreciation,
        val: INIT + reDc.appr,
        base: true,
        color: reColor,
        edu: () => {
          const rePriceCagr = (
            (Math.pow(propVal / price, 1 / years) - 1) *
            100
          ).toFixed(1);
          const reOnCapCagr = (
            (Math.pow((INIT + reDc.appr) / INIT, 1 / years) - 1) *
            100
          ).toFixed(1);
          const barVal = fmt(INIT + reDc.appr);
          return isZh
            ? `<strong style="color:${reColor}">${lbl.appreciation}</strong><br>• 首付 ${fmt(INIT)} + 升值 ${fmt(reDc.appr)} = <strong style="color:${DC.hi}">${barVal}</strong> | 房价 ${fmt(price)} → ${fmt(propVal)} (+${appPct}%)<br>&nbsp;&nbsp;· ${downPct}%首付（${fmt(INIT)}）= 年化 <strong style="color:${DC.hi}">${reOnCapCagr}%</strong>（${leverage}x 杠杆，${rePriceCagr}%/年房价）<br>• 杠杆双向：房价 −10% → 本金 <strong style="color:${DC.int}">−${(10 / down).toFixed(0)}%</strong>`
            : `<strong style="color:${reColor}">${lbl.appreciation}</strong><br>• down ${fmt(INIT)} + gain ${fmt(reDc.appr)} = <strong style="color:${DC.hi}">${barVal}</strong> | property ${fmt(price)} → ${fmt(propVal)} (+${appPct}%)<br>&nbsp;&nbsp;· ${downPct}% down (${fmt(INIT)}) = <strong style="color:${DC.hi}">${reOnCapCagr}%/yr on capital</strong> (${leverage}x leverage, ${rePriceCagr}%/yr on property)<br>• leverage cuts both ways: −10% property → <strong style="color:${DC.int}">−${(10 / down).toFixed(0)}%</strong> on your capital`;
        },
      });
      if (!isPrimary && reDc.cumRent > 0) {
        reRows.push({
          key: `re${ri}-rent`,
          label: lbl.rentIncome,
          val: reDc.cumRent,
          color: DC.rent,
          edu: () => {
            const grossMonthlyRent = Math.round((price * startYield) / 12);
            const avgMonthlyRent = Math.round(reDc.cumRent / (m + 1));
            const rentToIntPct =
              reDc.cumInt > 0
                ? ((reDc.cumRent / reDc.cumInt) * 100).toFixed(0)
                : "∞";
            const rentToCostsPct =
              reDc.cumCosts > 0
                ? ((reDc.cumRent / reDc.cumCosts) * 100).toFixed(0)
                : "∞";
            const yieldPct = (startYield * 100).toFixed(1);
            const [yLo, yHi] = activeLocConfig.typicalYieldRange || [
              0.035, 0.055,
            ];
            const fmtYield = (v) => String(Number((v * 100).toFixed(1)));
            const yieldCtx =
              startYield < yLo
                ? isZh
                  ? `低回报率——${startYear}年房价已超租金涨幅`
                  : `low — prices outpaced rents entering ${startYear}`
                : startYield > yHi
                  ? isZh
                    ? `高回报率——${startYear}年租金相对房价较高`
                    : `high — rents strong relative to prices in ${startYear}`
                  : isZh
                    ? `典型市场回报率区间（${fmtYield(yLo)}–${fmtYield(yHi)}%）`
                    : `within typical market range (${fmtYield(yLo)}–${fmtYield(yHi)}%)`;
            const vacRate = activeLocConfig.vacancyRate ?? 0.05;
            const vacPct = Math.round(vacRate * 100);
            const collectedPct = 100 - vacPct;
            const collectedMonthlyRent = Math.round(
              grossMonthlyRent * (1 - vacRate),
            );
            const mgmtRate = activeLocConfig.mgmtFeeRate ?? 0.09;
            const mgmtPct = Math.round(mgmtRate * 100);
            const mgmtMonthlyFee = Math.round(collectedMonthlyRent * mgmtRate);
            const mgmtLine = inclMgmtFee
              ? isZh
                ? `<br>• 物管费 ${W(mgmtPct + "%")} × 实收 = ${W("−" + fmt(mgmtMonthlyFee) + "/月")}（IRS Schedule E 可抵税）`
                : `<br>• mgmt fee ${W(mgmtPct + "%")} × collected = ${W("−" + fmt(mgmtMonthlyFee) + "/mo")} (IRS Schedule E deductible)`
              : "";
            return isZh
              ? `<strong style="color:${DC.rent}">${lbl.rentIncome}</strong><br>• ${fmt(reDc.cumRent)} / ${yrs}年 | 均值 ${W(fmt(avgMonthlyRent) + "/月")}（实收）<br>&nbsp;&nbsp;· 租金 ÷ 利息 = ${W(rentToIntPct + "%")} | 租金 ÷ 成本 = ${W(rentToCostsPct + "%")}<br>• 起始毛租金 ${W(fmt(grossMonthlyRent) + "/月")} · ${W(yieldPct + "%回报率")} = ${yieldCtx}<br>&nbsp;&nbsp;· 房价涨幅 > 租金 → 回报率随时间压缩<br>• 空置率 ${W(vacPct + "%")}（人口普查ACS）：实收 = 毛租金 × ${W(collectedPct + "%")} = ${W(fmt(collectedMonthlyRent) + "/月")}${mgmtLine}<br>• 租金管控未建模——若受租金管制，实际租金涨幅可能低于市场水平`
              : `<strong style="color:${DC.rent}">${lbl.rentIncome}</strong><br>• ${fmt(reDc.cumRent)} / ${yrs}yrs | avg ${W(fmt(avgMonthlyRent) + "/mo")} collected<br>&nbsp;&nbsp;· rent ÷ interest = ${W(rentToIntPct + "%")} | rent ÷ costs = ${W(rentToCostsPct + "%")}<br>• gross ${W(fmt(grossMonthlyRent) + "/mo")} at start · ${W(yieldPct + "% yield")} = ${yieldCtx}<br>&nbsp;&nbsp;· price growth > rent → yield compresses over time<br>• vacancy ${W(vacPct + "%")} (Census ACS): collected = gross × ${W(collectedPct + "%")} = ${W(fmt(collectedMonthlyRent) + "/mo")}${mgmtLine}<br>• Rent control not modeled — if rent-stabilized, actual growth may be lower than market`;
          },
        });
      }
      if (reDc.cumInt > 0) {
        reRows.push({
          key: `re${ri}-int`,
          label: lbl.interest,
          val: -reDc.cumInt,
          color: DC.int,
          edu: () => {
            const intAsPctPrice =
              price > 0 ? ((reDc.cumInt / price) * 100).toFixed(0) : 0;
            if (ratePeriods.length > 1) {
              // Multi-rate (refi) — show per-period breakdown
              const filteredPeriods = ratePeriods.filter(
                (p) => p.toM > p.fromM,
              );
              const periodLines = filteredPeriods.map((p, i) => {
                const pFromYr = startYear + Math.floor(p.fromM / 12);
                const isLastPeriod = i === filteredPeriods.length - 1;
                const cashOutNote =
                  p.cashOut > 0
                    ? isZh
                      ? `，套现 ${W(fmt(p.cashOut))}（再投资）`
                      : `, ${W("+" + fmt(p.cashOut) + " cash-out")} reinvested`
                    : "";
                const tag =
                  i === 0
                    ? isZh
                      ? "原始"
                      : "original"
                    : p.cashOut > 0
                      ? isZh
                        ? "套现再融资"
                        : "cash-out refi"
                      : isZh
                        ? "再融资"
                        : "refi";
                if (isLastPeriod) {
                  // Last period: 30yr term, payoff may be in the future
                  const payoffYr = pFromYr + 30;
                  const fullTermInt = Math.round(p.pmt * 360 - p.loan);
                  const simEnd = allWealth[ri].length - 1;
                  const isBeyondSim = p.fromM + 360 > simEnd;
                  let displayWealth, wealthLabel, wealthLabelZh;
                  if (isBeyondSim) {
                    // Project forward: use historical property CAGR to extrapolate
                    const endDc = allDecomp[ri].dComp[simEnd];
                    const propValEnd = price + endDc.appr;
                    const simYears = (simEnd + 1) / 12;
                    const propCagr =
                      price > 0
                        ? Math.pow(propValEnd / price, 1 / simYears) - 1
                        : 0;
                    const yearsRem = payoffYr - endYear;
                    // Remaining loan at sim end via amortization formula
                    const n = simEnd - p.fromM;
                    const r = p.rate / 12;
                    const remAtEnd =
                      r > 0 && n < 360
                        ? Math.max(
                            0,
                            Math.round(
                              (p.loan *
                                (Math.pow(1 + r, 360) - Math.pow(1 + r, n))) /
                                (Math.pow(1 + r, 360) - 1),
                            ),
                          )
                        : 0;
                    const cfAtEnd =
                      allWealth[ri][simEnd] - (propValEnd - remAtEnd);
                    const propAtPayoff = Math.round(
                      propValEnd * Math.pow(1 + propCagr, yearsRem),
                    );
                    displayWealth = Math.max(propAtPayoff + cfAtEnd, 0);
                    const cagrPct = (propCagr * 100).toFixed(1);
                    wealthLabel = `projected wealth at payoff (${endYear} base + ${yearsRem}yr @${cagrPct}%/yr)`;
                    wealthLabelZh = `预测还清时财富（${endYear}年基础+${yearsRem}年@${cagrPct}%/年）`;
                    const simDurYrs = Math.round(n / 12);
                    const partialInt = Math.round(
                      p.pmt * n - (p.loan - remAtEnd),
                    );
                    return isZh
                      ? `&nbsp;&nbsp;&nbsp;&nbsp;· ${W((p.rate * 100).toFixed(2) + "%")}（${tag}）：${pFromYr}–${endYear}（模拟${simDurYrs}年，还清年${payoffYr}）<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· 贷款 ${fmt(p.loan)} | 月供 ${fmt(p.pmt)}${cashOutNote}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· 模拟内利息（${simDurYrs}年）：${W(fmt(partialInt))} | 全期利息：${W(fmt(fullTermInt))}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· ${wealthLabelZh}：${W(fmt(displayWealth))}`
                      : `&nbsp;&nbsp;&nbsp;&nbsp;· ${W((p.rate * 100).toFixed(2) + "%")} (${tag}): ${pFromYr}–${endYear} (${simDurYrs}yrs in sim, payoff ${payoffYr})<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· loan ${fmt(p.loan)} | ${fmt(p.pmt)}/mo${cashOutNote}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· sim interest (${simDurYrs}yrs): ${W(fmt(partialInt))} | full-term: ${W(fmt(fullTermInt))}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· ${wealthLabel}: ${W(fmt(displayWealth))}`;
                  } else {
                    const payoffM = p.fromM + 360;
                    displayWealth = allWealth[ri][payoffM];
                    wealthLabel = "simulated wealth at payoff";
                    wealthLabelZh = "还清时模拟总财富";
                  }
                  return isZh
                    ? `&nbsp;&nbsp;&nbsp;&nbsp;· ${W((p.rate * 100).toFixed(2) + "%")}（${tag}）：${pFromYr}–${payoffYr}（30年）<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· 贷款 ${fmt(p.loan)} | 月供 ${fmt(p.pmt)}${cashOutNote}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· 全期利息：${W(fmt(fullTermInt))}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· ${wealthLabelZh}：${W(fmt(displayWealth))}`
                    : `&nbsp;&nbsp;&nbsp;&nbsp;· ${W((p.rate * 100).toFixed(2) + "%")} (${tag}): ${pFromYr}–${payoffYr} (30yr)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· loan ${fmt(p.loan)} | ${fmt(p.pmt)}/mo${cashOutNote}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· full-term interest: ${W(fmt(fullTermInt))}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· ${wealthLabel}: ${W(fmt(displayWealth))}`;
                }
                // Intermediate period: elapsed time between two refis
                const pToYr = startYear + Math.floor(p.toM / 12);
                const pDurYrs = Math.round((p.toM - p.fromM) / 12);
                return isZh
                  ? `&nbsp;&nbsp;&nbsp;&nbsp;· ${W((p.rate * 100).toFixed(2) + "%")}（${tag}）：${pFromYr}–${pToYr}（${pDurYrs}年）<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· 贷款 ${fmt(p.loan)} | 月供 ${fmt(p.pmt)}${cashOutNote}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· 利息 ${fmt(p.periodInt)}`
                  : `&nbsp;&nbsp;&nbsp;&nbsp;· ${W((p.rate * 100).toFixed(2) + "%")} (${tag}): ${pFromYr}–${pToYr} (${pDurYrs}yrs)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· loan ${fmt(p.loan)} | ${fmt(p.pmt)}/mo${cashOutNote}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· ${fmt(p.periodInt)} interest`;
              });
              const hasCashOut = ratePeriods.some((p) => p.cashOut > 0);
              return isZh
                ? `<strong style="color:${DC.int}">${lbl.interest}</strong><br>• 共 ${fmt(reDc.cumInt)} | 购价 <strong style="color:${DC.hi}">${intAsPctPrice}%</strong> | ${yrs}年<br>• 利率分段：<br>${periodLines.join("<br>")}<br>• 每次再融资：余额 × 新利率 → 摊销重置${hasCashOut ? "<br>&nbsp;&nbsp;· 套现：权益 → 现金 + 贷款增加 + 未来利息增加" : ""}${!isPrimary ? `<br>&nbsp;&nbsp;· 租赁：利息全额可抵税 → 见${reDc.cumTax >= 0 ? lbl.taxShield : lbl.taxBill}行` : ""}`
                : `<strong style="color:${DC.int}">${lbl.interest}</strong><br>• ${fmt(reDc.cumInt)} total | <strong style="color:${DC.hi}">${intAsPctPrice}%</strong> of purchase price | ${yrs}yrs<br>• Rate history by period:<br>${periodLines.join("<br>")}<br>• each refi: new balance × new rate → amortization resets${hasCashOut ? "<br>&nbsp;&nbsp;· cash-out: equity → cash + higher loan + more future interest" : ""}${!isPrimary ? `<br>&nbsp;&nbsp;· rental: all interest ${W("tax-deductible")} → see ${reDc.cumTax >= 0 ? lbl.taxShield : lbl.taxBill}` : ""}`;
            }
            // Single rate (no refis)
            const mortPmt =
              mort > 0
                ? Math.round(
                    (((mort * mortRate) / 12) *
                      Math.pow(1 + mortRate / 12, 360)) /
                      (Math.pow(1 + mortRate / 12, 360) - 1),
                  )
                : 0;
            const initMonthlyInt = Math.round((mort * mortRate) / 12);
            return isZh
              ? `<strong style="color:${DC.int}">${lbl.interest}</strong><br>• ${fmt(reDc.cumInt)} | ${W((mortRate * 100).toFixed(2) + "%")}（30年固定）| ${yrs}年<br>&nbsp;&nbsp;· 月供 ${fmt(mortPmt)} | 首月利息 ${fmt(initMonthlyInt)} | 累计 = 购价 <strong style="color:${DC.hi}">${intAsPctPrice}%</strong><br>• 等额还款前期利息为主，本金后期加速<br>&nbsp;&nbsp;· ${leverage}x 杠杆成本：全款需 ${fmt(price)} vs 首付 ${fmt(INIT)}${!isPrimary ? `<br>&nbsp;&nbsp;· 租赁：利息可抵税 → 见${reDc.cumTax >= 0 ? lbl.taxShield : lbl.taxBill}行` : ""}`
              : `<strong style="color:${DC.int}">${lbl.interest}</strong><br>• ${fmt(reDc.cumInt)} | ${W((mortRate * 100).toFixed(2) + "%")} (${W("30yr fixed")}) | ${yrs}yrs<br>&nbsp;&nbsp;· ${fmt(mortPmt)}/mo | month-1 interest = ${fmt(initMonthlyInt)} | total = <strong style="color:${DC.hi}">${intAsPctPrice}%</strong> of purchase price<br>• amortization front-loads interest; principal accelerates near payoff<br>&nbsp;&nbsp;· ${leverage}x leverage cost: ${fmt(price)} cash needed vs ${fmt(INIT)} down${!isPrimary ? `<br>&nbsp;&nbsp;· rental: interest ${W("tax-deductible")} → see ${reDc.cumTax >= 0 ? lbl.taxShield : lbl.taxBill}` : ""}`;
          },
        });
      }
      if (reDc.cumCosts > 0) {
        reRows.push({
          key: `re${ri}-costs`,
          label: lbl.costs,
          val: -reDc.cumCosts,
          color: DC.costs,
          edu: () => {
            const propTaxPct = (activeLocConfig.propTaxRate * 100).toFixed(2);
            const totalCostPct = (
              (activeLocConfig.propTaxRate + 0.015) *
              100
            ).toFixed(2);
            const initAnnualCosts = Math.round(
              price * (activeLocConfig.propTaxRate + 0.015),
            );
            const costsAsRentPct =
              reDc.cumRent > 0
                ? ((reDc.cumCosts / reDc.cumRent) * 100).toFixed(0)
                : "—";
            return isZh
              ? `<strong style="color:${DC.costs}">${lbl.costs}</strong><br>• ${fmt(reDc.cumCosts)} / ${yrs}年 | 起始 ${W(fmt(Math.round(initAnnualCosts / 12)) + "/月")}（${W(fmt(initAnnualCosts) + "/年")}，第1年）<br>• ${W(propTaxPct + "% 房产税")}（${activeLocConfig.propTaxNoteZh ?? activeLocConfig.propTaxNote ?? "按地区"}）+ ${W("0.5%保险")} + ${W("1%维护")} = ${W(totalCostPct + "%/年（第1年）")}，+4%/年建筑成本通胀${!isPrimary ? `<br>&nbsp;&nbsp;· = 租金收入 ${W(costsAsRentPct + "%")}（第1年）` : ""}<br>• 切换<em>运营成本</em>可量化拖累`
              : `<strong style="color:${DC.costs}">${lbl.costs}</strong><br>• ${fmt(reDc.cumCosts)} / ${yrs}yrs | start ${W(fmt(Math.round(initAnnualCosts / 12)) + "/mo")} (${W(fmt(initAnnualCosts) + "/yr")}, yr 1)<br>• ${W(propTaxPct + "% prop tax")} (${activeLocConfig.propTaxNote ?? "varies by state"}) + ${W("0.5% ins")} + ${W("1% maint")} = ${W(totalCostPct + "%/yr (yr 1)")}, +4%/yr construction cost inflation${!isPrimary ? `<br>&nbsp;&nbsp;· = ${W(costsAsRentPct + "%")} of gross rent (yr 1)` : ""}<br>• toggle <em>Op. Costs</em> to isolate drag`;
          },
        });
      }
      if (inclTaxBenefits && reDc.cumTax !== 0) {
        const taxColor = reDc.cumTax >= 0 ? DC.taxPos : DC.taxNeg;
        reRows.push({
          key: `re${ri}-tax`,
          label: reDc.cumTax >= 0 ? lbl.taxShield : lbl.taxBill,
          val: reDc.cumTax,
          color: taxColor,
          edu: () => {
            const taxRatePct = Math.round(
              getMarginalRate(activeLocConfig, incomeTier) * 100,
            );
            const annualDep = Math.round((price * improvPct) / 27.5);
            const depClaimed = Math.round(annualDep * Math.min(yrs, 27.5));
            const depRecapture = Math.round(depClaimed * 0.25);
            const initRent = (price * startYield) / 12;
            const initInt = (mort * mortRate) / 12;
            const initPropTax = (price * activeLocConfig.propTaxRate) / 12;
            const initIns = (price * 0.005) / 12;
            const initMaint = (price * 0.01) / 12;
            const monthlyDep = (price * improvPct) / 27.5 / 12;
            const initTaxInc =
              initRent -
              initInt -
              initPropTax -
              initIns -
              initMaint -
              (inclDepreciation ? monthlyDep : 0);
            const initMonthlyTaxBen = Math.round(
              -initTaxInc * getMarginalRate(activeLocConfig, incomeTier),
            );
            if (reDc.cumTax >= 0) {
              return isZh
                ? `<strong style="color:${taxColor}">${lbl.taxShield}</strong><br>• 节税 ${fmt(reDc.cumTax)} | 利息${inclDepreciation ? "+折旧" : ""}抵扣 | ${W(taxRatePct + "%边际税率")} | ${yrs}年<br>• 首月：租金−利息−成本${inclDepreciation ? "−折旧" : ""} = 应税收入 → ~${W(fmt(initMonthlyTaxBen) + "/月")}税收收益${inclDepreciation ? `<br>• 折旧：${fmt(price)} × ${W(Math.round(improvPct * 100) + "%")} ÷ ${W("27.5年")} = ${W(fmt(annualDep) + "/年")}账面亏损（不花钱）<br>&nbsp;&nbsp;· 累计抵扣 ${W(fmt(depClaimed))} → 出售追缴 ${W(fmt(depRecapture))}（25%）${isPrimary ? "" : "（1031置换除外）"}` : `<br>• 开启<em>折旧</em>：${fmt(price)} × X% ÷ 27.5年 = 账面亏损，进一步减税`}`
                : `<strong style="color:${taxColor}">${lbl.taxShield}</strong><br>• saved ${fmt(reDc.cumTax)} | interest${inclDepreciation ? " + depreciation" : ""} deduction | ${W(taxRatePct + "% marginal rate")} | ${yrs}yrs<br>• mo-1: rent − interest − costs${inclDepreciation ? " − dep" : ""} = taxable → ~${W(fmt(initMonthlyTaxBen) + "/mo")} benefit${inclDepreciation ? `<br>• depreciation: ${fmt(price)} × ${W(Math.round(improvPct * 100) + "%")} ÷ ${W("27.5yr")} = ${W(fmt(annualDep) + "/yr")} write-off (non-cash)<br>&nbsp;&nbsp;· ${W(fmt(depClaimed))} claimed → ${W(fmt(depRecapture))} recapture at sale${isPrimary ? "" : " — unless 1031 exchange"}` : `<br>• enable <em>Depreciation</em>: non-cash write-off reduces taxable income further`}`;
            } else {
              return isZh
                ? `<strong style="color:${taxColor}">税务负担</strong><br>• 应缴 ${fmt(-reDc.cumTax)} | 租金 > 利息+成本${inclDepreciation ? "+折旧" : ""} → 净应税收入<br>&nbsp;&nbsp;· ${W(taxRatePct + "%边际税率")} → 每$1利润 = ${W(taxRatePct + "¢")}税<br>• 切换<em>税务优惠</em>可移除；或开启<em>折旧</em>加回亏损抵税`
                : `<strong style="color:${taxColor}">Tax Bill</strong><br>• owed ${fmt(-reDc.cumTax)} | rent > interest + costs${inclDepreciation ? " + depreciation" : ""} → net taxable income<br>&nbsp;&nbsp;· ${W(taxRatePct + "% marginal rate")} → every $1 profit = ${W(taxRatePct + "¢")} tax<br>• toggle <em>Tax Benefits</em> to remove; or <em>Depreciation</em> to add write-off back`;
            }
          },
        });
      }
      if (inclTxCosts && (txBuyCost > 0 || txSellCost > 0)) {
        reRows.push({
          key: `re${ri}-tx`,
          label: lbl.txCosts,
          val: -(txBuyCost + txSellCost),
          color: DC.tx,
          edu: () => {
            const txBuyPct = (txBuyRate * 100).toFixed(1);
            const txSellPct = (txSellRate * 100).toFixed(1);
            const txTotal = txBuyCost + txSellCost;
            let buyNote, sellNote;
            if (txBuyRate >= 0.018) {
              buyNote = isZh
                ? "产权、托管、评估 + 抵押录入税（~1.0–1.8%）"
                : "title, escrow, appraisal + mortgage recording tax (~1.0–1.8%)";
            } else if (txBuyRate >= 0.012) {
              buyNote = isZh
                ? "产权、托管、评估 + 佛州印花税（0.35%×2）"
                : "title, escrow, appraisal + FL doc stamps (0.35%×2)";
            } else {
              buyNote = isZh
                ? "产权（~0.5%）、托管（~0.3%）、验房（~0.3%）、评估（~0.1%）"
                : "title (~0.5%), escrow (~0.3%), inspection (~0.3%), appraisal (~0.1%)";
            }
            if (txSellRate >= 0.088) {
              const reetPct = ((txSellRate - 0.065) * 100).toFixed(2);
              sellNote = isZh
                ? `佣金（~5%）、产权+托管（~0.5%）、华州REET（~${reetPct}%）`
                : `commission (~5%), title/escrow (~0.5%), WA REET (~${reetPct}%)`;
            } else if (txSellRate >= 0.077) {
              sellNote = isZh
                ? "佣金（~5%）、产权+托管（~0.5%）、RPTT 1.425% + 纽约州转让税0.4%"
                : "commission (~5%), title/escrow (~0.5%), RPTT 1.425% + NYS transfer 0.4%";
            } else if (txSellRate >= 0.071) {
              sellNote = isZh
                ? "佣金（~5%）、产权+托管（~0.5%）、华州REET（~1.28%）"
                : "commission (~5%), title/escrow (~0.5%), WA REET (~1.28%)";
            } else if (txSellRate >= 0.068) {
              sellNote = isZh
                ? "佣金（~5%）、产权+托管（~0.5%）、佛州印花税（0.7%）、保修"
                : "commission (~5%), title/escrow (~0.5%), FL doc stamps (0.7%), warranty";
            } else if (txSellRate >= 0.063) {
              sellNote = isZh
                ? "佣金（~5%）、产权+托管（~0.5%）、州转让税（~0.4%）"
                : "commission (~5%), title/escrow (~0.5%), state transfer tax (~0.4%)";
            } else {
              sellNote = isZh
                ? "佣金（~5%）、产权+托管（~0.5%）、保修"
                : "commission (~5%), title/escrow (~0.5%), warranty";
            }
            return isZh
              ? `<strong style="color:${DC.tx}">交易成本（一次性）</strong><br>• 买入：${W(txBuyPct + "%")} × ${fmt(price)} = ${W(fmt(txBuyCost))}（${buyNote}）<br>&nbsp;&nbsp;· 已从首日财富中扣除（永久拖累）<br>• 卖出（假设今天出售）：${W(txSellPct + "%")} × ${fmt(propValAtM)} = ${W(fmt(txSellCost))}（${sellNote}）<br>&nbsp;&nbsp;· 买入 + 卖出合计 ${W(fmt(txTotal))}<br>• 关闭<em>交易成本</em>可从图表移除`
              : `<strong style="color:${DC.tx}">Transaction Costs (one-time)</strong><br>• buy: ${W(txBuyPct + "%")} × ${fmt(price)} = ${W(fmt(txBuyCost))} (${buyNote})<br>&nbsp;&nbsp;· baked into wealth from day 1 (permanent drag)<br>• sell (if sold today): ${W(txSellPct + "%")} × ${fmt(propValAtM)} = ${W(fmt(txSellCost))} (${sellNote})<br>&nbsp;&nbsp;· buy + sell combined: ${W(fmt(txTotal))}<br>• toggle <em>Tx Costs</em> off to remove from chart`;
          },
        });
      }
      const reCgTax = inclCapGains ? computeCapGains(ri, m) : 0;
      if (inclCapGains && (reCgTax > 0 || isPrimary)) {
        reRows.push({
          key: `re${ri}-cg`,
          label: lbl.capGains,
          val: -reCgTax,
          color: DC.cg,
          edu: () => buildCapGainsEdu(ri, m, DC, W, isZh, lbl),
        });
      }
      const reWealth = allWealth[ri][m];
      const displayTotal = inclTxCosts
        ? reWealth - txSellCost - reCgTax
        : reWealth - reCgTax;
      reRows.push({
        key: `re${ri}-total`,
        label: lbl.total,
        val: displayTotal,
        total: true,
        color: reColor,
        edu: () => {
          const reCagr = (
            (Math.pow(Math.max(displayTotal, 1) / INIT, 1 / years) - 1) *
            100
          ).toFixed(1);
          const mult = (displayTotal / INIT).toFixed(1);
          // Additive decomposition: wealth = (INIT + appr) + (cumRent - cumInt - cumCosts + cumTax) - txCosts
          const appreciationPart = Math.round(INIT + reDc.appr);
          const cashFlowPart = Math.round(
            reDc.cumRent - reDc.cumInt - reDc.cumCosts + reDc.cumTax,
          );
          return isZh
            ? `<strong style="color:${reColor}">${lbl.total}</strong><br>• ${fmt(INIT)} → <strong style="color:${DC.hi}">${fmt(displayTotal)}</strong> | ${mult}x | 年化 <strong style="color:${DC.hi}">${reCagr}%</strong> | ${yrs}年<br>&nbsp;&nbsp;· 权益（本金+涨幅）≈ ${W(fmt(appreciationPart))}<br>&nbsp;&nbsp;· ${isPrimary ? "净成本（−利息−运营成本）" : "现金流（租金−利息−成本+税收）"} ≈ ${W(fmt(cashFlowPart))}<br>• 杠杆放大涨幅；${isPrimary ? "自住无租金收入，成本为纯支出" : "租金+税收决定现金流方向"}<br>&nbsp;&nbsp;· 点击各行查看明细`
            : `<strong style="color:${reColor}">${lbl.total}</strong><br>• ${fmt(INIT)} → <strong style="color:${DC.hi}">${fmt(displayTotal)}</strong> | ${mult}x | <strong style="color:${DC.hi}">${reCagr}%/yr</strong> | ${yrs}yrs<br>&nbsp;&nbsp;· equity (capital + appr) ≈ ${W(fmt(appreciationPart))}<br>&nbsp;&nbsp;· ${isPrimary ? "net costs (−interest − op. costs)" : "cash flows (rent − interest − costs + tax)"} ≈ ${W(fmt(cashFlowPart))}<br>• leverage → price gain; ${isPrimary ? "no rental income — PITI is pure cost" : "rent + tax → cash flow direction"}<br>&nbsp;&nbsp;· click rows for breakdown`;
        },
      });
      reTableSets.push({ rows: reRows, label: reLabel, color: reColor });
    }
  }

  // Scale = sum of positive item values per table.
  // Positive bars grow left→right; negative bars grow right→left.
  // Sum(positive bars) - sum(negative bars) = total bar width. ✓
  function buildTable(rows, headerLabel, headerColor) {
    if (!rows.length) return "";
    const maxVal = Math.max(...rows.map((r) => Math.abs(r.val)), 1);
    let h = `<table class="decomp-table"><thead><tr><td colspan="3" class="decomp-table-head" style="color:${headerColor}">${headerLabel}</td></tr></thead><tbody>`;
    rows.forEach((row) => {
      const isNeg = row.val < 0;
      const w = Math.round((Math.abs(row.val) / maxVal) * 100);
      const opacity = row.total ? 1 : row.base ? 0.8 : 0.7;
      const barPos = isNeg ? "left:auto;right:0" : "left:0";
      const bold = row.total ? ";font-weight:bold" : "";
      const sign = !row.total && !row.base && isNeg ? "−" : "";
      const dispVal =
        row.total || row.base
          ? fmt(row.val)
          : `${sign}${fmt(Math.abs(row.val))}`;
      h += `<tr class="decomp-row" data-key="${row.key}">
              <td class="decomp-lbl" style="color:${row.color}${bold}">${row.label}</td>
              <td class="decomp-bar-td"><div class="decomp-bar-track"><div class="decomp-bar" style="width:${w}%;background:${row.color};opacity:${opacity};${barPos}"></div></div></td>
              <td class="decomp-amt" style="color:${row.color}${bold};text-align:${isNeg ? "right" : "left"}">${dispVal}</td>
            </tr>`;
    });
    h += `</tbody></table>`;
    return h;
  }

  const spColor = DC.sp;

  barsEl.innerHTML =
    `<div id="decomp-grid">` +
    (hidden.has(0) ? "" : buildTable(spRows, idxLabel, spColor)) +
    reTableSets.map((t) => buildTable(t.rows, t.label, t.color)).join("") +
    `</div>`;

  // Wire hover/click for educational content
  const allRows = [
    ...(hidden.has(0) ? [] : spRows),
    ...reTableSets.flatMap((t) => t.rows),
  ];
  const hintEl = document.getElementById("decomp-hint");
  const _showHint = () => {
    if (hintEl) hintEl.style.display = "";
  };
  const _hideHint = () => {
    if (hintEl) hintEl.style.display = "none";
  };

  const eduMap = {};
  allRows.forEach((r) => {
    if (r.edu) eduMap[r.key] = r.edu;
  });
  barsEl.querySelectorAll(".decomp-row").forEach((el) => {
    const key = el.dataset.key;
    if (!eduMap[key]) return;
    const showEdu = () => {
      barsEl
        .querySelectorAll(".decomp-row")
        .forEach((e) => e.classList.remove("active-edu"));
      el.classList.add("active-edu");
      if (eduEl) {
        eduEl.innerHTML = eduMap[key]();
        decompActiveRow = key;
      }
      _hideHint();
    };
    el.addEventListener("mouseenter", () => {
      // Don't override a pinned row unless hovering the pinned row itself
      if (clickedKey && clickedKey !== key) return;
      showEdu();
    });
    el.addEventListener("click", () => {
      if (clickedKey === key) {
        // Click pinned row again → unpin
        clickedKey = null;
        barsEl
          .querySelectorAll(".decomp-row")
          .forEach((e) => e.classList.remove("active-edu"));
        if (eduEl) eduEl.innerHTML = defaultEdu;
        decompActiveRow = null;
        _showHint();
      } else {
        clickedKey = key;
        showEdu();
      }
    });
  });
  const _arr = `<span class="hint-arrows"><span class="ha">↑</span><span class="ha">↑</span><span class="ha">↑</span></span>`;
  const _hintText = isZh
    ? "悬停或点击行查看说明"
    : "hover or click a row to explore";
  const _hintRow = `<div class="hint-row" style="color:${DC.hi}">${_arr}<span style="font-size:14px">${_hintText}</span>${_arr}</div>`;
  if (hintEl) hintEl.innerHTML = _hintRow + _hintRow + _hintRow;

  const defaultEdu = isZh
    ? `<strong style="color:${DC.hiMid}">收益明细</strong>：涨幅（杠杆放大）、现金流、成本、税收 → 正值叠加，负值抵消。悬停行查看计算逻辑。`
    : `<strong style="color:${DC.hiMid}">Return Breakdown</strong>: appreciation (leverage-amplified) + cash flows + costs + tax → positive adds, negative drags. Hover a row for the math.`;

  // Use the outer panel so moving mouse to edu text doesn't reset content
  const panelEl = document.getElementById("decomp-panel");
  if (panelEl)
    panelEl.addEventListener("mouseleave", () => {
      clickedKey = null; // clear pin when mouse fully leaves panel
      decompActiveRow = null;
      barsEl
        .querySelectorAll(".decomp-row")
        .forEach((e) => e.classList.remove("active-edu"));
      if (eduEl) eduEl.innerHTML = defaultEdu;
      _showHint();
    });

  // Restore active edu if row still exists, otherwise show default
  if (decompActiveRow && eduMap[decompActiveRow]) {
    const el = barsEl.querySelector(`[data-key="${decompActiveRow}"]`);
    if (el) {
      el.classList.add("active-edu");
      if (eduEl) eduEl.innerHTML = eduMap[decompActiveRow]();
      _hideHint();
    } else {
      if (eduEl) eduEl.innerHTML = defaultEdu;
      _showHint();
    }
  } else {
    if (eduEl) eduEl.innerHTML = defaultEdu;
    _showHint();
  }
}

// ── Communication helpers ─────────────────────────────────────────────────
function updateOutcomeCallout(monthsToShow) {
  updateLegendCagr(monthsToShow);
}

function updateLegendCagr(monthsToShow) {
  const m = Math.min(monthsToShow, allWealth[0].length - 1);
  const years = (m + 1) / 12;
  // Pick unit once based on max value so all items use the same format
  const maxV = Math.max(...allWealth.map((w) => w[m] ?? 0));
  const useM = maxV >= 1e6;
  const fmtLeg = (v) => {
    const abs = Math.abs(v);
    const sign = v < 0 ? "-" : "";
    if (useM || abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
    return `${sign}$${Math.round(abs / 1000)}K`;
  };
  let bestIdx = -1,
    bestVal = -Infinity;
  for (let i = 0; i < allWealth.length; i++) {
    const el = document.getElementById(`leg-cagr-${i}`);
    if (!el) continue;
    const v = allWealth[i][m];
    if (years < 1) {
      el.textContent = "";
      continue;
    }
    const cagr = (Math.pow(Math.max(v, 1) / INIT, 1 / years) - 1) * 100;
    el.textContent = ` ${fmtLeg(v)}  ${cagr >= 0 ? "+" : ""}${cagr.toFixed(1)}%`;
    el.style.color =
      cagr >= 0 ? getCSSVar("--cagr-positive") : getCSSVar("--cagr-negative");
    if (!hidden.has(i) && v > bestVal) {
      bestVal = v;
      bestIdx = i;
    }
  }
  const leaderEl = document.getElementById("legend-leader");
  if (!leaderEl) return;
  if (bestIdx < 0 || years < 1) {
    leaderEl.textContent = "";
    return;
  }
  const legLabels = isPrimary
    ? STRINGS[lang].legendLabelsPrimary
    : STRINGS[lang].legendLabels;
  const label =
    bestIdx === 0
      ? document.getElementById("index-select").selectedOptions[0].text
      : legLabels[bestIdx];
  leaderEl.style.color = getCSSVar(`--color-s${bestIdx}`);
  // Show leading scenario and how far ahead it is vs the best of the other type
  const spVal = allWealth[0][m];
  let compVal = -Infinity;
  for (let i = 1; i < allWealth.length; i++) {
    if (!hidden.has(i) && allWealth[i][m] > compVal) compVal = allWealth[i][m];
  }
  const ahead =
    bestIdx === 0 && compVal > 0
      ? ((spVal / compVal - 1) * 100) | 0
      : bestIdx > 0
        ? ((bestVal / spVal - 1) * 100) | 0
        : 0;
  const aheadStr = ahead > 0 ? ` · +${ahead}%` : "";
  leaderEl.textContent = `Leading Index \u2014 ${label}${aheadStr}`;
}

// ── Canvas ────────────────────────────────────────────────────────────────
const canvas = document.getElementById("c");
const sliderEl = document.getElementById("slider");
const yearLabel = document.getElementById("year-label");
const playBtn = document.getElementById("play-btn");
const ctx = canvas.getContext("2d");
const chartTooltip = document.getElementById("chart-tooltip");
let cW = 0,
  cH = 0;

function handleCanvasPointer(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const PL = 52,
    PR = 90;
  const chartW = cW - PL - PR;
  const cx = (clientX - rect.left) * (cW / rect.width);
  if (cx < PL || cx > cW - PR) {
    chartTooltip.style.display = "none";
    return;
  }
  const ratio = (cx - PL) / chartW;
  const m = Math.round(
    Math.max(0, Math.min(totalMonths - 1, ratio * totalMonths - 1)),
  );
  const yr = startYear + Math.floor(m / 12);
  const mo = (m % 12) + 1;
  const years = (m + 1) / 12;
  const isZhH = typeof lang !== "undefined" && lang === "zh";
  let html = `<div style="color:${getCSSVar("--text-sub")};margin-bottom:2px">${yr}/${mo.toString().padStart(2, "0")}</div>`;
  if (
    showIndexOverlay &&
    indexSpWealth.length > m &&
    indexReWealth.length > m
  ) {
    const overlayItems = [
      {
        v: indexSpWealth[m],
        color: getCSSVar("--color-s0"),
        label: "S&P 500",
      },
      {
        v: indexReWealth[m],
        color: "#c07840",
        label: SELECT_ABBR[getLocKey()] || getLocKey().toUpperCase(),
      },
    ];
    for (const { v, color, label } of overlayItems) {
      const cagrStr =
        years >= 1
          ? ` <span style="color:${getCSSVar("--text-dim")}">${((Math.pow(Math.max(v, 1) / INIT, 1 / years) - 1) * 100).toFixed(1)}%/yr</span>`
          : "";
      html += `<div><span style="color:${color}">▪</span> ${fmt(v)}${cagrStr} <span style="color:${getCSSVar("--text-dim")};font-size:8px">${label}</span></div>`;
    }
    html += `<hr style="border:none;border-top:1px solid ${getCSSVar("--border-dim")};margin:3px 0">`;
  }
  for (let i = 0; i < allWealth.length; i++) {
    if (hidden.has(i)) continue;
    const v = allWealth[i][m];
    const cagrStr =
      years >= 1
        ? ` <span style="color:${getCSSVar("--text-dim")}">${((Math.pow(Math.max(v, 1) / INIT, 1 / years) - 1) * 100).toFixed(1)}%/yr</span>`
        : "";
    const rowAlpha = showIndexOverlay ? ' style="opacity:0.5"' : "";
    html += `<div${rowAlpha}><span style="color:${getCSSVar(`--color-s${i}`)}">▪</span> ${fmt(v)}${cagrStr}</div>`;
  }
  chartTooltip.innerHTML = html;
  chartTooltip.style.display = "block";
  const wrapRect = canvas.parentElement.getBoundingClientRect();
  // CSS zoom makes getBoundingClientRect() return visual (zoomed) px, but
  // style.left/top expect CSS (unzoomed) px — divide by the body zoom factor.
  const bz = parseFloat(getComputedStyle(document.body).zoom) || 1;
  let tx = (clientX - wrapRect.left + 14) / bz;
  let ty = (clientY - wrapRect.top - 10) / bz;
  if (tx + 155 > wrapRect.width / bz) tx = (clientX - wrapRect.left) / bz - 165;
  chartTooltip.style.left = tx + "px";
  chartTooltip.style.top = ty + "px";
}
canvas.addEventListener("mousemove", (e) =>
  handleCanvasPointer(e.clientX, e.clientY),
);
canvas.addEventListener("mouseleave", () => {
  chartTooltip.style.display = "none";
});
canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    handleCanvasPointer(e.touches[0].clientX, e.touches[0].clientY);
  },
  { passive: false },
);
canvas.addEventListener("touchend", () => {
  chartTooltip.style.display = "none";
});

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const wrap = canvas.parentElement;
  cW = wrap.clientWidth;
  const idealH = Math.round((cW * 10) / 16);
  // Read CSS max-height directly (computed value resolves vh→px before first paint,
  // unlike clientHeight which reflects canvas content and fails on first render).
  const maxHStr = getComputedStyle(wrap).maxHeight;
  const cssMaxH = maxHStr !== "none" ? parseFloat(maxHStr) : 0;
  cH = cssMaxH > 0 && cssMaxH < idealH ? Math.round(cssMaxH) : idealH;
  canvas.width = cW * dpr;
  canvas.height = cH * dpr;
  canvas.style.width = cW + "px";
  canvas.style.height = cH + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw(monthsToShow) {
  const W = cW,
    H = cH;
  if (W === 0) return;
  // Read canvas colors from CSS custom properties (theme-aware)
  const CT = {
    bg: getCSSVar("--canvas-bg"),
    grid: getCSSVar("--canvas-grid"),
    axis: getCSSVar("--canvas-axis"),
    label: getCSSVar("--canvas-label"),
    refiLine: getCSSVar("--canvas-refi-line"),
    refiLabel: getCSSVar("--canvas-refi-label"),
    crashLine: getCSSVar("--canvas-crash-line"),
    spikeLine: getCSSVar("--canvas-spike-line"),
    crashLabel: getCSSVar("--canvas-crash-label"),
    spikeLabel: getCSSVar("--canvas-spike-label"),
    projFill: getCSSVar("--canvas-proj-fill"),
    projStroke: getCSSVar("--canvas-proj-stroke"),
    projLabel: getCSSVar("--canvas-proj-label"),
    negFill: getCSSVar("--canvas-neg-fill"),
    negStroke: getCSSVar("--canvas-neg-stroke"),
    s: [0, 1, 2, 3, 4, 5].map((i) => getCSSVar(`--color-s${i}`)),
  };
  // Sub-month interpolation for smooth animation
  const fullM = Math.floor(monthsToShow);
  const frac = monthsToShow - fullM;
  ctx.fillStyle = CT.bg;
  ctx.fillRect(0, 0, W, H);
  // Compute right padding to fit chasing labels
  const chartLegLabels = [
    document.getElementById("index-select")?.selectedOptions[0]?.text ||
      "S&P 500",
    "All Cash",
    ...RE_DOWN_PMTS.map((p) => `${dpPct(p)}% Down`),
  ];
  const lfs = Math.max(8, Math.min(10, W / 65));
  ctx.font = `${lfs}px monospace`;
  const maxLW = SCENARIOS.reduce(
    (mx, s, i) =>
      hidden.has(i)
        ? mx
        : Math.max(mx, ctx.measureText(chartLegLabels[i]).width),
    0,
  );
  const PL = 52,
    PR = Math.ceil(maxLW) + 10,
    PT = 16,
    PB = 28;
  const chartW = W - PL - PR,
    chartH = H - PT - PB;

  // Y range (log scale) — bidirectional smooth lerp during play, instant snap
  // during slider. Null means first frame: snap immediately.
  let yMin = Infinity,
    yMax = 200000;
  for (let i = 0; i < allWealth.length; i++) {
    if (hidden.has(i)) continue;
    const w = allWealth[i];
    for (let m = 0; m <= fullM && m < w.length; m++) {
      if (w[m] > yMax) yMax = w[m];
      if (w[m] > 1000 && w[m] < yMin) yMin = w[m];
    }
  }
  if (!isFinite(yMin)) yMin = 50000;
  const _loRaw = yMin * 0.85;
  const _mag = Math.pow(10, Math.floor(Math.log10(_loRaw)) - 1);
  const tgtLo = Math.max(1000, Math.floor(_loRaw / _mag) * _mag);
  const tgtHi = yMax * 1.1;
  // Snap on first frame; smooth lerp during play; instant snap during scrubbing
  if (lerpYLo === null) {
    lerpYLo = tgtLo;
    lerpYHi = tgtHi;
  }
  const _s = playing ? 0.05 : 1.0;
  lerpYHi = Math.exp(
    Math.log(lerpYHi) + (Math.log(tgtHi) - Math.log(lerpYHi)) * _s,
  );
  lerpYLo = Math.exp(
    Math.log(lerpYLo) + (Math.log(tgtLo) - Math.log(lerpYLo)) * _s,
  );
  const yLo = lerpYLo;
  const yHi = lerpYHi;
  const tx = (m) => PL + (m / Math.max(totalMonths, 1)) * chartW;
  const logRange = Math.log(yHi) - Math.log(yLo);
  const ty = (v) =>
    PT + ((Math.log(yHi) - Math.log(Math.max(v, yLo))) / logRange) * chartH;

  // Log-spaced grid (1, 2, 5 × powers of 10)
  const gridVals = [];
  for (
    let dec = Math.floor(Math.log10(yLo));
    dec <= Math.ceil(Math.log10(yHi));
    dec++
  ) {
    for (const m of [1, 2, 5]) {
      const v = m * Math.pow(10, dec);
      if (v >= yLo && v <= yHi) gridVals.push(v);
    }
  }
  ctx.font = `${Math.max(8, Math.min(10, W / 50))}px monospace`;
  for (const v of gridVals) {
    const y = ty(v);
    ctx.strokeStyle = CT.grid;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(PL, y);
    ctx.lineTo(PL + chartW, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = CT.axis;
    ctx.textAlign = "right";
    ctx.fillText(fmt(v), PL - 3, y + 4);
  }

  // Refi year markers — only years that actually fire (getRefis filters out rate-rising years)
  if (numRefis > 0) {
    const refis = getRefis(startYear, endYear, numRefis);
    const xLabelFont = `${Math.max(7, Math.min(9, W / 55))}px monospace`;
    let refiLabelIdx = 0;
    for (const refi of refis) {
      if (refi.m > fullM) continue;
      const x = tx(refi.m + 1);
      ctx.strokeStyle = CT.refiLine;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, PT);
      ctx.lineTo(x, PT + chartH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = CT.refiLabel;
      ctx.font = xLabelFont;
      ctx.textAlign = "center";
      const labelY = PT + 8 + (refiLabelIdx % 3) * 18;
      ctx.fillText(`${(refi.rate * 100).toFixed(1)}%`, x, labelY);
      ctx.fillText(`R${refi.year}`, x, labelY + 9);
      refiLabelIdx++;
    }
  }

  // Historical event annotations — crashes (red) + spikes (amber)
  ctx.font = `${Math.max(7, Math.min(8, W / 80))}px monospace`;
  ctx.globalAlpha = 0.5;
  let lastCrashLabelX = -999,
    lastSpikeLabelX = -999;
  for (const ev of MARKET_EVENTS) {
    if (!ev.chartLine) continue;
    const evM = (ev.year - startYear) * 12;
    if (evM <= 0 || evM >= fullM) continue;
    const ex = tx(evM);
    const isCrash = ev.type === "crash";
    ctx.strokeStyle = isCrash ? CT.crashLine : CT.spikeLine;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(ex, PT);
    ctx.lineTo(ex, PT + chartH);
    ctx.stroke();
    ctx.setLineDash([]);
    const evLabel = lang === "zh" ? ev.nameZh : ev.name;
    ctx.fillStyle = isCrash ? CT.crashLabel : CT.spikeLabel;
    ctx.textAlign = "center";
    if (isCrash) {
      if (Math.abs(ex - lastCrashLabelX) > 36) {
        ctx.fillText(evLabel, ex, PT + chartH - 16);
        lastCrashLabelX = ex;
      }
    } else {
      if (Math.abs(ex - lastSpikeLabelX) > 36) {
        ctx.fillText(evLabel, ex, PT + 44);
        lastSpikeLabelX = ex;
      }
    }
  }
  ctx.globalAlpha = 1.0;

  // X-axis year labels
  ctx.font = `${Math.max(7, Math.min(9, W / 55))}px monospace`;
  ctx.textAlign = "center";
  const fullDur = endYear - startYear + 1;
  const step = fullDur <= 10 ? 1 : fullDur <= 20 ? 2 : 5;
  for (let yr = 0; yr <= fullDur; yr += step) {
    const m = yr * 12;
    ctx.fillStyle = CT.label;
    ctx.fillText(startYear + yr, tx(m), H - 6);
  }

  // Projection zone shading
  const pxStart = tx(projStartM + 1);
  if (pxStart < PL + chartW) {
    ctx.fillStyle = CT.projFill;
    ctx.fillRect(pxStart, PT, PL + chartW - pxStart, chartH);
    // Boundary line
    ctx.strokeStyle = CT.projStroke;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(pxStart, PT);
    ctx.lineTo(pxStart, PT + chartH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = `${Math.max(7, Math.min(9, W / 55))}px monospace`;
    ctx.fillStyle = CT.projLabel;
    ctx.textAlign = "left";
    ctx.fillText("EST.", pxStart + 4, PT - 3);
  }

  // Lines — dim to background when overlay is active
  if (showIndexOverlay) ctx.globalAlpha = 0.18;
  for (let i = 0; i < SCENARIOS.length; i++) {
    if (hidden.has(i)) continue;
    const w = allWealth[i];
    const color = CT.s[i];
    const lw = i === 0 ? 2 : 1.5;

    // Sell cost adjustment: subtract from the final drawn point only (RE lines).
    // This mirrors the decomp table which shows "net if sold today" at the endpoint.
    const dc = i > 0 ? allDecomp[i] : null;
    const endSellCost =
      dc && inclTxCosts && dc.txSellRate > 0 && dc.dComp?.[fullM] != null
        ? Math.round((dc.price + dc.dComp[fullM].appr) * dc.txSellRate)
        : 0;
    const endCapGains = inclCapGains ? computeCapGains(i, fullM) : 0;
    // Helper: Y value with sell cost + cap gains deducted at endpoint
    const wyEnd = (m) => w[m] - endSellCost - endCapGains;

    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.lineJoin = "round";
    const solidEnd = Math.min(projStartM, fullM);
    // Solid: anchor at INIT then historical data (data index m → x-position m+1)
    // At fullM=0 frac=0 (slider at very start), only the INIT anchor is drawn.
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(tx(0), ty(INIT));
    for (let m = 0; m <= solidEnd && m < w.length; m++) {
      if (fullM === 0 && frac === 0) break; // only INIT anchor at start
      const isEnd = m === fullM && frac === 0;
      ctx.lineTo(tx(m + 1), ty(isEnd ? wyEnd(m) : w[m]));
    }
    // Fractional leading edge in solid zone
    if (fullM < projStartM && frac > 0 && fullM + 1 < w.length)
      ctx.lineTo(
        tx(fullM + 1 + frac),
        ty(
          w[fullM] +
            frac * (w[fullM + 1] - w[fullM]) -
            endSellCost -
            endCapGains,
        ),
      );
    ctx.stroke();
    // Dashed: projection portion
    const inDashZone = fullM > projStartM || (fullM === projStartM && frac > 0);
    if (inDashZone) {
      ctx.setLineDash([4, 4]);
      ctx.globalAlpha = showIndexOverlay ? 0.18 : 0.7;
      ctx.beginPath();
      ctx.moveTo(tx(solidEnd + 1), ty(w[solidEnd]));
      for (let m = solidEnd + 1; m <= fullM && m < w.length; m++) {
        const isEnd = m === fullM && frac === 0;
        ctx.lineTo(tx(m + 1), ty(isEnd ? wyEnd(m) : w[m]));
      }
      // Fractional leading edge in dash zone
      if (frac > 0 && fullM + 1 < w.length)
        ctx.lineTo(
          tx(fullM + 1 + frac),
          ty(
            w[fullM] +
              frac * (w[fullM + 1] - w[fullM]) -
              endSellCost -
              endCapGains,
          ),
        );
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = showIndexOverlay ? 0.18 : 1.0;
    }
  }

  // Tip dots (interpolated for smooth movement)
  if (monthsToShow > 1) {
    for (let i = 0; i < SCENARIOS.length; i++) {
      if (hidden.has(i)) continue;
      const w = allWealth[i];
      const hm = Math.min(fullM, w.length - 1);
      const canInterp = frac > 0 && fullM + 1 < w.length;
      const dotX = canInterp ? tx(fullM + 1 + frac) : tx(hm + 1);
      // Apply sell cost + cap gains adjustment to tip dot position (mirrors line endpoint)
      const dotDc = i > 0 ? allDecomp[i] : null;
      const dotSellCost =
        dotDc &&
        inclTxCosts &&
        dotDc.txSellRate > 0 &&
        dotDc.dComp?.[hm] != null
          ? Math.round((dotDc.price + dotDc.dComp[hm].appr) * dotDc.txSellRate)
          : 0;
      const dotCapGains = inclCapGains ? computeCapGains(i, hm) : 0;
      const dotY = canInterp
        ? ty(
            w[fullM] +
              frac * (w[fullM + 1] - w[fullM]) -
              dotSellCost -
              dotCapGains,
          )
        : ty(w[hm] - dotSellCost - dotCapGains);
      ctx.fillStyle = CT.s[i];
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Chasing line-head labels (right of current endpoint, interpolated)
  {
    const hm = Math.min(fullM, totalMonths - 1);
    const canInterp = frac > 0 && hm + 1 < allWealth[0].length;
    const atStart = fullM === 0 && frac === 0;
    if (hm >= 0) {
      ctx.font = `${lfs}px monospace`;
      ctx.textAlign = "left";
      const items = SCENARIOS.map((s, i) => {
        const v0 = atStart ? INIT : allWealth[i][hm];
        const vRaw = atStart
          ? INIT
          : canInterp
            ? v0 + frac * (allWealth[i][hm + 1] - v0)
            : v0;
        // Subtract sell cost + cap gains at current endpoint
        const lDc = i > 0 ? allDecomp[i] : null;
        const lSell =
          lDc && inclTxCosts && lDc.txSellRate > 0 && lDc.dComp?.[hm] != null
            ? Math.round((lDc.price + lDc.dComp[hm].appr) * lDc.txSellRate)
            : 0;
        const lCapGains = inclCapGains ? computeCapGains(i, hm) : 0;
        const v = atStart ? INIT : vRaw - lSell - lCapGains;
        return { s, i, v };
      })
        .filter(({ i }) => !hidden.has(i))
        .sort((a, b) => b.v - a.v);
      const minGap = lfs * 2 + 4;
      const positions = items.map(({ v }) => ty(v));
      // Forward pass: push down to resolve top-overlaps
      for (let k = 1; k < positions.length; k++)
        if (positions[k] < positions[k - 1] + minGap)
          positions[k] = positions[k - 1] + minGap;
      // Clamp bottom, then backward pass: push up to resolve bottom-overflow
      const yBottom = PT + chartH - lfs;
      for (let k = positions.length - 1; k >= 0; k--) {
        if (positions[k] > yBottom) positions[k] = yBottom;
        if (
          k < positions.length - 1 &&
          positions[k] > positions[k + 1] - minGap
        )
          positions[k] = positions[k + 1] - minGap;
      }
      // Clamp top
      for (let k = 0; k < positions.length; k++)
        if (positions[k] < PT + lfs) positions[k] = PT + lfs;
      const lx =
        (atStart ? tx(0) : canInterp ? tx(fullM + 1 + frac) : tx(hm + 1)) + 6;
      items.forEach(({ s, i, v }, k) => {
        ctx.fillStyle = CT.s[i];
        ctx.fillText(fmt(v), lx, positions[k] - lfs * 0.3);
        ctx.fillText(chartLegLabels[i], lx, positions[k] + lfs * 0.9);
      });
    }
  }

  // ── Common-chart overlay: S&P total return vs RE price-only (no leverage/income) ──
  if (
    showIndexOverlay &&
    indexSpWealth.length > 0 &&
    indexReWealth.length > 0
  ) {
    ctx.globalAlpha = 1.0;
    const isZh = typeof lang !== "undefined" && lang === "zh";
    const overlayPairs = [
      {
        w: indexSpWealth,
        color: CT.s[0],
        label: "S&P 500",
      },
      {
        w: indexReWealth,
        color: "#c07840",
        label: SELECT_ABBR[getLocKey()] || getLocKey().toUpperCase(),
      },
    ];
    const hm = Math.min(fullM, totalMonths - 1);
    const canInterp = frac > 0 && hm + 1 < indexSpWealth.length;
    const atStart = fullM === 0 && frac === 0;
    const lx =
      (atStart ? tx(0) : canInterp ? tx(fullM + 1 + frac) : tx(hm + 1)) + 6;
    const overlayPositions = overlayPairs.map(({ w }) => {
      const v0 = atStart ? INIT : w[hm];
      return ty(
        canInterp && !atStart
          ? v0 + frac * (w[Math.min(hm + 1, w.length - 1)] - v0)
          : v0,
      );
    });
    // Collision avoidance for overlay labels
    const minGapO = lfs * 2 + 4;
    if (overlayPositions[1] < overlayPositions[0] + minGapO)
      overlayPositions[1] = overlayPositions[0] + minGapO;
    overlayPairs.forEach(({ w, color, label }, oi) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(tx(0), ty(INIT));
      const solidEnd = Math.min(projStartM, fullM);
      for (let m = 0; m <= solidEnd && m < w.length; m++) {
        if (atStart) break;
        ctx.lineTo(tx(m + 1), ty(w[m]));
      }
      if (fullM < projStartM && frac > 0 && fullM + 1 < w.length)
        ctx.lineTo(
          tx(fullM + 1 + frac),
          ty(w[fullM] + frac * (w[fullM + 1] - w[fullM])),
        );
      ctx.stroke();
      const inDash = fullM > projStartM || (fullM === projStartM && frac > 0);
      if (inDash) {
        ctx.setLineDash([4, 4]);
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(tx(solidEnd + 1), ty(w[solidEnd]));
        for (let m = solidEnd + 1; m <= fullM && m < w.length; m++)
          ctx.lineTo(tx(m + 1), ty(w[m]));
        if (frac > 0 && fullM + 1 < w.length)
          ctx.lineTo(
            tx(fullM + 1 + frac),
            ty(w[fullM] + frac * (w[fullM + 1] - w[fullM])),
          );
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;
      }
      // Tip dot
      if (monthsToShow > 1) {
        const dotX = canInterp ? tx(fullM + 1 + frac) : tx(hm + 1);
        const dotV = atStart
          ? INIT
          : canInterp
            ? w[hm] + frac * (w[Math.min(hm + 1, w.length - 1)] - w[hm])
            : w[hm];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(dotX, ty(dotV), 4, 0, Math.PI * 2);
        ctx.fill();
      }
      // Chasing label
      const v = atStart
        ? INIT
        : canInterp
          ? w[hm] + frac * (w[Math.min(hm + 1, w.length - 1)] - w[hm])
          : w[hm];
      ctx.fillStyle = color;
      ctx.font = `bold ${lfs}px monospace`;
      ctx.textAlign = "left";
      ctx.fillText(fmt(v), lx, overlayPositions[oi] - lfs * 0.3);
      ctx.fillText(label, lx, overlayPositions[oi] + lfs * 0.9);
    });
    ctx.font = `${lfs}px monospace`; // restore font
  } else {
    ctx.globalAlpha = 1.0;
  }

  // Annotate when any visible scenario is below the chart floor (negative equity)
  {
    let hasFloored = false;
    const mCheck = fullM;
    outer: for (let i = 0; i < allWealth.length; i++) {
      if (hidden.has(i)) continue;
      for (let m = 0; m <= mCheck && m < allWealth[i].length; m++) {
        if (allWealth[i][m] < yLo) {
          hasFloored = true;
          break outer;
        }
      }
    }
    if (hasFloored) {
      const afs = Math.max(8, Math.min(10, W / 70));
      ctx.font = `bold ${afs}px monospace`;
      ctx.textAlign = "center";
      const floorLabel =
        lang === "zh"
          ? "已破产。过度杠杆导致负净值。图表停留于最大亏损点。"
          : "Bankrupted. Overleverage Caused Negative Equity. Chart Stayed at Max Deficit.";
      const labelX = PL + chartW / 2;
      // Sit above x-axis year labels: baseline H-6, font 7-9px → tops ~H-15
      const yLabelFontSize = Math.max(7, Math.min(9, W / 55));
      const labelY = H - 6 - yLabelFontSize - 6;
      const tw = ctx.measureText(floorLabel).width;
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = CT.negFill;
      ctx.fillRect(labelX - tw / 2 - 4, labelY - afs - 1, tw + 8, afs + 4);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = CT.negStroke;
      ctx.fillText(floorLabel, labelX, labelY);
    }
  }

  // Update communication elements with integer month (array index safe)
  updateOutcomeCallout(fullM);
  updateLegendCagr(fullM);
  renderDecomp(fullM);
}

// ── Year label ────────────────────────────────────────────────────────────
function updateLabel(mInt) {
  const yr = startYear + Math.floor((mInt - 1) / 12);
  const mo = ((mInt - 1) % 12) + 1;
  const est = mInt > projStartM + 1 ? " est." : "";
  yearLabel.textContent = `${yr}/${mo.toString().padStart(2, "0")}${est}`;
}

// ── Y-axis lerp state (bidirectional, null = snap on next draw) ─────────
let lerpYLo = null,
  lerpYHi = null;

// ── Play state machine ────────────────────────────────────────────────────
// States: STOPPED | PLAYING
let playing = false,
  rafId = null,
  lastTs = null,
  speedMultiplier = 1;

const speedBtn = document.getElementById("speed-btn");

function startPlay() {
  if (playing) return; // guard: no double RAF
  if (curMonth >= totalMonths) {
    curMonth = 1; // restart from beginning if at end
    lerpYLo = null;
    lerpYHi = null; // snap y-axis to month-1 range on first frame
  }
  sliderEl.value = Math.round(curMonth);
  playing = true;
  lastTs = null;
  playBtn.innerHTML = "⏸";
  rafId = requestAnimationFrame(tick);
}

function stopPlay() {
  if (!playing && rafId === null) return; // guard: already stopped
  playing = false;
  playBtn.innerHTML = "&#9654;";
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  lastTs = null;
}

function tick(ts) {
  if (!playing) return;
  if (lastTs === null) {
    lastTs = ts;
    rafId = requestAnimationFrame(tick);
    return;
  }
  const dt = Math.min((ts - lastTs) / 1000, 0.1);
  lastTs = ts;
  curMonth = Math.min(
    curMonth + dt * (totalMonths / 30) * speedMultiplier,
    totalMonths,
  );
  const m = Math.round(curMonth);
  sliderEl.value = m;
  updateLabel(m);
  draw(curMonth - 1); // float → sub-month interpolation in draw()
  if (curMonth >= totalMonths) {
    stopPlay();
    return;
  }
  rafId = requestAnimationFrame(tick);
}

playBtn.addEventListener("click", () => {
  if (playing) stopPlay();
  else startPlay();
});

// 2x toggle: only auto-play when turning ON and animation is not finished
speedBtn.addEventListener("click", () => {
  const turningOn = speedMultiplier === 1;
  speedMultiplier = turningOn ? 2 : 1;
  speedBtn.classList.toggle("active", speedMultiplier === 2);
  if (turningOn && !playing && curMonth < totalMonths) startPlay();
});

// ── Slider ────────────────────────────────────────────────────────────────
sliderEl.addEventListener("input", () => {
  stopPlay();
  curMonth = parseInt(sliderEl.value);
  updateLabel(curMonth);
  draw(curMonth - 1);
});

// ── Start / end year controls ─────────────────────────────────────────────
function rebuild() {
  allWealth = buildAllWealth(startYear);
  totalMonths = (endYear - startYear + 1) * 12;
  projStartM = (DATA_THROUGH_YEAR - startYear) * 12 + DATA_THROUGH_MONTH - 1;
  curMonth = Math.min(projStartM + 1, totalMonths);
  sliderEl.max = totalMonths;
  sliderEl.value = curMonth;
  // Reset lerp so draw() snaps to the correct range for curMonth on first frame
  lerpYLo = null;
  lerpYHi = null;
  updateAssumptions();
  updateLabel(curMonth);
  buildTable();
  syncTableCols();
  draw(curMonth - 1);
}

function setStartYear(yr) {
  startYear = yr;
  document.getElementById("start-year-val").textContent = yr;
  // keep end year at least 1 year ahead
  const endSlider = document.getElementById("end-year-slider");
  endSlider.min = yr + 1;
  if (endYear <= yr) {
    endYear = yr + 1;
    endSlider.value = endYear;
    document.getElementById("end-year-val").textContent = endYear;
  }
  rebuild();
}

function setEndYear(yr) {
  endYear = yr;
  document.getElementById("end-year-val").textContent = yr;
  // keep start year at least 1 year behind
  const startSlider = document.getElementById("start-year-slider");
  startSlider.max = yr - 1;
  if (startYear >= yr) {
    startYear = yr - 1;
    startSlider.value = startYear;
    document.getElementById("start-year-val").textContent = startYear;
  }
  rebuild();
}

document
  .getElementById("start-year-slider")
  .addEventListener("input", function () {
    stopPlay();
    setStartYear(parseInt(this.value));
  });

document
  .getElementById("end-year-slider")
  .addEventListener("input", function () {
    stopPlay();
    setEndYear(parseInt(this.value));
  });

// ── Resize ────────────────────────────────────────────────────────────────
// Debounced: rotation fires many rapid events; only redraw after it settles
let resizeTimer = null;
window.addEventListener("resize", () => {
  if (resizeTimer !== null) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeTimer = null;
    resizeCanvas();
    draw(curMonth - 1);
  }, 80);
});
// Safari fires orientationchange before viewport dimensions update;
// wait 300ms for the new geometry to settle, then force a redraw.
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    resizeCanvas();
    draw(curMonth - 1);
  }, 300);
});

// ── Init ──────────────────────────────────────────────────────────────────
loadFromHash();
// Sync DOM to (possibly hash-loaded) state
document.getElementById("start-year-slider").value = startYear;
document.getElementById("start-year-val").textContent = startYear;
document.getElementById("end-year-slider").value = endYear;
document.getElementById("end-year-val").textContent = endYear;
document.getElementById("init-select").value = INIT;
document.getElementById("init-abbr").textContent =
  INIT >= 1000000 ? "$" + INIT / 1000000 + "M" : "$" + INIT / 1000 + "k";

document.getElementById("end-year-slider").min = startYear + 1;
document.getElementById("start-year-slider").max = endYear - 1;
if (reinvest) {
  document.getElementById("btn-reinvest").classList.add("active");
  document.getElementById("btn-additive").classList.remove("active");
}
syncReinvestIdxWrap();
if (reinvestIdx !== "sp500") {
  ["sp500", "nasdaq", "sixty40"].forEach((k) =>
    document
      .getElementById(`btn-ri-${k}`)
      .classList.toggle("active", k === reinvestIdx),
  );
}
if (isPrimary) {
  document.getElementById("btn-primary").classList.add("active");
  document.getElementById("btn-rental").classList.remove("active");
}
syncPmFeeBtn();
if (showIndexOverlay)
  document.getElementById("overlay-legend-row").classList.add("active");
if (numRefis > 0) {
  [0, 1, 2, 3].forEach((i) =>
    document
      .getElementById(`btn-refi-${i}`)
      .classList.toggle("active", i === numRefis),
  );
  document.getElementById("refi-type-group").style.display = "flex";
}
if (refiLTV && numRefis > 0) {
  document.getElementById("btn-refi-ltv").classList.add("active");
  document.getElementById("btn-refi-rate").classList.remove("active");
  document.getElementById("row-ltv-pct").style.display = "flex";
  const ltvPctInit = Math.round(refiLTVPct * 100);
  document.getElementById("ltv-pct-slider").value = ltvPctInit;
  document.getElementById("ltv-pct-val").textContent = ltvPctInit + "%";
}
// Sync tier buttons (default is index 1 / $150K — always re-apply from state)
[0, 1, 2, 3, 4].forEach((i) =>
  document
    .getElementById(`btn-tier-${i}`)
    .classList.toggle("active", i === incomeTier),
);
document.getElementById("lang-select").value = lang;
document.getElementById("lang-abbr").textContent = lang === "zh" ? "🇨🇳" : "🇺🇸";
if (!inclTaxBenefits)
  document.getElementById("btn-incl-taxbenefit").classList.remove("active");
if (!inclDepreciation)
  document.getElementById("btn-incl-depreciation").classList.remove("active");
if (!inclCosts)
  document.getElementById("btn-incl-costs").classList.remove("active");
if (!inclTxCosts)
  document.getElementById("btn-incl-tx-costs").classList.remove("active");
if (!inclMgmtFee)
  document.getElementById("btn-incl-mgmt").classList.remove("active");
if (inclHoa) {
  document.getElementById("btn-incl-hoa").classList.add("active");
  const sel = document.getElementById("hoa-amount-select");
  sel.value = hoaMonthly;
  sel.style.display = "";
}
if (inclCapGains) {
  document.getElementById("btn-incl-cap-gains").classList.add("active");
  syncCapGainsSubBtn();
  const assBullet = document.getElementById("assump-capgains");
  if (assBullet) assBullet.style.display = "";
}
if (!use1031) {
  const el = document.getElementById("btn-1031");
  if (el) el.classList.remove("active");
}
document.querySelectorAll(".leg-item").forEach((item) => {
  item.classList.toggle("hidden", hidden.has(parseInt(item.dataset.idx)));
});
document
  .getElementById("index-select")
  .addEventListener("change", refreshDatasets);
document.getElementById("state-select").addEventListener("change", () => {
  populateMetroSelect();
  populateCitySelect();
  refreshDatasets();
});
document.getElementById("metro-select").addEventListener("change", () => {
  populateCitySelect();
  refreshDatasets();
});
document
  .getElementById("city-select")
  .addEventListener("change", refreshDatasets);
const INIT_OPTS = [100000, 200000, 500000, 1000000, 2000000, 5000000];
const fmtInitAbbr = (v) =>
  v >= 1000000 ? "$" + v / 1000000 + "M" : "$" + v / 1000 + "k";
document.getElementById("init-select").addEventListener("change", function () {
  INIT = parseInt(this.value);
  document.getElementById("init-abbr").textContent = fmtInitAbbr(INIT);
  allWealth = buildAllWealth(startYear);
  draw(curMonth - 1);
});

function populateMetroSelect() {
  const stateKey = document.getElementById("state-select").value;
  const state = LOCATION_HIERARCHY.find((s) => s.key === stateKey);
  const sel = document.getElementById("metro-select");
  sel.innerHTML = state.metros
    .map((m) => `<option value="${m.key}">${m.label}</option>`)
    .join("");
}

function populateCitySelect() {
  const metroKey = document.getElementById("metro-select").value;
  const metro = LOCATION_HIERARCHY.flatMap((s) => s.metros).find(
    (m) => m.key === metroKey,
  );
  const wrap = document.getElementById("city-wrap");
  const div = document.getElementById("city-divider");
  const sel = document.getElementById("city-select");
  if (!metro || metro.cities.length === 0) {
    wrap.style.display = "none";
    div.style.display = "none";
    return;
  }
  wrap.style.display = "";
  div.style.display = "";
  sel.innerHTML =
    metro.cities
      .map((c) => `<option value="${c.key}">${c.label}</option>`)
      .join("") + `<option value="${metro.key}">County Wide</option>`;
  sel.value = metro.key; // default to County Wide
  updateSelectAbbr();
}

populateMetroSelect();
populateCitySelect();

// Apply URL location/index params after cascade helpers are ready
function applyLocationFromHash() {
  const qs = location.search.slice(1) || location.hash.slice(1);
  if (!qs) return;
  const p = new URLSearchParams(qs);
  if (p.has("idx")) {
    const sel = document.getElementById("index-select");
    const v = p.get("idx");
    if ([...sel.options].some((o) => o.value === v)) sel.value = v;
  }
  if (p.has("st")) {
    const sel = document.getElementById("state-select");
    const v = p.get("st");
    if ([...sel.options].some((o) => o.value === v)) {
      sel.value = v;
      populateMetroSelect();
    }
  }
  if (p.has("mt")) {
    const sel = document.getElementById("metro-select");
    const v = p.get("mt");
    if ([...sel.options].some((o) => o.value === v)) {
      sel.value = v;
      populateCitySelect();
    }
  }
  if (p.has("ct")) {
    const wrap = document.getElementById("city-wrap");
    const sel = document.getElementById("city-select");
    if (wrap?.style.display !== "none") {
      const v = p.get("ct");
      if ([...sel.options].some((o) => o.value === v)) sel.value = v;
    }
  }
  updateSelectAbbr();
}
applyLocationFromHash();

// Apply saved theme preference before first draw
const initPref = getThemePref();
document.documentElement.dataset.theme = resolveTheme(initPref);
updateThemeBtn(initPref);
document.getElementById("theme-btn").addEventListener("click", toggleTheme);

// Sync HPI buttons from (possibly hash-loaded) hpiSource
["fhfa", "cs"].forEach((k) => {
  const btn = document.getElementById(`btn-hpi-${k}`);
  if (btn) btn.classList.toggle("active", k === hpiSource);
});
// If cap gains loaded from hash, lock tx-costs
if (inclCapGains) {
  inclTxCosts = true;
  const txBtn = document.getElementById("btn-incl-tx-costs");
  if (txBtn) {
    txBtn.classList.add("active");
    txBtn.setAttribute("disabled", "");
  }
}
allWealth = buildAllWealth(startYear);
totalMonths = (endYear - startYear + 1) * 12;
projStartM = (DATA_THROUGH_YEAR - startYear) * 12 + DATA_THROUGH_MONTH - 1;
curMonth = totalMonths;
sliderEl.max = totalMonths;
sliderEl.value = curMonth;
// ── Landscape chart height: set CSS max-height accounting for body zoom ──────
// CSS 50vh with body{zoom:1.6} renders at 80% of viewport — too tall.
// Setting max-height in CSS px = vh*pct/zoom ensures visual = pct of viewport.
function updateChartMaxHeight() {
  const wrap = document.getElementById("chart-wrap");
  const bz = parseFloat(getComputedStyle(document.body).zoom) || 1;
  const isLandscape = window.innerWidth > window.innerHeight;
  if (isLandscape) {
    const pct = window.innerHeight <= 500 ? 0.44 : 0.5;
    wrap.style.maxHeight = Math.round((window.innerHeight * pct) / bz) + "px";
  } else {
    wrap.style.maxHeight = "";
  }
  // resizeCanvas() intentionally omitted — debounced resize handler calls it.
  // Calling it here would clear the canvas 80ms before the redraw, causing flash.
}
window.addEventListener("resize", updateChartMaxHeight);
updateChartMaxHeight();
resizeCanvas(); // explicit init sizing (debounced handler won't fire on load)
applyLang();
updateLabel(curMonth);
draw(curMonth - 1);

// Tooltip viewport-clamping: keep ::before within screen bounds (horizontal + vertical)
function positionTooltip(icon) {
  const rect = icon.getBoundingClientRect();
  const bz = parseFloat(getComputedStyle(document.body).zoom) || 1;
  const tipW = Math.min(240, window.innerWidth * 0.9);
  const isRight = !!icon.closest(".tip-right");
  const isLeft = !!icon.closest(".tip-left");
  let absLeft;
  if (isRight) absLeft = rect.left;
  else if (isLeft) absLeft = rect.right - tipW;
  else absLeft = rect.left + rect.width / 2 - tipW / 2;
  const clamped = Math.max(8, Math.min(absLeft, window.innerWidth - tipW - 8));
  icon.style.setProperty("--tt-x", clamped - rect.left + "px");
  icon.style.setProperty("--tt-tx", "none");
  // Flip to below when tooltip would overflow the top of the viewport.
  // Measure actual tip height (pseudo-elements can't be measured directly).
  const tipText = icon.getAttribute("data-tip") || "";
  let tipHvisual = 160; // fallback estimate
  if (tipText) {
    const m = document.createElement("div");
    m.style.cssText = `position:fixed;top:-9999px;visibility:hidden;font-size:11px;line-height:1.5;padding:5px 9px;width:${Math.round(tipW / bz)}px;white-space:pre-line;pointer-events:none;`;
    m.textContent = tipText;
    document.body.appendChild(m);
    tipHvisual = m.offsetHeight * bz; // CSS px → visual px
    m.remove();
  }
  icon.classList.toggle("tip-flipped", rect.top < tipHvisual + 12);
}

// Tooltip icon click: toggle tooltip, never fire parent button action
document.querySelectorAll(".tip-icon").forEach((icon) => {
  icon.addEventListener("mouseenter", () => positionTooltip(icon));
  icon.addEventListener("click", (e) => {
    e.stopPropagation(); // block event from reaching parent button
    positionTooltip(icon);
    const isOpen = icon.classList.contains("open");
    document
      .querySelectorAll(".tip-icon.open")
      .forEach((i) => i.classList.remove("open"));
    if (!isOpen) icon.classList.add("open");
  });
});
// Event delegation for dynamically injected tip-icons (e.g. assumptions-line)
document.getElementById("assumptions-line").addEventListener(
  "mouseenter",
  (e) => {
    const icon = e.target.closest(".tip-icon");
    if (icon) positionTooltip(icon);
  },
  true,
);
document.getElementById("assumptions-line").addEventListener("click", (e) => {
  const icon = e.target.closest(".tip-icon");
  if (!icon) return;
  e.stopPropagation();
  positionTooltip(icon);
  const isOpen = icon.classList.contains("open");
  document
    .querySelectorAll(".tip-icon.open")
    .forEach((i) => i.classList.remove("open"));
  if (!isOpen) icon.classList.add("open");
});
// Close any open tooltip when clicking outside
document.addEventListener("click", () => {
  document
    .querySelectorAll(".tip-icon.open")
    .forEach((i) => i.classList.remove("open"));
});
