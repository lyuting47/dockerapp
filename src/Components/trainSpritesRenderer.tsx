import React from "react";
import { TrainSvg, trainHeight, trainWidth } from "./trainSvg";
import { RawTrainInfo } from "../rawTrainInfo";
import { locationWidth, locationHeight } from "./nslSvgV2";

export function TrainSpritesRenderer(props: {
  trainInfos: RawTrainInfo[];
  frameIndex: number;
}) {
  return props.trainInfos.map((train) => {
    const locations = Array.from(
      document.getElementsByClassName(
        train.station_code +
          "_" +
          (train.platform_code ?? train.next_station_code)
      )
    );
    if (locations.length === 0) {
      throw Error(
        `Location not found in SVG: ${train.station_code}` +
          "_" +
          `${train.platform_code ?? train.next_station_code}`
      );
    }
    locations.sort((a, b) => (a.id < b.id ? -1 : a > b ? 1 : 0));
    const location = locations[locations.length - 1];

    const root = document.querySelector(":root");
    if (root === null) {
      throw Error("CSS root not found");
    }
    const rootStyle = getComputedStyle(root);
    return (
      <TrainSvg
        key={train.train_id + props.frameIndex.toString()}
        id={train.train_id}
        style={{
          position: "absolute",
          left: `${
            location.getBoundingClientRect().x +
            window.scrollX -
            (trainWidth - locationWidth) / 2
          }px`,
          top: `${
            location.getBoundingClientRect().y +
            window.scrollY -
            (trainHeight - locationHeight) / 2
          }px`,
          rotate: location.getAttribute("data-angle") ?? "0deg",
          backgroundColor:
            train.status === "OPENED"
              ? rootStyle.getPropertyValue("--open-color")
              : rootStyle.getPropertyValue("--close-color"),
        }}
      />
    );
  });
}
