class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

   constructor() {
    this.socketRef = null;
  }
    connect() {
        const args = JSON.parse(localStorage.getItem('authTokens'))
        const queryString = args.refresh
        console.log('what is in querystring', queryString)
        const path = `ws://127.0.0.1:8000/connect/testing/?${queryString}`;
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = (data) => {
            console.log('WebSocket open');
        }
        this.socketRef.onerror = e => {
            console.log(e);
        };
//        this.socketRef.onclose = () => {
//            console.log("WebSocket closed let's reopen");
//            this.connect();
//        };
        this.socketRef.onmessage = e => {
                console.log('onmessage')
                console.log(JSON.parse(e.data));
        }
    }
    async sendData(data){
        if(this.socketRef.readyState !== WebSocket.OPEN) {
            console.log('we are still waiting')
            this.socketRef.onopen = () => this.socketRef.send(data);
        }
//        const socketResp = await new Promise((resolve, reject) => {
//            this.socketRef.onmessage = e => {
//                console.log('we are receiving', JSON.stringify(e));
//                resolve(e.data)
//            }
//            this.socketRef.onerror = e => {
//                console.log('error', e)
//            }
//        })
//        return socketResp;
    };
    disconnect(){
        this.socketRef.onclose = () =>{
            console.log('disconnecting from websocket')
        };
    }
}
const WebSocketInstance = WebSocketService.getInstance()
export default WebSocketInstance;

