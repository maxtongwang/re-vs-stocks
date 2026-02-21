import React from "react";
// remotion imported for potential future use
import { Scenario } from "../data/financialModel";

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
  const totalMonths = 360;
  const revealedMonths = Math.floor(progress * totalMonths);

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Dynamic Y scale: find min/max across all scenarios up to revealedMonths
  let yMin = 0;
  let yMax = 200_000;

  for (const s of scenarios) {
    for (let m = 0; m <= revealedMonths && m < s.wealthByMonth.length; m++) {
      const v = s.wealthByMonth[m];
      if (v < yMin) yMin = v;
      if (v > yMax) yMax = v;
    }
  }

  // Add 10% padding to y range
  const yRange = yMax - yMin;
  const yMinPadded = yMin - yRange * 0.05;
  const yMaxPadded = yMax + yRange * 0.08;

  const toX = (monthIndex: number) =>
    paddingLeft + (monthIndex / (totalMonths - 1)) * chartWidth;

  const toY = (value: number) =>
    paddingTop +
    ((yMaxPadded - value) / (yMaxPadded - yMinPadded)) * chartHeight;

  // Build SVG path for each scenario
  const buildPath = (data: number[], upTo: number): string => {
    if (upTo < 1) return "";
    let d = `M ${toX(0)} ${toY(data[0])}`;
    for (let m = 1; m <= upTo && m < data.length; m++) {
      d += ` L ${toX(m)} ${toY(data[m])}`;
    }
    return d;
  };

  // Y-axis grid lines
  const numGridLines = 6;
  const gridValues: number[] = [];
  for (let i = 0; i <= numGridLines; i++) {
    gridValues.push(
      yMinPadded + ((yMaxPadded - yMinPadded) * i) / numGridLines,
    );
  }

  // X-axis year labels (every 5 years = 60 months)
  const yearLabels: Array<{ month: number; year: number }> = [];
  for (let yr = 0; yr <= 30; yr += 5) {
    yearLabels.push({ month: yr * 12, year: 1994 + yr });
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

      {/* Zero line (if in view) */}
      {yMinPadded < 0 && yMaxPadded > 0 && (
        <line
          x1={paddingLeft}
          y1={toY(0)}
          x2={paddingLeft + chartWidth}
          y2={toY(0)}
          stroke="#555"
          strokeWidth={2}
        />
      )}

      {/* X-axis labels */}
      {yearLabels.map(({ month, year }) => (
        <text
          key={year}
          x={toX(Math.min(month, totalMonths - 1))}
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

        const lastMonth = Math.min(
          revealedMonths,
          scenario.wealthByMonth.length - 1,
        );
        const lastValue = scenario.wealthByMonth[lastMonth];
        const labelX = toX(lastMonth) + 8;
        const labelY = toY(lastValue);

        return (
          <g key={idx}>
            <path
              d={pathD}
              stroke={scenario.color}
              strokeWidth={3}
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Floating label at line tip */}
            {revealedMonths > 5 && (
              <g>
                <circle
                  cx={toX(lastMonth)}
                  cy={toY(lastValue)}
                  r={5}
                  fill={scenario.color}
                />
                <text
                  x={labelX}
                  y={labelY + 5}
                  fill={scenario.color}
                  fontSize={20}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {formatDollar(lastValue)}
                </text>
              </g>
            )}
          </g>
        );
      })}

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
