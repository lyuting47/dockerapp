import React from "react";
import { Provider } from "./CustomHooks/provider";
import "./App.css";
import { Main } from "./Pages/Main";
import NavBar from "./Components/navBar";

function App(props: { provider: Provider }) {
  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
        <Main provider={props.provider} />
      </header>
    </div>
  );
}

export default App;
