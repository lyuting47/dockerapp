import React, { useEffect } from "react";
import { InteractionStatus } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import LoginButton from "../Components/login";
import LogoutButton from "../Components/logout";
import GetUserButton from "../Components/getUserButton";
import { Provider } from "../CustomHooks/provider";

export function Home(props: { provider: Provider }) {
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
              Welcome {instance.getActiveAccount()?.name}
            </h5>
          )}
          {isAuthenticated && <GetUserButton provider={props.provider} />}
        </>
      )}
    </header>
  );
}
