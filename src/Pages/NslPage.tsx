import React, { useState } from "react";
import { AuthProvider } from "../CustomHooks/authProvider";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { TrainSpritesRenderer } from "../Components/Animation/trainSpritesRenderer";
import { DoorSpritesRenderer } from "../Components/Animation/doorSpritesRenderer";
import sampleData from "./schematics_json_NSEWL.json";
import AuthErrorFallback from "../Components/authErrorFallback";
import { useMockAnimator } from "../CustomHooks/useMockAnimator";
import { MapRenderer } from "../Components/Animation/mapRenderer";
import { NslSvg } from "../Components/Animation/nslSvg";
import { RawTrainInfo } from "../RawTrainInfo";

// Filtering sample data
let sampleNslData: RawTrainInfo[] = sampleData.filter(
  (train) => train.line_code === "NSL" && train.train_id !== "205"
);

// Duplicating sample data for load testing

/*
sampleNslData = sampleNslData.flatMap((train) => {
  const dupes: RawTrainInfo[] = [train];
  for (let i = 0; i < 15; i++) {
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

export function NslPage(props: { provider: AuthProvider }) {
  const { currFrame, frameIndex, setIsAuto, setJsonIndex } = useMockAnimator(
    sampleNslData,
    INITIAL_SIZE,
    STEP_SIZE,
    ANIMATION_DURATION
  );
  const [isMapRendered, setIsMapRendered] = useState(false);

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
        <MapRenderer setIsRendered={setIsMapRendered} mapSvg={NslSvg} />
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
