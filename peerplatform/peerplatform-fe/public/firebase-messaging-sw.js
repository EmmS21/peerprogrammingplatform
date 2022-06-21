importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');
//import { initializeApp } from 'firebase/app';
//import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDsz7TnT2dxI43v8puME9Gqbe6pnb0F7N0",
    authDomain: "pair-programming-8ccae.firebaseapp.com",
    projectId: "pair-programming-8ccae",
    storageBucket: "pair-programming-8ccae.appspot.com",
    messagingSenderId: "544169966115",
    appId: "1:544169966115:web:c32a9f6d32bac2d531cf96",
    measurementId: "G-DZ47GH30DE"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});