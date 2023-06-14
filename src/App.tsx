import React from "react";
import { Provider } from "./CustomHooks/provider";
import "./App.css";
import { Link } from "react-router-dom";
import { Main } from "./Main";

function App(props: { provider: Provider }) {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <Link to="/" style={{ color: "#FFF" }}>
            Home
          </Link>
        </p>
        <p>
          <Link to="/secret" style={{ color: "#FFF" }}>
            Secret
          </Link>
        </p>
        <Main provider={props.provider} />
      </header>
    </div>
  );
}

export default App;
