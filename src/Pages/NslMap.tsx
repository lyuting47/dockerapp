import React, { useEffect, useState } from "react";
import { Provider } from "../CustomHooks/provider";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import NslSvgV2 from "../Components/nslSvgV2";
import Train from "../Components/trainSvg";
import { RawTrainInfo, getTrainById } from "../rawTrainInfo";
import sampleData from "./schematics_json_NSEWL.json";
import Fallback from "../Components/authErrorFallback";

// Filtering some bad data
const sampleNslData = sampleData.filter(
  (item) => item.line_code === "NSL" && item.train_id !== "205"
);

const adjustX = (x: number) => x - 11;
const adjustY = (y: number) => y - 11;

export function NslMap(props: { provider: Provider }) {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [currFrame, setCurrFrame] = useState<RawTrainInfo[]>([]);
  const [page, setPage] = useState(0);

  // Logs user out if there are inconsistencies in login status of user across tabs
  useEffect(() => {
    if (isAuthenticated && !instance.getActiveAccount()) {
      throw Error(
        "Something went wrong. Your session might have expired. Please log in again."
      );
    }
  }, [instance, isAuthenticated]);

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Silent}
      authenticationRequest={loginRequest}
      loadingComponent={() => <h1 className="card-title">Loading...</h1>}
      errorComponent={() => <Fallback provider={props.provider}></Fallback>}
    >
      <header className="App-header">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            // Simulating new incoming data and remove any duplicates(?)
            setPage((val) => val + 5);
            const nextFrame: RawTrainInfo[] = sampleNslData.slice(
              page,
              page + 5
            );
            for (let i = nextFrame.length - 1; i >= 0; i--) {
              for (let j = 0; j < i; j++)
                if (nextFrame[j].station_code === nextFrame[i].station_code) {
                  nextFrame.splice(j, 1);
                  break;
                }
            }

            for (let i = 0; i < currFrame.length; i++) {
              const train_currFrame = currFrame[i];
              const trainSprite = document.getElementById(
                train_currFrame.train_id
              );
              if (trainSprite === null) {
                console.log(
                  "Error locating train id: " + train_currFrame.train_id
                );
                continue;
              }

              // If no new info in next frame, persist the train's current state.
              const train_nextFrame = getTrainById(
                nextFrame,
                train_currFrame.train_id
              );
              if (train_nextFrame === null) {
                nextFrame.push(train_currFrame);
                continue;
              }
              // If position remains the same in next frame, ignore
              if (
                train_nextFrame.station_code === train_currFrame.station_code &&
                train_nextFrame.platform_code === train_currFrame.platform_code
              ) {
                continue;
              }

              // Find location(s) to move train along
              const locations = Array.from(
                document.getElementsByClassName(
                  `${train_nextFrame.station_code}_${
                    train_nextFrame.platform_code ??
                    train_nextFrame.next_station_code
                  }`
                )
              );

              const numOfNodes = locations.length;
              if (numOfNodes === 0) {
                console.log(
                  "Error processing next station code " +
                    train_nextFrame.station_code +
                    train_nextFrame.platform_code ??
                    train_nextFrame.next_station_code +
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
                const curr_top =
                  trainSprite.getBoundingClientRect().y + window.scrollY;
                const location_left = adjustX(
                  location.getBoundingClientRect().x + window.scrollX
                );
                const location_top = adjustY(
                  location.getBoundingClientRect().y + window.scrollY
                );
                const duration = (1 / numOfNodes) * 1000;
                const delay = duration * i;

                // Add movement animation
                trainSprite.animate(
                  [
                    {},
                    {
                      translate: `${location_left - curr_left}px ${
                        location_top - curr_top
                      }px`,
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

              // Fix position and reset animations when done
              Promise.all(
                trainSprite
                  .getAnimations()
                  .map((animation) => animation.finished)
              ).then(() => {
                const curr_left =
                  trainSprite.getBoundingClientRect().x + window.scrollX;
                const curr_top =
                  trainSprite.getBoundingClientRect().y + window.scrollY;
                trainSprite.style.setProperty(
                  "left",
                  curr_left.toString() + "px"
                );
                trainSprite.style.setProperty(
                  "top",
                  curr_top.toString() + "px"
                );
                trainSprite.animate(
                  [
                    {},
                    {
                      translate: "0px 0px",
                    },
                  ],
                  {
                    duration: 0,
                    fill: "forwards",
                  }
                );
              });
            }

            // Display next static frame
            setTimeout(() => {
              setCurrFrame(nextFrame);
            }, 1200);
          }}
        >
          <button type="submit">Next</button>
        </form>
        <hr />
        <NslSvgV2 />
        {currFrame.map((item) => {
          const locations = Array.from(
            document.getElementsByClassName(
              `${item.station_code}_${
                item.platform_code ?? item.next_station_code
              }`
            )
          );
          if (locations.length === 0) {
            throw Error(
              `Location not found in SVG: ${item.station_code}_${
                item.platform_code ?? item.next_station_code
              }`
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
            <Train
              key={item.train_id}
              id={item.train_id}
              style={{
                position: "absolute",
                left:
                  adjustX(
                    location.getBoundingClientRect().x + window.scrollX
                  ).toString() + "px",
                top:
                  adjustY(
                    location.getBoundingClientRect().y + window.scrollY
                  ).toString() + "px",
                filter:
                  item.status === "OPENED"
                    ? rootStyle.getPropertyValue("--open-color")
                    : rootStyle.getPropertyValue("--close-color"),
              }}
            />
          );
        })}
      </header>
    </MsalAuthenticationTemplate>
  );
}
