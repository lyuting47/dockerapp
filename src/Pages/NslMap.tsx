import React, { useEffect, useState } from "react";
import { Provider } from "../CustomHooks/provider";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import {
  NslSvgV2,
  locationHeight,
  locationWidth,
} from "../Components/nslSvgV2";
import { TrainSpritesRenderer } from "../Components/trainSpritesRenderer";
import { RawTrainInfo, getTrainById } from "../rawTrainInfo";
import sampleData from "./schematics_json_NSEWL.json";
import Fallback from "../Components/authErrorFallback";

// Filtering sample data
const sampleNslData = sampleData.filter(
  (train) => train.line_code === "NSL" && train.train_id !== "205"
  // && (item.station_code === "WDL" || item.station_code === "ADM")
);

export function NslMap(props: { provider: Provider }) {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [currFrame, setCurrFrame] = useState<RawTrainInfo[]>([]);
  const [jsonIndex, setJsonIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isAuto, setIsAuto] = useState(false);

  // Throws error if there are inconsistencies in login status of user
  useEffect(() => {
    if (isAuthenticated && !instance.getActiveAccount()) {
      throw Error(
        "Something went wrong. Your session might have expired. Please log in again."
      );
    }
  }, [instance, isAuthenticated]);

  // Animation logic here
  useEffect(() => {
    // Simulate processing new data (5 per batch), take last data if there are multiple for one train
    const nextFrame: RawTrainInfo[] = sampleNslData.slice(
      jsonIndex - 5,
      jsonIndex
    );

    // Remove dupicate/outdated info for same train, keep most recent one only
    for (let i = nextFrame.length - 1; i >= 0; i--) {
      for (let j = 0; j < i; j++)
        if (nextFrame[j].station_code === nextFrame[i].station_code) {
          nextFrame.splice(j, 1);
          break;
        }
    }

    for (let i = 0; i < currFrame.length; i++) {
      const train_currFrame = currFrame[i];
      const trainSprite = document.getElementById(train_currFrame.train_id);
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

      // Sort locations
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
        const duration = (1 / numOfNodes) * 1000;
        const delay = duration * i;

        // Add movement animation
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
            duration: duration,
            delay: delay,
            easing: "ease-in-out",
            fill: "forwards",
          }
        );
      }
    }

    // Display next static frame when all animations are complete
    Promise.all(document.getAnimations().map((animation) => animation.finished))
      .then(() => {
        setFrameIndex((idx) => idx + 1);
        setCurrFrame(nextFrame);
        if (isAuto) {
          setJsonIndex((idx) => idx + 5);
        }
      })
      .catch((err) => {
        console.log("Some animations failed to complete.");
        throw err;
      });
  }, [jsonIndex, isAuto]);

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Silent}
      authenticationRequest={loginRequest}
      loadingComponent={() => <h1 className="card-title">Loading...</h1>}
      errorComponent={() => <Fallback provider={props.provider} />}
    >
      <header className="App-header">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <button
            style={{ padding: 5, margin: 30 }}
            onClick={(e) => {
              e.preventDefault();
              // Simulate new incoming data
              setJsonIndex((idx) => idx + 5);
            }}
          >
            Next
          </button>
          <label style={{ padding: 5, margin: 20 }}>
            <input
              type="checkbox"
              onChange={() => setIsAuto((auto) => !auto)}
            />
            Auto?
          </label>
        </div>
        <NslSvgV2 />
        <TrainSpritesRenderer trainInfos={currFrame} frameIndex={frameIndex} />
      </header>
    </MsalAuthenticationTemplate>
  );
}
