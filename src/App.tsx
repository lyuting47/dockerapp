import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./Components/navBar";
import { Secret } from "./Pages/Secret";
import { Home } from "./Pages/Home";
import { CreateUser } from "./Pages/CreateUser";
import { NslPage } from "./Pages/NslPage";
import { EwlPage } from "./Pages/EwlPage";
import { NslPageWs } from "./Pages/NslPageWs";
import { AuthProvider } from "./CustomHooks/authProvider";
import "./App.css";

function App(props: { provider: AuthProvider }) {
  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home provider={props.provider} />} />
          <Route
            path="/create-user"
            element={<CreateUser provider={props.provider} />}
          />
          <Route
            path="/secret"
            element={<Secret provider={props.provider} />}
          />
          <Route
            path="/nsl-map"
            element={<NslPage provider={props.provider} />}
          />
          <Route
            path="/ewl-map"
            element={<EwlPage provider={props.provider} />}
          />
          <Route
            path="/nsl-map-real"
            element={<NslPageWs provider={props.provider} />}
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;
