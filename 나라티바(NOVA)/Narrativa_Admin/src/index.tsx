import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import App from "./App";
import store from './store';
import "./assets/css/index.css";
import "./assets/css/reset.css";
import "material-icons/iconfont/material-icons.css";

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}