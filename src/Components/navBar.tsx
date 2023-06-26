import React from "react";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: 0,
      }}
    >
      <div style={{ padding: 5, margin: 20 }}>
        <Link to="/" style={{ color: "#00cdcd" }}>
          Home
        </Link>
      </div>
      <div style={{ padding: 5, margin: 20 }}>
        <Link to="/create_user" style={{ color: "#00cdcd" }}>
          Create User
        </Link>
      </div>
      <div style={{ padding: 5, margin: 20 }}>
        <Link to="/secret" style={{ color: "#00cdcd" }}>
          Secret
        </Link>
      </div>
    </div>
  );
};
export default NavBar;
