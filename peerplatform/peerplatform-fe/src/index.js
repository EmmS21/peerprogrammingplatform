import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { createRoom } from "react-dom/client";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
//import * as service from './service'

import "./assets/scss/style.scss";
import { CookiesProvider } from "react-cookie";

const history = createBrowserHistory();

//const check = () => {
//    if(!('serviceWorker' in navigator)) {
//        throw new Error('No Service Worker support!')
//    }
//    if (!('PushManager' in window)) {
//        throw new Error('No Push API Support!')
//    }
//    console.log('check is running')
//}
////
//const registerServiceWorker = async () => {
//    const swRegistration = await navigator.serviceWorker.register('./service.js')
//    console.log('registering service worker')
//    return swRegistration;
//}
//
//const requestNotificationPermission = async () => {
//    const permission = await window.Notification.requestPermission();
//    if(permission !== 'granted') {
//        throw new Error('Permission not granted for Notification');
//    }
//}
//
//const showLocalNotification = (title, body, swRegistration) => {
//    const options = {
//        body,
//    };
//    swRegistration.showNotification(title, options)
////       / .then(res => {
////            console.log('promise returns', res)
////        });
////    console.log('what is title:', title)
//};
//
//const main = async () => {
//    check()
//    const swRegistration = await registerServiceWorker();
//    const permission = await requestNotificationPermission();
//    console.log('main is running and permissions are', Notification.permission)
//    showLocalNotification('This is title', 'this is the message', swRegistration);
//}
//
//main();

ReactDOM.render(
  <Router history={history}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </Router>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
serviceWorker.register();
