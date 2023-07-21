import React from "react";
import { RawTrainInfo } from "../../RawTrainInfo";
import { DoorDesc } from "./doorDesc";

export function DoorSpritesRenderer(props: {
  trainInfos: RawTrainInfo[];
  frameIndex: number;
}) {
  // Remove dupicate/outdated info for same station and platform, keep most recent one only
  function getUniqueListBy<T>(arr: T[], keys: (keyof T)[]): T[] {
    const kvArray: [string, T][] = arr.map((item) => {
      const compoundKey = keys.map((key) => item[key]).join("_");
      return [compoundKey, item];
    });
    return Array.from(new Map(kvArray).values());
  }

  const filteredTrainInfos = getUniqueListBy(props.trainInfos, [
    "station_code",
    "platform_code",
  ]);

  return filteredTrainInfos.map((train) => {
    if (train.status !== "OPENED" || train.platform_code === null) {
      return;
    }
    return (
      <DoorDesc
        train={train}
        key={`${train.station_code}_${train.platform_code}_${props.frameIndex}`}
      />
    );
  });
}
