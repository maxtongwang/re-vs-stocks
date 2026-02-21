import React from "react";
import { Scenario } from "../data/financialModel";

interface LegendProps {
  scenarios: Scenario[];
  x: number;
  y: number;
}

export const Legend: React.FC<LegendProps> = ({ scenarios, x, y }) => {
  const lineHeight = 36;

  return (
    <g>
      {scenarios.map((s, i) => (
        <g key={i} transform={`translate(${x}, ${y + i * lineHeight})`}>
          <line x1={0} y1={0} x2={40} y2={0} stroke={s.color} strokeWidth={4} />
          <circle cx={20} cy={0} r={5} fill={s.color} />
          <text
            x={52}
            y={6}
            fill={s.color}
            fontSize={22}
            fontFamily="monospace"
            fontWeight="500"
          >
            {s.label}
          </text>
        </g>
      ))}
    </g>
  );
};
