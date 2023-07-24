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
        <Link to="/create-user" style={{ color: "#00cdcd" }}>
          Create User
        </Link>
      </div>
      <div style={{ padding: 5, margin: 20 }}>
        <Link to="/secret" style={{ color: "#00cdcd" }}>
          Secret
        </Link>
      </div>
      <div style={{ padding: 5, margin: 20 }}>
        <Link to="/nsl-map" style={{ color: "#00cdcd" }}>
          NSL Map
        </Link>
      </div>
      <div style={{ padding: 5, margin: 20 }}>
        <Link to="/ewl-map" style={{ color: "#00cdcd" }}>
          EWL Map
        </Link>
      </div>
      <div style={{ padding: 5, margin: 20 }}>
        <Link to="/nsl-map-real" style={{ color: "#00cdcd" }}>
          NSL Map (Websocket)
        </Link>
      </div>
    </div>
  );
};
export default NavBar;
