import React, { useState } from "react";
import { AuthProvider } from "../CustomHooks/authProvider";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { TrainSpritesRenderer } from "../Components/Animation/trainSpritesRenderer";
import { DoorSpritesRenderer } from "../Components/Animation/doorSpritesRenderer";
import AuthErrorFallback from "../Components/authErrorFallback";
import { MapRenderer } from "../Components/Animation/mapRenderer";
import { EwlSvg } from "../Components/Animation/ewlSvg";
import { NslSvg } from "../Components/Animation/nslSvg";
import { useWsPushAnimator } from "../CustomHooks/useWsPushAnimator";

const animationDuration = 1000;

export function NslPageWs(props: { provider: AuthProvider }) {
  const { currFrame, frameIndex } = useWsPushAnimator(
    "wss://kafka-backend.lemonforest-65dc29d4.southeastasia.azurecontainerapps.io",
    "NSL",
    animationDuration
  );
  const [isMapRendered, setIsMapRendered] = useState(false);

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Silent}
      authenticationRequest={loginRequest}
      loadingComponent={() => <h1 className="card-title">Loading...</h1>}
      errorComponent={() => <AuthErrorFallback provider={props.provider} />}
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
