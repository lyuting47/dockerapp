import { useEffect, useRef, useState } from "react";
import { useVisibilityListener } from "./useVisibilityListener";
import {
  locationHeight,
  locationWidth,
} from "../Components/Animation/animationConstants";
import { RawTrainInfo, getTrainById } from "../RawTrainInfo";

function getUniqueListBy<T>(arr: T[], keys: (keyof T)[]): T[] {
  const kvArray: [string, T][] = arr.map((item) => {
    const compoundAttr = keys.map((key) => item[key]).join("_");
    return [compoundAttr, item];
  });
  return Array.from(new Map(kvArray).values());
}

export function useWsCacheAnimator(
  wsUrl: string,
  topic: string,
  animationDuration: number
) {
  // To get around issue of stale useState in msgListener: https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state
  const [frameIndex, _setFrameIndex] = useState(-1);
  const frameIndexRef = useRef(-1);
  const setFrameIndex = (idx: number) => {
    frameIndexRef.current = idx;
    _setFrameIndex(idx);
  };
  const [currFrame, _setCurrFrame] = useState<RawTrainInfo[]>([]);
  const currFrameRef = useRef<RawTrainInfo[]>([]);
  const setCurrFrame = (frame: RawTrainInfo[]) => {
    currFrameRef.current = frame;
    _setCurrFrame(frame);
  };
  const ws = useRef<WebSocket | null>(null);
  // For storing data received from websocket but not processed yet
  const backlogQueue = useRef<RawTrainInfo[][]>([]);
  const isCaughtUp = useRef(true);

  // Listener to get data from websocket messages
  const msgListener = (event: MessageEvent) => {
    console.log("Received " + (event.data as string));
    backlogQueue.current.push(
      JSON.parse(event.data as string) as RawTrainInfo[]
    );
    if (isCaughtUp.current) {
      setFrameIndex(frameIndexRef.current + 1);
      isCaughtUp.current = false;
    }
  };

  // Set up websocket and listener on first render
  useEffect(() => {
    ws.current = new WebSocket(wsUrl);
    ws.current.onopen = (_event) => {
      if (ws.current === null || ws.current.readyState >= 2) {
        return;
      }
      ws.current.send(JSON.stringify({ topic: topic }));
    };
    ws.current.onmessage = (_event) => {
      if (ws.current === null || ws.current.readyState >= 2) {
        return;
      }
      ws.current.onmessage = msgListener;
    };

    // Cleanup listener and close websocket on de-render
    return () => {
      if (ws.current === null || ws.current.readyState >= 2) {
        return;
      }
      ws.current.removeEventListener("message", msgListener);
      ws.current.onclose = (_event) => console.log("Websocket closed.");
      ws.current.close();
    };
  }, []);

  // Ensures data is updated even though animation is not played when tab is hidden/minimized
  useVisibilityListener();

  // Main animation logic
  useEffect(() => {
    if (frameIndexRef.current < 0 || backlogQueue.current.length === 0) {
      return;
    }
    // Process new data: remove dupicate/outdated info for same train, keep most recent one only
    let nextFrame: RawTrainInfo[] = backlogQueue.current.shift()!;
    nextFrame = getUniqueListBy(nextFrame, ["train_id"]);

    // If tab is hidden, do not start animations, only process static frames and continue
    if (document.visibilityState === "hidden") {
      for (let i = 0; i < currFrameRef.current.length; i++) {
        const train_currFrame = currFrameRef.current[i];
        // If no new info on this train in next frame, persist this train's current state.
        const train_nextFrame = getTrainById(
          nextFrame,
          train_currFrame.train_id
        );
        if (train_nextFrame === null) {
          nextFrame.push(train_currFrame);
          continue;
        }
      }
      setFrameIndex(frameIndexRef.current + 1);
      setCurrFrame(nextFrame);
      if (backlogQueue.current.length === 0) {
        isCaughtUp.current = true;
      }
      return;
    }

    // Start processing animations
    console.log(
      "Starting animations for frame " + frameIndexRef.current.toString()
    );

    for (let i = 0; i < currFrameRef.current.length; i++) {
      const train_currFrame = currFrameRef.current[i];
      const trainSprite = document.getElementById(train_currFrame.train_id);
      const trainDesc = document.getElementById(
        `desc_${train_currFrame.train_id}`
      );
      if (trainSprite === null) {
        console.log("Error locating train id: " + train_currFrame.train_id);
        continue;
      }

      // If no new info on this train in next frame, persist this train's current state.
      const train_nextFrame = getTrainById(nextFrame, train_currFrame.train_id);
      if (train_nextFrame === null) {
        nextFrame.push(train_currFrame);
        continue;
      }
      // If position remains the same in next frame, no need to animate anything
      if (
        train_nextFrame.station_code === train_currFrame.station_code &&
        train_nextFrame.platform_code === train_currFrame.platform_code
      ) {
        continue;
      }

      // Find location(s) to move train along
      const locations = Array.from(
        document.getElementsByClassName(
          train_nextFrame.station_code +
            "_" +
            (train_nextFrame.platform_code ?? train_nextFrame.next_station_code)
        )
      );
      const numOfNodes = locations.length;
      if (numOfNodes === 0) {
        console.log(
          "Error processing next station code " +
            train_nextFrame.station_code +
            "_" +
            (train_nextFrame.platform_code ??
              train_nextFrame.next_station_code) +
            " of train id: " +
            train_currFrame.train_id
        );
        continue;
      }

      locations.sort((a, b) => (a.id < b.id ? -1 : a > b ? 1 : 0));

      for (let i = 0; i < numOfNodes; i++) {
        const location = locations[i];

        // Calculate distance and duration to move the train sprite by
        const curr_left =
          trainSprite.getBoundingClientRect().x + window.scrollX;
        const curr_top = trainSprite.getBoundingClientRect().y + window.scrollY;
        const location_left =
          location.getBoundingClientRect().x +
          window.scrollX -
          (trainSprite.getBoundingClientRect().right -
            trainSprite.getBoundingClientRect().left -
            locationWidth) /
            2;
        const location_top =
          location.getBoundingClientRect().y +
          window.scrollY -
          (trainSprite.getBoundingClientRect().bottom -
            trainSprite.getBoundingClientRect().top -
            locationHeight) /
            2;
        const durationPerNode = animationDuration / numOfNodes;
        const delay = durationPerNode * i;

        // Add movement animation for train sprite
        trainSprite.animate(
          [
            {},
            {
              translate:
                `${location_left - curr_left}px` +
                " " +
                `${location_top - curr_top}px`,
              rotate: location.getAttribute("data-angle") ?? "0deg",
            },
          ],
          {
            duration: durationPerNode,
            delay: delay,
            easing: "ease-in-out",
            fill: "forwards",
          }
        );

        // Add movement animation for train description if any
        if (trainDesc !== null) {
          trainDesc.animate(
            [
              {},
              {
                translate:
                  `${location_left - curr_left}px` +
                  " " +
                  `${location_top - curr_top}px`,
              },
            ],
            {
              duration: durationPerNode,
              delay: delay,
              easing: "ease-in-out",
              fill: "forwards",
            }
          );
        }
      }
    }

    // Remove dupicate/outdated info for same station and platform, keep most recent one only
    const nextFrameDoorInfos = getUniqueListBy(
      nextFrame.filter((train) => train.platform_code !== null),
      ["station_code", "platform_code"]
    );
    const nextFrameDoorIds = new Map(
      nextFrameDoorInfos.map((train) => [
        `door_${train.station_code}_${train.platform_code}`,
        train.status,
      ])
    );

    // Animate fading-out of door sprites which are going to become closed
    const currDoorSprites = document.getElementsByClassName("DoorDesc");
    for (let i = 0; i < currDoorSprites.length; i++) {
      const doorSprite = currDoorSprites[i];
      if (nextFrameDoorIds.get(doorSprite.id) === "OPENED") {
        continue;
      }
      doorSprite.animate(
        [
          {},
          {
            opacity: "0%",
          },
        ],
        {
          duration: animationDuration,
          easing: "linear",
          fill: "forwards",
        }
      );
    }

    // Display next static frame when all animations are complete/cancelled
    Promise.all(document.getAnimations().map((animation) => animation.finished))
      .then(() => {
        console.log(
          "Animations completed for frame " + frameIndexRef.current.toString()
        );
      })
      .catch((err) => {
        console.log("Some animations failed to complete: " + err.message);
      })
      .finally(() => {
        setFrameIndex(frameIndexRef.current + 1);
        setCurrFrame(nextFrame);
        if (backlogQueue.current.length === 0) {
          isCaughtUp.current = true;
          return;
        }
      });
  }, [frameIndex]);

  return { currFrame, frameIndex };
}
