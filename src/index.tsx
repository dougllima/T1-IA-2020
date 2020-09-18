import React from "react";
import ReactDOM from "react-dom";
import Home from "./components/Home";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AlgGenProvider } from "./logic/AlgGen";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  palette:{
    type: "dark"
  }
});

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <AlgGenProvider>
        <Home />
      </AlgGenProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
