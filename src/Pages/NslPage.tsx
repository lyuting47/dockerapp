import React, { useEffect, useState } from "react";
import { Provider } from "../CustomHooks/provider";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { TrainSpritesRenderer } from "../Components/trainSpritesRenderer";
import sampleData from "./schematics_json_NSEWL.json";
import Fallback from "../Components/authErrorFallback";
import { useTrainAnimator } from "../CustomHooks/useTrainAnimator";
import { MapRenderer } from "../Components/mapRenderer";

// Filtering sample data
const sampleNslData = sampleData.filter(
  (train) => train.line_code === "NSL" && train.train_id !== "205"
);

export function NslPage(props: { provider: Provider }) {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const { currFrame, frameIndex, setIsAuto, setJsonIndex } = useTrainAnimator(
    sampleNslData,
    50,
    5
  );
  const [isMapRendered, setIsMapRendered] = useState(false);

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
        <MapRenderer setIsRendered={setIsMapRendered} />
        {isMapRendered && (
          <TrainSpritesRenderer
            trainInfos={currFrame}
            frameIndex={frameIndex}
          />
        )}
      </header>
    </MsalAuthenticationTemplate>
  );
}
