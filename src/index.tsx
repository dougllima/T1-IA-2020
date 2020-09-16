import React from "react";
import ReactDOM from "react-dom";
import Home from "./components/Home";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AlgGenProvider } from "./logic/AlgGen";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <AlgGenProvider>
      <Home/>
    </AlgGenProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
