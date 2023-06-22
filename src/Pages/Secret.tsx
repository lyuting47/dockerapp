import React, { useEffect } from "react";
import { Provider } from "../CustomHooks/provider";
import {
  MsalAuthenticationTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import LogoutButton from "../Components/logout";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../authConfig";

export function Secret(props: { provider: Provider }) {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  // Force the page to refresh if there are inconsistencies in login status of user across tabs
  useEffect(() => {
    if (isAuthenticated && !instance.getActiveAccount()) {
      navigate(0);
    }
  }, [instance, navigate, isAuthenticated]);

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={loginRequest}
      loadingComponent={() => <h5 className="card-title">Loading...</h5>}
    >
      <header className="App-header">
        {inProgress !== InteractionStatus.None ? (
          <h1> Loading... </h1>
        ) : (
          <>
            <LogoutButton provider={props.provider} />
            <h1> SECRET IMAGE </h1>
            <img src="/logo192.png" alt="secret"></img>
          </>
        )}
      </header>
    </MsalAuthenticationTemplate>
  );
}
