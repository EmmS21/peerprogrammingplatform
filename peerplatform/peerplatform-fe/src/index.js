import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "./assets/scss/style.scss";
import { CookiesProvider } from "react-cookie";
import { H } from "highlight.run";
import { ErrorBoundary } from "@highlight-run/react";

H.init("4d7kom6e", {
  serviceName: "frontend-app",
  tracingOrigins: true,
  networkRecording: {
    enabled: true,
    recordHeadersAndBody: true,
    urlBlocklist: [
      "https://www.googleapis.com/identitytoolkit",
      "https://securetoken.googleapis.com",
    ],
  },
});

const history = createBrowserHistory();

ReactDOM.render(
  <ErrorBoundary>
    <Router history={history}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </Router>
  </ErrorBoundary>,
  document.getElementById("root"),
);

serviceWorker.register();
