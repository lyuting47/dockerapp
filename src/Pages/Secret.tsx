import React, { useEffect } from "react";
import { Provider } from "../CustomHooks/provider";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import LogoutButton from "../Components/logout";
import LoginButton from "../Components/login";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

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

  function Fallback() {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre style={{ color: "red" }}>
          Something went wrong while signing you in. Your session might have
          expired. Please log in again.
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
        <LogoutButton provider={props.provider} />
        <h1> SECRET IMAGE </h1>
        <img src="/logo192.png" alt="secret"></img>
      </header>
    </MsalAuthenticationTemplate>
  );
}
