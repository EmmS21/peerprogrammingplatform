////encodes the base64 public key
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
////saves subscription to backend
const saveSubscription = async subscription => {
    console.log('save to subscription', subscription)
//    const SERVER_URL = 'http://127.0.0.1:8000/subscriptions'
//    const response = await fetch(SERVER_URL, {
//        method: 'post',
//        headers: {
//            'Content-Type': 'application/json',
//        },
//        body: JSON.stringify(subscription),
//    })
//    return response.json()
}
//
self.addEventListener('activate', async () => {
    try {
        const applicationServerKey = urlB64ToUint8Array('BEjrEhqY6ZoCLkNaSpUl88VKc1HSvm9um-mkSmylfWZhG0iwbt2m0DPL8_1iIyrWg8-UXr4bu8JNGMk_5Imuj5U')
        const options = { applicationServerKey,
                          userVisibleOnly: true }
        const subscription = await self.registration.pushManager.subscribe(options)
        console.log(JSON.stringify(subscription))
    } catch (err) {
        console.log('Error', err)
    }
})

self.addEventListener('push', function(event) {
    if(event.data) {
        console.log('Push event!! ', event.data.text())
    } else {
        console.log('Push event but no data')
    }
})

console.log('hello service worker')