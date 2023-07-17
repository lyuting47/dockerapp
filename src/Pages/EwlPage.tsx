import React, { useEffect, useState } from "react";
import { Provider } from "../CustomHooks/provider";
import { useWindowSize } from "../CustomHooks/useWindowSize";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { TrainSpritesRenderer } from "../Components/trainSpritesRenderer";
import { DoorSpritesRenderer } from "../Components/doorSpritesRenderer";
import sampleData from "./schematics_json_NSEWL.json";
import Fallback from "../Components/authErrorFallback";
import { useTrainAnimator } from "../CustomHooks/useTrainAnimator";
import { MapRenderer } from "../Components/mapRenderer";
import { EwlSvg } from "../Components/ewlSvg";
import { RawTrainInfo } from "../rawTrainInfo";

// Filtering sample data
const sampleEwlData: RawTrainInfo[] = sampleData.filter(
  (train) => train.line_code === "EWL"
);

// Duplicating sample data for load testing
/*
sampleNslData = sampleNslData.flatMap((train) => {
  const dupes: RawTrainInfo[] = [train];
  for (let i = 0; i < 30; i++) {
    const train_copy: RawTrainInfo = { ...train };
    train_copy.train_id = train_copy.train_id + i.toString();
    dupes.push(train_copy);
  }
  return dupes;
});
*/

const initialSize = 50;
const stepSize = 10;
const animationDuration = 1000;

export function EwlPage(props: { provider: Provider }) {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const { currFrame, frameIndex, setIsAuto, setJsonIndex } = useTrainAnimator(
    sampleEwlData,
    initialSize,
    stepSize,
    animationDuration
  );
  const [isMapRendered, setIsMapRendered] = useState(false);
  useWindowSize();

  // Throws error if there are inconsistencies in login status of user
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
              setJsonIndex((idx) => idx + stepSize);
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
        <MapRenderer setIsRendered={setIsMapRendered} mapSvg={EwlSvg} />
        {isMapRendered && (
          <>
            <TrainSpritesRenderer
              trainInfos={currFrame}
              frameIndex={frameIndex}
            />
            <DoorSpritesRenderer
              trainInfos={currFrame}
              frameIndex={frameIndex}
            />
          </>
        )}
      </header>
    </MsalAuthenticationTemplate>
  );
}
