import React from "react";

interface YearLabelProps {
  revealedMonths: number;
  startYear: number;
  x: number;
  y: number;
}

export const YearLabel: React.FC<YearLabelProps> = ({
  revealedMonths,
  startYear,
  x,
  y,
}) => {
  const year = Math.floor(startYear + revealedMonths / 12);
  const month = (revealedMonths % 12) + 1;
  const monthStr = month.toString().padStart(2, "0");

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      fontSize={48}
      fontFamily="monospace"
      fontWeight="bold"
      textAnchor="middle"
      opacity={0.85}
    >
      {year}/{monthStr}
    </text>
  );
};
