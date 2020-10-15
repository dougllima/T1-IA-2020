import React from "react";
import ReactDOM from "react-dom";
import Home from "./components/Home";
import CssBaseline from "@material-ui/core/CssBaseline";
import { GeneticoProvider } from "./logic/GeneticoContext";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { LabirintoProvider } from "./logic/LabirintoContext";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <LabirintoProvider>
        <GeneticoProvider>
          <Home />
        </GeneticoProvider>
      </LabirintoProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
