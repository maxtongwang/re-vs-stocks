import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { buildScenarios } from "./data/financialModel";
import { LineChart } from "./components/LineChart";
import { Legend } from "./components/Legend";
import { YearLabel } from "./components/YearLabel";

// Animation timing
const DATA_START_FRAME = 30; // brief hold before data starts
const DATA_END_FRAME = 780; // frame when all 360 months are revealed
const TOTAL_MONTHS = 360;

export const StocksVsRE: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const scenarios = useMemo(() => buildScenarios(), []);

  // Data reveal progress: 0 to 1 mapping frames DATA_START_FRAME→DATA_END_FRAME
  const dataProgress = interpolate(
    frame,
    [DATA_START_FRAME, DATA_END_FRAME],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const revealedMonths = Math.floor(dataProgress * TOTAL_MONTHS);

  // Outro fade
  const outroOpacity = interpolate(
    frame,
    [DATA_END_FRAME + 60, DATA_END_FRAME + 120],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chartPaddingLeft = 160;
  const chartPaddingRight = 220;
  const chartPaddingTop = 120;
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
      {/* Main chart SVG layer */}
      <div style={{ opacity: outroOpacity, position: "absolute", inset: 0 }}>
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Title */}
          <text
            x={width / 2}
            y={60}
            fill="#ffffff"
            fontSize={38}
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
            opacity={titleOpacity}
          >
            $100K Invested: S&P 500 vs CA Real Estate (1994–2024)
          </text>

          <text
            x={width / 2}
            y={96}
            fill="#aaaaaa"
            fontSize={22}
            fontFamily="monospace"
            textAnchor="middle"
            opacity={titleOpacity}
          >
            5 leverage scenarios • 8.5% mortgage • rent income + depreciation
            tax benefits
          </text>

          {/* Chart */}
          <LineChart
            scenarios={scenarios}
            progress={dataProgress}
            width={width - 240}
            height={height - 80}
            paddingLeft={chartPaddingLeft}
            paddingRight={chartPaddingRight}
            paddingTop={chartPaddingTop}
            paddingBottom={chartPaddingBottom}
          />

          {/* Legend - positioned top right */}
          <Legend scenarios={scenarios} x={width - 230} y={130} />

          {/* Year/month counter */}
          {revealedMonths > 0 && (
            <YearLabel
              revealedMonths={revealedMonths}
              x={width / 2}
              y={height - 20}
            />
          )}

          {/* Y-axis label */}
          <text
            x={30}
            y={height / 2}
            fill="#888"
            fontSize={22}
            fontFamily="monospace"
            textAnchor="middle"
            transform={`rotate(-90, 30, ${height / 2})`}
          >
            Total Wealth (Equity + Net Cash Flows)
          </text>
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
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
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
            30-year simulation (1994–2024)
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
            Assumes 8.5% fixed rate · 6% rent yield · 4%/yr rent growth
            <br />
            Depreciation tax savings included · Price returns only (no
            dividends)
          </div>
        </div>
      )}
    </div>
  );
};
