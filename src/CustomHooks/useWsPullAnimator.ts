import { useEffect, useRef, useState } from "react";
import { useVisibilityListener } from "./useVisibilityListener";
import {
  locationHeight,
  locationWidth,
} from "../Components/Animation/animationConstants";
import { RawTrainInfo, getTrainById } from "../RawTrainInfo";
import { useWindowSizeListener } from "./useWindowSizeListener";

function getUniqueListBy<T>(arr: T[], keys: (keyof T)[]): T[] {
  const kvArray: [string, T][] = arr.map((item) => {
    const compoundAttr = keys.map((key) => item[key]).join("|");
    return [compoundAttr, item];
  });
  return Array.from(new Map(kvArray).values());
}

export function useWsPullAnimator(
  wsUrl: string,
  topic: string,
  animationDuration: number
) {
  // To get around issue of stale useState in msgListener: https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state
  const [frameIndex, _setFrameIndex] = useState(0);
  const frameIndexRef = useRef(0);
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

  const msgListener = (event: MessageEvent) => {
    console.log("Received " + (event.data as string));

    // Process new data: remove dupicate/outdated info for same train, keep most recent one only
    let nextFrame = JSON.parse(event.data as string) as RawTrainInfo[];
    nextFrame = getUniqueListBy(nextFrame, ["train_id"]);

    // If tab is hidden, do not start animations, only process static frames and continue
    if (document.visibilityState === "hidden") {
      for (let i = 0; i < currFrameRef.current.length; i++) {
        const trainCurrFrame = currFrameRef.current[i];
        // If no new info on this train in next frame, persist this train's current state.
        const train_nextFrame = getTrainById(
          nextFrame,
          trainCurrFrame.train_id
        );
        if (train_nextFrame === null) {
          nextFrame.push(trainCurrFrame);
          continue;
        }
      }
      setFrameIndex(frameIndexRef.current + 1);
      setCurrFrame(nextFrame);
      if (ws.current === null || ws.current.readyState >= 2) {
        return;
      }
      ws.current.send(JSON.stringify({ request: "Next event" }));
      return;
    }

    // Start processing animations
    console.log(
      "Starting animations for frame " + frameIndexRef.current.toString()
    );

    for (let i = 0; i < currFrameRef.current.length; i++) {
      const trainCurrFrame = currFrameRef.current[i];

      // If no new info on this train in next frame, persist this train's current state.
      const trainNextFrame = getTrainById(nextFrame, trainCurrFrame.train_id);
      if (trainNextFrame === null) {
        nextFrame.push(trainCurrFrame);
        continue;
      }
      // If position remains the same in next frame, no need to animate anything
      if (
        trainNextFrame.station_code === trainCurrFrame.station_code &&
        trainNextFrame.platform_code === trainCurrFrame.platform_code
      ) {
        continue;
      }

      // Find location(s) to move train along
      const locations = Array.from(
        document.getElementsByClassName(
          trainNextFrame.station_code +
            "_" +
            (trainNextFrame.platform_code ?? trainNextFrame.next_station_code)
        )
      );
      const numOfNodes = locations.length;
      if (numOfNodes === 0) {
        console.log(
          "Error processing next station code " +
            trainNextFrame.station_code +
            "_" +
            (trainNextFrame.platform_code ?? trainNextFrame.next_station_code) +
            " of train id: " +
            trainCurrFrame.train_id
        );
        continue;
      }

      locations.sort((a, b) => (a.id < b.id ? -1 : a > b ? 1 : 0));

      // Get actual sprites and attach animations
      const trainSprite = document.getElementById(trainCurrFrame.train_id);
      const trainDesc = document.getElementById(
        `desc_${trainCurrFrame.train_id}`
      );
      if (trainSprite === null) {
        console.log("Error locating train id: " + trainCurrFrame.train_id);
        continue;
      }
      for (let i = 0; i < numOfNodes; i++) {
        const location = locations[i];

        // Calculate distance and duration to move the sprite by
        const trainRect = trainSprite.getBoundingClientRect();
        const locationRect = location.getBoundingClientRect();
        const currLeft = trainRect.x + window.scrollX;
        const currTop = trainRect.y + window.scrollY;
        const locationLeft =
          locationRect.x +
          window.scrollX -
          (trainRect.right - trainRect.left - locationWidth) / 2;
        const locationTop =
          locationRect.y +
          window.scrollY -
          (trainRect.bottom - trainRect.top - locationHeight) / 2;
        const durationPerNode = animationDuration / numOfNodes;
        const delay = durationPerNode * i;

        // Add movement animation for train sprite
        trainSprite.animate(
          [
            {},
            {
              translate:
                `${locationLeft - currLeft}px` +
                " " +
                `${locationTop - currTop}px`,
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
                  `${locationLeft - currLeft}px` +
                  " " +
                  `${locationTop - currTop}px`,
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

    // Animate fading of door sprites which are going to become closed
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
      });
  };

  // After frame is updated, request for next event
  useEffect(() => {
    if (ws.current === null || ws.current.readyState >= 2) {
      return;
    }
    ws.current.send(JSON.stringify({ request: "Next event" }));
  }, [currFrame]);

  useEffect(() => {
    ws.current = new WebSocket(wsUrl);
    ws.current.onopen = (_event) => {
      if (ws.current === null || ws.current.readyState >= 2) {
        return;
      }
      ws.current.send(JSON.stringify({ topic: topic }));
    };
    ws.current.onmessage = (event) => {
      if (ws.current === null || ws.current.readyState >= 2) {
        return;
      }
      if ((event.data as string) === "Ready") {
        ws.current.onmessage = msgListener;
        ws.current.send(JSON.stringify({ request: "Next event" }));
      } else {
        throw Error(
          "Unexpected first message from websocket" + event.data.toString()
        );
      }
    };

    // Cleanup listeners and close websocket on de-render
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
  // Ensures images are rendered properly when window is resized
  useWindowSizeListener();

  return { currFrame, frameIndex };
}
