import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={`info474`}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.querySelector("#root")
);
