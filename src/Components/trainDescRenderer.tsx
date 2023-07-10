import React from "react";
import { TrainDesc } from "./trainDesc";
import { RawTrainInfo } from "../rawTrainInfo";

export function TrainDescRenderer(props: {
  trainInfos: RawTrainInfo[];
  activeDescs: string[];
}) {
  return props.trainInfos.map((train) => {
    return (
      props.activeDescs.includes(train.train_id) && (
        <TrainDesc train={train} key={train.train_id} />
      )
    );
  });
}
