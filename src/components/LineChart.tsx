import React from "react";
import { Scenario, TOTAL_MONTHS, START_YEAR } from "../data/financialModel";

interface LineChartProps {
  scenarios: Scenario[];
  progress: number; // 0–1, how many months to reveal
  width: number;
  height: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
}

function formatDollar(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

const LOG_FLOOR = 10_000;

export const LineChart: React.FC<LineChartProps> = ({
  scenarios,
  progress,
  width,
  height,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
}) => {
  const revealedMonths = Math.floor(progress * TOTAL_MONTHS);

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Log-scale Y range
  // yMax: full range for stable top; yMin: revealed data only for tight bottom
  let yMin = Infinity;
  let yMax = 200_000;
  for (const s of scenarios) {
    for (let m = 0; m < s.wealthByMonth.length; m++) {
      if (s.wealthByMonth[m] > yMax) yMax = s.wealthByMonth[m];
    }
    for (let m = 0; m <= revealedMonths && m < s.wealthByMonth.length; m++) {
      const v = s.wealthByMonth[m];
      if (v > LOG_FLOOR && v < yMin) yMin = v;
    }
  }
  if (!isFinite(yMin)) yMin = 50_000;
  // Floor: 2-sig-fig round-down of yMin*0.85 — keeps lines near bottom of chart
  const loRaw = yMin * 0.85;
  const loMag = Math.pow(10, Math.floor(Math.log10(loRaw)) - 1);
  const yLo = Math.max(LOG_FLOOR, Math.floor(loRaw / loMag) * loMag);
  const yHi = yMax * 1.1;
  const logRange = Math.log(yHi) - Math.log(yLo);

  const toX = (monthIndex: number) =>
    paddingLeft + (monthIndex / (TOTAL_MONTHS - 1)) * chartWidth;

  const toY = (value: number) =>
    paddingTop +
    ((Math.log(yHi) - Math.log(Math.max(value, yLo))) / logRange) * chartHeight;

  // Build SVG path for each scenario
  const buildPath = (data: number[], upTo: number): string => {
    if (upTo < 1) return "";
    let d = `M ${toX(0)} ${toY(data[0])}`;
    for (let m = 1; m <= upTo && m < data.length; m++) {
      d += ` L ${toX(m)} ${toY(data[m])}`;
    }
    return d;
  };

  // Log-spaced grid values (1, 2, 5 × powers of 10)
  const gridValues: number[] = [];
  for (
    let dec = Math.floor(Math.log10(yLo));
    dec <= Math.ceil(Math.log10(yHi));
    dec++
  ) {
    for (const m of [1, 2, 5]) {
      const v = m * Math.pow(10, dec);
      if (v >= yLo && v <= yHi) gridValues.push(v);
    }
  }

  // X-axis year labels (every 5 years)
  const totalYears = TOTAL_MONTHS / 12;
  const yearLabels: Array<{ month: number; year: number }> = [];
  for (let yr = 0; yr <= totalYears; yr += 5) {
    yearLabels.push({ month: yr * 12, year: START_YEAR + yr });
  }

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Grid lines */}
      {gridValues.map((val, i) => (
        <g key={i}>
          <line
            x1={paddingLeft}
            y1={toY(val)}
            x2={paddingLeft + chartWidth}
            y2={toY(val)}
            stroke="#333"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
          <text
            x={paddingLeft - 10}
            y={toY(val) + 5}
            fill="#888"
            fontSize={22}
            textAnchor="end"
            fontFamily="monospace"
          >
            {formatDollar(val)}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {yearLabels.map(({ month, year }) => (
        <text
          key={year}
          x={toX(Math.min(month, TOTAL_MONTHS - 1))}
          y={paddingTop + chartHeight + 40}
          fill="#888"
          fontSize={22}
          textAnchor="middle"
          fontFamily="monospace"
        >
          {year}
        </text>
      ))}

      {/* Scenario lines */}
      {scenarios.map((scenario, idx) => {
        const pathD = buildPath(scenario.wealthByMonth, revealedMonths);
        if (!pathD) return null;
        return (
          <path
            key={idx}
            d={pathD}
            stroke={scenario.color}
            strokeWidth={3}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        );
      })}

      {/* Chasing labels at line tips: dollar amount above, name below */}
      {revealedMonths > 5 &&
        (() => {
          const fs = 22;
          const minGap = fs * 2 + 4;
          const lastMonth = Math.min(revealedMonths, TOTAL_MONTHS - 1);
          const items = scenarios
            .map((s, idx) => ({ s, idx, v: s.wealthByMonth[lastMonth] }))
            .sort((a, b) => b.v - a.v);
          const positions = items.map(({ v }) => toY(v));
          for (let k = 1; k < positions.length; k++)
            if (positions[k] < positions[k - 1] + minGap)
              positions[k] = positions[k - 1] + minGap;
          for (let k = positions.length - 1; k >= 0; k--)
            if (positions[k] > paddingTop + chartHeight - fs)
              positions[k] = paddingTop + chartHeight - fs;
          const lx = toX(lastMonth) + 8;
          return items.flatMap(({ s, idx }, k) => [
            <text
              key={`${idx}-v`}
              x={lx}
              y={positions[k] - fs * 0.3}
              fill={s.color}
              fontSize={fs}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {formatDollar(s.wealthByMonth[lastMonth])}
            </text>,
            <text
              key={`${idx}-n`}
              x={lx}
              y={positions[k] + fs * 0.9}
              fill={s.color}
              fontSize={fs}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {s.label}
            </text>,
          ]);
        })()}

      {/* Axes borders */}
      <line
        x1={paddingLeft}
        y1={paddingTop}
        x2={paddingLeft}
        y2={paddingTop + chartHeight}
        stroke="#666"
        strokeWidth={2}
      />
      <line
        x1={paddingLeft}
        y1={paddingTop + chartHeight}
        x2={paddingLeft + chartWidth}
        y2={paddingTop + chartHeight}
        stroke="#666"
        strokeWidth={2}
      />
    </svg>
  );
};
