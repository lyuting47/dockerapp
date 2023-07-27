import React from "react";
import { RawTrainInfo } from "../../RawTrainInfo";
import {
  LOCATION_WIDTH,
  TRAIN_WIDTH,
  TRAIN_HEIGHT,
} from "./animationConstants";

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
        width: TRAIN_WIDTH,
        left: `${
          location.getBoundingClientRect().x +
          window.scrollX -
          (TRAIN_WIDTH - LOCATION_WIDTH) / 2
        }px`,
        top: `${
          location.getBoundingClientRect().y + window.scrollY - 2 * TRAIN_HEIGHT
        }px`,
      }}
    >
      <p>Opened</p>
    </div>
  );
}
