import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Provider } from 'react-redux'
import { createRoom } from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './assets/scss/style.scss';
import { CookiesProvider } from 'react-cookie';


const history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </Router>,
    document.getElementById('root')
);

serviceWorker.register();
