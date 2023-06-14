import React, { useEffect } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import LoginButton from "../Components/login";
import LogoutButton from "../Components/logout";
import AccessPrivateUncopedApiButton from "../Components/accessPrivateAPI";
import { Provider } from "../CustomHooks/provider";
import { useNavigate } from "react-router-dom";

export function Home(props: { provider: Provider }) {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const navigate = useNavigate();

  // Force the page to refresh if there are inconsistencies in login status of user across tabs
  useEffect(() => {
    if (isAuthenticated && !instance.getActiveAccount()) {
      navigate(0);
    }
  }, [instance, navigate, isAuthenticated]);

  return (
    <header className="App-header">
      <h1> SPA on port 3000 with Azure </h1>
      {!isAuthenticated && <h5>Please sign in to access the API.</h5>}
      {!isAuthenticated && <LoginButton provider={props.provider} />}
      {isAuthenticated && <LogoutButton provider={props.provider} />}
      {isAuthenticated && (
        <AccessPrivateUncopedApiButton provider={props.provider} />
      )}
    </header>
  );
}
