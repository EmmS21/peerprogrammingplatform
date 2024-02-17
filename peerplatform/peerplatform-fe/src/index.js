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
import * as Sentry from "@sentry/react";
import mixpanel from 'mixpanel-browser';


Sentry.init({
  dsn: "https://e73ed4d4f1afb4b34bed33d02a97b738@us.sentry.io/4506697576742912",
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 1.0,
});

mixpanel.init('fb0b23c581a0da85e6a95996f3dc0933');

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
