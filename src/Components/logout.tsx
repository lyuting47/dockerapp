import React from "react";
import { Provider } from "../CustomHooks/provider";
import { useLogout } from "../CustomHooks/useLogout";
import { logoutRequest } from "../authConfig";

const LogoutButton = (props: { provider: Provider }) => {
  const handleLogout = useLogout(props.provider, logoutRequest);

  return <button onClick={() => handleLogout()}>Log Out</button>;
};

export default LogoutButton;
