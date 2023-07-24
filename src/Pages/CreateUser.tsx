import React, { useEffect } from "react";
import { Provider } from "../CustomHooks/provider";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import LogoutButton from "../Components/logout";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import PostUserButton from "../Components/postUserButton";
import Fallback from "../Components/authErrorFallback";

export function CreateUser(props: { provider: Provider }) {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // Throws error if there are inconsistencies in login status of user across tabs
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
        <LogoutButton provider={props.provider} />
        {inProgress === InteractionStatus.None ? (
          <h5 className="card-title">Enter details:</h5>
        ) : (
          <h5 className="card-title">Loading...</h5>
        )}
        <PostUserButton provider={props.provider} />
      </header>
    </MsalAuthenticationTemplate>
  );
}
