import React from "react";
import LoginButton from "./login";
import { AuthProvider } from "../CustomHooks/authProvider";

const AuthErrorFallback = (props: { provider: AuthProvider }) => {
  return (
    <header className="App-header">
      <div role="alert">
        <pre style={{ color: "red" }}>
          There are either no active accounts or more than one. Please log in
          manually.
        </pre>
        <LoginButton provider={props.provider} />
      </div>
    </header>
  );
};

export default AuthErrorFallback;
