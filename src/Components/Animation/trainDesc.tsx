import React from "react";
import { RawTrainInfo } from "../../RawTrainInfo";
import {
  locationWidth,
  locationHeight,
  trainWidth,
  trainHeight,
} from "./animationConstants";

export function TrainDesc(props: { train: RawTrainInfo }) {
  const locations = Array.from(
    document.getElementsByClassName(
      props.train.station_code +
        "_" +
        (props.train.platform_code ?? props.train.next_station_code)
    )
  );
  if (locations.length === 0) {
    throw Error(
      `Location not found in SVG: ${props.train.station_code}` +
        "_" +
        `${props.train.platform_code ?? props.train.next_station_code}`
    );
  }
  locations.sort((a, b) => (a.id < b.id ? -1 : a > b ? 1 : 0));
  const location = locations[locations.length - 1];
  return (
    <div
      className="TrainDesc"
      id={`desc_${props.train.train_id}`}
      style={{
        width: trainWidth,
        left: `${
          location.getBoundingClientRect().x +
          window.scrollX -
          (trainWidth - locationWidth) / 2
        }px`,
        top: `${
          location.getBoundingClientRect().y +
          window.scrollY +
          (trainHeight + locationHeight) / 2
        }px`,
      }}
    >
      <p>{props.train.train_id}</p>
      <p>
        {props.train.station_code +
          "_" +
          (props.train.platform_code ?? props.train.next_station_code)}
      </p>
    </div>
  );
}
