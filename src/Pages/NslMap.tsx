import React, { useEffect, useState } from "react";
import { Provider } from "../CustomHooks/provider";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import LoginButton from "../Components/login";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import NslSvg from "../Components/nslSvg";
import Train from "../Components/trainSvg";
import { RawTrainInfo, getTrainById } from "../rawTrainInfo";
import sampleData from "./schematics_json_NSEWL.json";

// Filtering some bad data
const sampleNslData = sampleData.filter(
  (item) =>
    item.line_code === "NSL" &&
    item.platform_code !== null &&
    item.train_id !== "226"
);

export function NslMap(props: { provider: Provider }) {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [currFrame, setCurrFrame] = useState<RawTrainInfo[]>([]);
  const [page, setPage] = useState(5);

  // Logs user out if there are inconsistencies in login status of user across tabs
  useEffect(() => {
    if (isAuthenticated && !instance.getActiveAccount()) {
      throw Error(
        "Something went wrong. Your session might have expired. Please log in again."
      );
    }
  }, [instance, isAuthenticated]);

  // currFrame is initialized with useEffect so that train sprites are rendered after map has finished rendering
  useEffect(() => {
    setCurrFrame(sampleNslData.slice(0, 5));
  }, [setCurrFrame]);

  function Fallback() {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre style={{ color: "red" }}>
          Something went wrong. Your session might have expired. Please log in
          again.
        </pre>
        <LoginButton provider={props.provider} />
      </div>
    );
  }

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={loginRequest}
      loadingComponent={() => <h1 className="card-title">Loading...</h1>}
      errorComponent={Fallback}
    >
      <header className="App-header">
        <h5> Click button to send next batch of data. </h5>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage((val) => val + 10);

            // Simulating new incoming data and remove duplicates(?)
            const nextFrame: RawTrainInfo[] = sampleNslData.slice(
              page,
              page + 10
            );
            for (let i = nextFrame.length - 1; i >= 0; i--) {
              for (let j = 0; j < i; j++)
                if (nextFrame[j].station_code === nextFrame[i].station_code) {
                  nextFrame.splice(i, 1);
                  break;
                }
            }

            for (let i = 0; i < currFrame.length; i++) {
              const train = currFrame[i];
              const trainSprite = document.getElementById(train.train_id);
              if (trainSprite === null) {
                console.log("Error locating train id: " + train.train_id);
                continue;
              }

              // Fix position of train sprite
              const curr_left =
                trainSprite.getBoundingClientRect().x + window.scrollX;
              const curr_top =
                trainSprite.getBoundingClientRect().y + window.scrollY;
              trainSprite.style.setProperty(
                "--current-left",
                curr_left.toString() + "px"
              );
              trainSprite.style.setProperty(
                "--current-top",
                curr_top.toString() + "px"
              );

              // Check if train sprite is present in next frame. If not, persist its current state.
              const train_nextFrame = getTrainById(nextFrame, train.train_id);
              if (train_nextFrame === null) {
                nextFrame.push(train);
                continue;
              }
              const stn = document.getElementById(
                train_nextFrame.station_code +
                  " " +
                  (train_nextFrame.platform_code === null
                    ? "A"
                    : train_nextFrame.platform_code)
              );
              if (stn === null) {
                console.log(
                  "Error processing next station code " +
                    train_nextFrame.station_code +
                    " of train id: " +
                    train.train_id
                );
                continue;
              }

              // Calculate distance to move the train sprite by, start animation
              const stn_left = stn.getBoundingClientRect().x + window.scrollX;
              const stn_top = stn.getBoundingClientRect().y + window.scrollY;
              trainSprite.style.setProperty(
                "--delta-left",
                (stn_left - curr_left).toString() + "px"
              );
              trainSprite.style.setProperty(
                "--delta-top",
                (stn_top - curr_top).toString() + "px"
              );
              trainSprite.classList.add("TrainMove");
            }

            // Stop animation and display new static frame
            setTimeout(() => {
              for (let i = 0; i < currFrame.length; i++) {
                const trainSprite = document.getElementById(
                  currFrame[i].train_id
                );
                if (trainSprite === null) {
                  continue;
                }
                trainSprite.classList.remove("TrainMove");
              }
              setCurrFrame(nextFrame);
            }, 1100);
          }}
        >
          <button type="submit">Move</button>
        </form>
        <NslSvg />
        {currFrame.map((item) => {
          if (item.platform_code === null) {
            return;
          }
          const stn = document.getElementById(
            item.station_code + " " + item.platform_code
          );
          if (stn === null) {
            return;
          }
          return (
            <Train
              key={item.train_id}
              id={item.train_id}
              style={{
                position: "absolute",
                left:
                  (stn.getBoundingClientRect().x + window.scrollX).toString() +
                  "px",
                top:
                  (stn.getBoundingClientRect().y + window.scrollY).toString() +
                  "px",
              }}
            />
          );
        })}
      </header>
    </MsalAuthenticationTemplate>
  );
}
