import React from "react";
import LoginButton from "./login";
import { Provider } from "../CustomHooks/provider";

const Fallback = (props: { provider: Provider }) => {
  return (
    <div role="alert">
      <pre style={{ color: "red" }}>
        You are not logged in or your session has expired, please log in to
        access this page.
      </pre>
      <LoginButton provider={props.provider} />
    </div>
  );
};

export default Fallback;
