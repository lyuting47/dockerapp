import React from "react";
import { AuthProvider } from "../CustomHooks/authProvider";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import LogoutButton from "../Components/logout";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import PostUserButton from "../Components/postUserButton";
import AuthErrorFallback from "../Components/authErrorFallback";

export function CreateUser(props: { provider: AuthProvider }) {
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={loginRequest}
      loadingComponent={() => <h1 className="card-title">Loading...</h1>}
      errorComponent={() => <AuthErrorFallback provider={props.provider} />}
    >
      <header className="App-header">
        <LogoutButton provider={props.provider} />
        <h5 className="card-title">Enter details to create user</h5>
        <PostUserButton provider={props.provider} />
      </header>
    </MsalAuthenticationTemplate>
  );
}
