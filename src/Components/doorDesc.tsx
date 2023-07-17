import React from "react";
import { RawTrainInfo } from "../rawTrainInfo";
import { locationWidth, trainWidth, trainHeight } from "./animationConstants";

export function DoorDesc(props: { train: RawTrainInfo }) {
  if (props.train.platform_code === null) {
    throw Error(`Invalid platform code at ${props.train.station_code}`);
  }
  const locations = Array.from(
    document.getElementsByClassName(
      props.train.station_code + "_" + props.train.platform_code
    )
  );
  if (locations.length === 0) {
    throw Error(
      `Location not found in SVG: ${props.train.station_code}` +
        "_" +
        props.train.platform_code
    );
  }
  locations.sort((a, b) => (a.id < b.id ? -1 : a > b ? 1 : 0));
  const location = locations[locations.length - 1];
  return (
    <div
      className="DoorDesc"
      id={`door_${props.train.station_code}_${props.train.platform_code}`}
      style={{
        width: trainWidth,
        left: `${
          location.getBoundingClientRect().x +
          window.scrollX -
          (trainWidth - locationWidth) / 2
        }px`,
        top: `${
          location.getBoundingClientRect().y + window.scrollY - 2 * trainHeight
        }px`,
      }}
    >
      <p>Opened</p>
    </div>
  );
}
