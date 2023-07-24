import React from "react";
import { AuthProvider } from "../CustomHooks/authProvider";
import { useLogin } from "../CustomHooks/useLogin";
import { loginRequest } from "../authConfig";

const LoginButton = (props: { provider: AuthProvider }) => {
  const handleLogin = useLogin(props.provider, loginRequest);

  return <button onClick={() => handleLogin()}>Log In</button>;
};

export default LoginButton;
