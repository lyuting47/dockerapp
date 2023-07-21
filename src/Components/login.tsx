import React from "react";
import { Provider } from "../CustomHooks/provider";
import { useLogin } from "../CustomHooks/useLogin";
import { loginRequest } from "../authConfig";

const LoginButton = (props: { provider: Provider }) => {
  const handleLogin = useLogin(props.provider, loginRequest);

  return <button onClick={() => handleLogin()}>Log In</button>;
};

export default LoginButton;
