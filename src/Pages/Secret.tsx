import React, { useEffect } from "react";
import { Provider } from "../CustomHooks/provider";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import LogoutButton from "../Components/logout";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import Fallback from "../Components/authErrorFallback";

export function Secret(props: { provider: Provider }) {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

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
        <LogoutButton provider={props.provider} />
        <h1> SECRET IMAGE </h1>
        <img src="/logo192.png" alt="secret"></img>
      </header>
    </MsalAuthenticationTemplate>
  );
}
