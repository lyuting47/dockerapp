import React from "react";
import LoginButton from "./login";
import { Provider } from "../CustomHooks/provider";

const Fallback = (props: { provider: Provider }) => {
  return (
    <div role="alert">
      <pre style={{ color: "red" }}>
        There are either no active accounts or more than one. Please log in
        manually.
      </pre>
      <LoginButton provider={props.provider} />
    </div>
  );
};

export default Fallback;
