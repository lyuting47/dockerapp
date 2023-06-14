import React from "react";
import { Routes, Route } from "react-router-dom";

import { Secret } from "./Pages/Secret";
import { Home } from "./Pages/Home";
import { Provider } from "./CustomHooks/provider";

export function Main(props: { provider: Provider }) {
  return (
    <Routes>
      <Route path="/" element={<Home provider={props.provider} />} />
      <Route path="/secret" element={<Secret provider={props.provider} />} />
    </Routes>
  );
}
