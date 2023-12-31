import React, { useState } from "react";
import { AuthProvider } from "../CustomHooks/authProvider";
import { useWindowSizeListener } from "../CustomHooks/useWindowSizeListener";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { TrainSpritesRenderer } from "../Components/Animation/trainSpritesRenderer";
import { DoorSpritesRenderer } from "../Components/Animation/doorSpritesRenderer";
import sampleData from "./schematics_json_NSEWL.json";
import AuthErrorFallback from "../Components/authErrorFallback";
import { useMockAnimator } from "../CustomHooks/useMockAnimator";
import { MapRenderer } from "../Components/Animation/mapRenderer";
import { EwlSvg } from "../Components/Animation/ewlSvg";
import { RawTrainInfo } from "../RawTrainInfo";

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

const INITIAL_SIZE = 50;
const STEP_SIZE = 10;
const ANIMATION_DURATION = 1000;

export function EwlPage(props: { provider: AuthProvider }) {
  const { currFrame, frameIndex, setIsAuto, setJsonIndex } = useMockAnimator(
    sampleEwlData,
    INITIAL_SIZE,
    STEP_SIZE,
    ANIMATION_DURATION
  );
  const [isMapRendered, setIsMapRendered] = useState(false);
  useWindowSizeListener();

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={loginRequest}
      loadingComponent={() => <h1 className="card-title">Loading...</h1>}
      errorComponent={() => <AuthErrorFallback provider={props.provider} />}
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
              setJsonIndex((idx) => idx + STEP_SIZE);
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
