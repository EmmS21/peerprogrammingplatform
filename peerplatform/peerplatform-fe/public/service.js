
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g,'+').replace(/_/g,'/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i){
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}
//saves subscription to backend
//const sendSubData = async (subscription) => {
//    const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase();
//    const data = {
//        status_type: 'subscribe',
//        subscription: subscription.toJSON(),
//        browser: browser,
//    };
//    const res = await fetch('http://127.0.0.1:8000/webpush/save_information', {
//        method: 'POST',
//        body: JSON.stringify(data)
//        headers: {
//            'content-type': 'application/json'
//        },
//        credentials: "include"
//    });
//    handleResponse(res)
//}
//

const saveSubscription = async (subscription) => {
    const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase();
    const data = {
        status_type: 'subscribe',
        subscription: subscription.toJSON(),
        browser: browser,
    };
    console.log('data is', data)
    console.log('we are posting to save_information')
    const res = await fetch('https://codesquad.onrender.com/webpush/save_information', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            'cookie': 'o'
        },
        credentials: 'include'
    });
    handleResponse(res);
}
const handleResponse = (res) => {
    console.log(res);
}
////
self.addEventListener('activate', async (event) => {
    try {
        const applicationServerKey = urlB64ToUint8Array('BEjrEhqY6ZoCLkNaSpUl88VKc1HSvm9um-mkSmylfWZhG0iwbt2m0DPL8_1iIyrWg8-UXr4bu8JNGMk_5Imuj5U')
        const options = { applicationServerKey,
                          userVisibleOnly: true }
        const subscription = await self.registration.pushManager.subscribe(options)
//        console.log('subscription:', JSON.stringify(subscription))
        console.log('subs', subscription.toJSON())
//        saveSubscription(subscription)
    } catch (err) {
        console.log('Error', err)
    }
    event.waitUntil(
        self.client.then(clientsArr => {
            if(clientsArr[0]) {
                clientsArr[0].focus();
                clientsArr[0].postMessage({
                    msg: subscription,
                });
            }
        })
    );

});

//self.addEventListener('push', function(event) {
//    console.log()
//    if(event.data) {
//        console.log('Push event!! ', event.data.text())
//    } else {
//        console.log('Push event but no data')
//    }
//})

//read notification from server & display this as a toast
self.addEventListener("push", e => {
    const data = e.data.json();
    self.registration.showNotification(
        data.title, // title of the notification
        {
            body: "Push notification from section.io", //the body of the push notification
            image: "https://pixabay.com/vectors/bell-notification-communication-1096280/",
            icon: "https://pixabay.com/vectors/bell-notification-communication-1096280/" // icon
        }
    );
});
//
console.log('hello service worker')