import React from "react";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import LogoutButton from "../Components/logout";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { AuthProvider } from "../CustomHooks/authProvider";
import AuthErrorFallback from "../Components/authErrorFallback";

export function Secret(props: { provider: AuthProvider }) {
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Silent}
      authenticationRequest={loginRequest}
      loadingComponent={() => <h1 className="card-title">Loading...</h1>}
      errorComponent={() => <AuthErrorFallback provider={props.provider} />}
    >
      <header className="App-header">
        <LogoutButton provider={props.provider} />
        <h1> NOT SO SECRET IMAGE </h1>
        <img src="/logo192.png" alt="not_so_secret"></img>
      </header>
    </MsalAuthenticationTemplate>
  );
}
