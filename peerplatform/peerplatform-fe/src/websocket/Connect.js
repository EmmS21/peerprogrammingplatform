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
    this.args = JSON.parse(localStorage.getItem('authTokens')).refresh
    this.path = `ws://127.0.0.1:8000/connect/testing/?${this.args}`;
  }
    connect() {
        // const args = JSON.parse(localStorage.getItem('authTokens'))
        // const queryString = this.args.refresh
        // const path = `wss://codesquad.onrender.com/connect/testing/?${queryString}`;
        // const path = `ws://127.0.0.1:8000/connect/testing/?${queryString}`;
        this.socketRef = new WebSocket(this.path);
        this.socketRef.onopen = (data) => {
            console.log('WebSocket open');
        }
        this.socketRef.onerror = e => {
            console.log(e);
        };
    }
    sendData(data){
        console.log(`^^^^what are we sending: ${data}^^^^`)
        if(this.socketRef.readyState !== WebSocket.OPEN) {
            console.log('we are still waiting')
            return this.socketRef.onopen = () => this.socketRef.send(data);
        } 
        return this.socketRef.send(data);
    };
    response(){
        const path = 'ws://127.0.0.1:8000/connect/testing/'
        this.socketRef = new WebSocket(this.path)
        this.connect()
        return new Promise((resolve, reject) => {
                this.socketRef.onmessage = e => {
                    var response = JSON.parse(e.data)
                    console.log(`!!!! response: ${JSON.stringify(response)} !!!`)
                    resolve(response)
                }  
            })
    }
    disconnect(){
        this.socketRef.onclose = () =>{
            console.log('disconnecting from websocket')
        };
    }
}
const WebSocketInstance = WebSocketService.getInstance()
export default WebSocketInstance;

