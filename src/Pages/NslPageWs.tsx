import React, { useEffect, useState } from "react";
import { Provider } from "../CustomHooks/provider";
import { useWindowSizeListener } from "../CustomHooks/useWindowSizeListener";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { TrainSpritesRenderer } from "../Components/Animation/trainSpritesRenderer";
import { DoorSpritesRenderer } from "../Components/Animation/doorSpritesRenderer";
import Fallback from "../Components/authErrorFallback";
import { MapRenderer } from "../Components/Animation/mapRenderer";
import { NslSvg } from "../Components/Animation/nslSvg";
import { useWsAnimator } from "../CustomHooks/useWsAnimator";
import { useWsCacheAnimator } from "../CustomHooks/useWsCacheAnimator";

const animationDuration = 1000;

export function NslPageWs(props: { provider: Provider }) {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const { currFrame, frameIndex } = useWsCacheAnimator(
    "wss://kafka-backend.lemonforest-65dc29d4.southeastasia.azurecontainerapps.io",
    "NSL",
    animationDuration
  );
  const [isMapRendered, setIsMapRendered] = useState(false);
  useWindowSizeListener();

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
