import React, { useState } from "react";
import { TrainSvg } from "./trainSvg";
import { RawTrainInfo } from "../../RawTrainInfo";
import {
  LOCATION_WIDTH,
  LOCATION_HEIGHT,
  TRAIN_HEIGHT,
  TRAIN_WIDTH,
} from "./animationConstants";
import { TrainDesc } from "./trainDesc";

export function TrainSpritesRenderer(props: {
  trainInfos: RawTrainInfo[];
  frameIndex: number;
}) {
  const [activeDescs, setActiveDescs] = useState<string[]>([]);

  return (
    <>
      {props.trainInfos.map((train) => {
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
            key={`${train.train_id}_${props.frameIndex}`}
            id={train.train_id}
            onClick={() =>
              setActiveDescs((descs) => {
                if (descs.includes(train.train_id)) {
                  return descs.filter((id) => id !== train.train_id);
                } else {
                  return descs.concat(train.train_id);
                }
              })
            }
            style={{
              left: `${
                location.getBoundingClientRect().x +
                window.scrollX -
                (TRAIN_WIDTH - LOCATION_WIDTH) / 2
              }px`,
              top: `${
                location.getBoundingClientRect().y +
                window.scrollY -
                (TRAIN_HEIGHT - LOCATION_HEIGHT) / 2
              }px`,
              rotate: location.getAttribute("data-angle") ?? "0deg",
              backgroundColor:
                train.status === "OPENED"
                  ? rootStyle.getPropertyValue("--open-color")
                  : rootStyle.getPropertyValue("--close-color"),
            }}
          />
        );
      })}
      {props.trainInfos.map((train) => {
        return (
          activeDescs.includes(train.train_id) && (
            <TrainDesc
              train={train}
              key={train.train_id + props.frameIndex.toString()}
            />
          )
        );
      })}
    </>
  );
}
