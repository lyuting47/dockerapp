import React, { useEffect } from "react";
import { Provider } from "../CustomHooks/provider";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import LogoutButton from "../Components/logout";
import LoginButton from "../Components/login";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../authConfig";
import PostApiButton from "../Components/postApi";

export function CreateUser(props: { provider: Provider }) {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  // Force the page to refresh if there are inconsistencies in login status of user across tabs
  useEffect(() => {
    if (isAuthenticated && !instance.getActiveAccount()) {
      navigate(0);
    }
  }, [instance, navigate, isAuthenticated]);

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
        {isAuthenticated && inProgress === InteractionStatus.None ? (
          <h5 className="card-title">
            Enter details:
          </h5>
        ) : (
          <h5 className="card-title">Loading...</h5>
        )}
        <PostApiButton provider={props.provider} />
      </header>
    </MsalAuthenticationTemplate>
  );
}
