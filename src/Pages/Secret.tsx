import React, { useEffect } from "react";
import { Provider } from "../CustomHooks/provider";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import LogoutButton from "../Components/logout";
import { InteractionStatus } from "@azure/msal-browser";
import { useNavigate } from "react-router-dom";

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
    <header className="App-header">
      {inProgress !== InteractionStatus.None ? (
        <h1> Loading... </h1>
      ) : (
        <>
          <LogoutButton provider={props.provider} />
          <h1> SECRET IMAGE </h1>
          <img src="/logo192.png" alt="secret image"></img>
        </>
      )}
    </header>
  );
}
