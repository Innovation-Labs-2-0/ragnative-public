import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import store from "./store";
import { ThemeProvider } from "@mui/material";
import theme from "assets/theme";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { Provider } from "react-redux";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MaterialUIControllerProvider>
          <App />
        </MaterialUIControllerProvider>
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
