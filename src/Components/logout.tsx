import React from "react";
import { AuthProvider } from "../CustomHooks/authProvider";
import { useLogout } from "../CustomHooks/useLogout";
import { logoutRequest } from "../authConfig";

const LogoutButton = (props: { provider: AuthProvider }) => {
  const handleLogout = useLogout(props.provider, logoutRequest);

  return <button onClick={() => handleLogout()}>Log Out</button>;
};

export default LogoutButton;
