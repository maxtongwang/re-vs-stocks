import React from "react";
import { Composition } from "remotion";
import { StocksVsRE } from "./StocksVsRE";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StocksVsRE"
        component={StocksVsRE}
        durationInFrames={1640}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
