import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import {
  buildScenarios,
  TOTAL_MONTHS,
  START_YEAR,
  END_YEAR,
} from "./data/financialModel";
import { LineChart } from "./components/LineChart";
import { YearLabel } from "./components/YearLabel";

// Animation timing — matches index.html: totalMonths / 30s playthrough
// 30s × 30fps = 900 frames for data reveal
const DATA_START_FRAME = 0;
const DATA_END_FRAME = 900;

export const StocksVsRE: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Show S&P 500, All Cash, 50% Down, 20% Down — match index.html defaults
  const scenarios = useMemo(() => buildScenarios().slice(0, 4), []);

  const dataProgress = interpolate(
    frame,
    [DATA_START_FRAME, DATA_END_FRAME],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const revealedMonths = Math.floor(dataProgress * TOTAL_MONTHS);

  const outroOpacity = interpolate(
    frame,
    [DATA_END_FRAME + 60, DATA_END_FRAME + 120],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chartPaddingLeft = 160;
  const chartPaddingRight = 180; // room for chasing labels
  const chartPaddingTop = 230;
  const chartPaddingBottom = 80;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#0f0f0f",
        position: "relative",
        overflow: "hidden",
        fontFamily: "monospace",
      }}
    >
      {/* Main chart layer */}
      <div style={{ opacity: outroOpacity, position: "absolute", inset: 0 }}>
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Title */}
          <text
            x={width / 2}
            y={52}
            fill="#ffffff"
            fontSize={42}
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
            opacity={titleOpacity}
          >
            The Last Chart To Understand
          </text>
          <text
            x={width / 2}
            y={100}
            fill="#ffffff"
            fontSize={42}
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
            opacity={titleOpacity}
          >
            Real Estate vs Stock Market
          </text>
          <text
            x={width / 2}
            y={136}
            fill="#aaaaaa"
            fontSize={22}
            fontFamily="monospace"
            textAnchor="middle"
            opacity={titleOpacity}
          >
            $100K · CA Real Estate vs S&P 500 · {START_YEAR}–{END_YEAR} · log
            scale
          </text>

          {/* Chart */}
          <LineChart
            scenarios={scenarios}
            progress={dataProgress}
            width={width}
            height={height - 60}
            paddingLeft={chartPaddingLeft}
            paddingRight={chartPaddingRight}
            paddingTop={chartPaddingTop}
            paddingBottom={chartPaddingBottom}
          />

          {/* Year/month counter */}
          {revealedMonths > 0 && (
            <YearLabel
              revealedMonths={revealedMonths}
              startYear={START_YEAR}
              x={width / 2}
              y={height - 20}
            />
          )}

          {/* Live URL */}
          <text
            x={width / 2}
            y={148}
            fill="#4da6ff"
            fontSize={20}
            fontFamily="monospace"
            textAnchor="middle"
            opacity={titleOpacity}
          >
            maxtongwang.github.io/re-vs-stocks
          </text>

          {/* Methodology — above chart, below subtitle */}
          {[
            `Assumptions: $100K invested Jan ${START_YEAR} · CA real estate (FHFA HPI) · S&P 500 total return (price + dividends reinvested)`,
            `8.5% fixed 30yr mortgage · 12% initial gross rent yield (1970 CA) · Prop 13: 1.25% tax, +2%/yr cap`,
            `Depreciation shield: 27.5yr straight-line · 44% marginal tax rate · maintenance + insurance modeled annually`,
          ].map((line, i) => (
            <text
              key={i}
              x={width / 2}
              y={172 + i * 18}
              fill="#555"
              fontSize={16}
              fontFamily="monospace"
              textAnchor="middle"
              opacity={titleOpacity}
            >
              {line}
            </text>
          ))}
        </svg>
      </div>

      {/* Outro card */}
      {frame > DATA_END_FRAME + 30 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(
              frame,
              [DATA_END_FRAME + 30, DATA_END_FRAME + 90],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: 52,
              fontWeight: "bold",
              fontFamily: "monospace",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            S&P 500 vs CA Real Estate
          </div>
          <div
            style={{
              color: "#aaaaaa",
              fontSize: 28,
              fontFamily: "monospace",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            {END_YEAR - START_YEAR}-year simulation ({START_YEAR}–{END_YEAR})
            <br />
            $100K initial investment · all scenarios
          </div>
          <div
            style={{
              color: "#666",
              fontSize: 20,
              fontFamily: "monospace",
              marginTop: 40,
              textAlign: "center",
            }}
          >
            8.5% fixed rate (1970) · 12% initial rent yield · Prop 13 tax base
            <br />
            Depreciation tax savings included · Total return with dividends
          </div>
        </div>
      )}
    </div>
  );
};
