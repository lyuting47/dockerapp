import React from "react";
import { createRoot } from "react-dom/client";
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  PublicClientApplication,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { logoutRequest, providerConfig } from "./authConfig";
import { Provider } from "./CustomHooks/provider";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
let root;
if (container) {
  root = createRoot(container);
} else {
  throw Error("Root not found");
}
const msalInstance = new PublicClientApplication(providerConfig);

msalInstance.addEventCallback((event: EventMessage) => {
  if (
    (event.eventType === EventType.LOGIN_SUCCESS ||
      event.eventType === EventType.SSO_SILENT_SUCCESS ||
      event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
    event.payload
  ) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

// https://github.com/bvaughn/react-error-boundary
function Fallback(renderError: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{renderError.error.message}</pre>
      <button onClick={renderError.resetErrorBoundary}>Try again</button>
    </div>
  );
}

function Reset() {
  msalInstance
    .logoutRedirect({
      ...logoutRequest,
      account: msalInstance.getAllAccounts()[0],
    })
    .catch((err) => console.log(err));
}

root.render(
  <ErrorBoundary FallbackComponent={Fallback} onReset={Reset}>
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <App provider={Provider.AZURE} />
      </BrowserRouter>
    </MsalProvider>
  </ErrorBoundary>
);
