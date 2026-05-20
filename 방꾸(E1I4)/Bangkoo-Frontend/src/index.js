import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import theme from "./theme/theme";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <MUIThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <App />
      </StyledThemeProvider>
    </MUIThemeProvider>
  </Provider>
);
