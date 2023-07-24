import React from "react";
import { InteractionStatus } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import LoginButton from "../Components/login";
import LogoutButton from "../Components/logout";
import GetUserButton from "../Components/getUserButton";
import { AuthProvider } from "../CustomHooks/authProvider";

export function Home(props: { provider: AuthProvider }) {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  return (
    <header className="App-header">
      <h1> SPA with Azure </h1>
      {inProgress !== InteractionStatus.None ? (
        <h1 className="card-title">Loading...</h1>
      ) : (
        <>
          {!isAuthenticated && <h5>Please sign in to access the API.</h5>}
          {!isAuthenticated && <LoginButton provider={props.provider} />}
          {isAuthenticated && <LogoutButton provider={props.provider} />}
          {isAuthenticated && (
            <h5 className="card-title">
              <p>Welcome, {instance.getActiveAccount()?.name}</p>
              <p>Enter ID to search for user</p>
            </h5>
          )}
          {isAuthenticated && <GetUserButton provider={props.provider} />}
        </>
      )}
    </header>
  );
}
