import React from "react";
import LoginButton from "./login";
import { AuthProvider } from "../CustomHooks/authProvider";

const AuthErrorFallback = (props: { provider: AuthProvider }) => {
  return (
    <header className="App-header">
      <div role="alert">
        <pre style={{ color: "red" }}>
          Something went wrong while trying to log you in. Please try again.
        </pre>
        <LoginButton provider={props.provider} />
      </div>
    </header>
  );
};

export default AuthErrorFallback;
