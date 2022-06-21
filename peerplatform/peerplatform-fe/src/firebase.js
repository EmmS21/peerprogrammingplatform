import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDsz7TnT2dxI43v8puME9Gqbe6pnb0F7N0",
    authDomain: "pair-programming-8ccae.firebaseapp.com",
    projectId: "pair-programming-8ccae",
    storageBucket: "pair-programming-8ccae.appspot.com",
    messagingSenderId: "544169966115",
    appId: "1:544169966115:web:c32a9f6d32bac2d531cf96",
    measurementId: "G-DZ47GH30DE"
};




const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = (setTokenFound) => {
    console.log('fetchToken function has been triggered')
    return getToken(messaging, {vapidKey: 'BPMSamhIjU6FdjAFDlr9OCMdQE0GPkE8FnhuSnr6ZBjKE5eKFaOT_jU3Lg1cgrh06rZ_L2NXmgwjKHFAo9moOAY'}).then((currentToken) => {
        if(currentToken) {
            console.log('current token for client: ', currentToken);
            setTokenFound(true);
        }
    })
.catch((err) => {
        console.log('An error occurred while retrieving token.', err);
    });
}

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });