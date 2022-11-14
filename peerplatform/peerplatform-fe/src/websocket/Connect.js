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
    connect(one) {
        const args = JSON.parse(localStorage.getItem('authTokens'))
        const queryString = args.refresh
        // const path = `wss://codesquad.onrender.com/connect/sync/?${queryString}`;
        const path = `ws://127.0.0.1:8000/connect/sync/?${queryString}`;
        this.socketRef = new WebSocket(path);
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
        this.connect()
        return new Promise((resolve, reject) => {
                this.socketRef.addEventListener("message", (e) => {
                    console.log('receiving something in response')
                    var response = JSON.parse(e.data)
                    if(response.type === 'send_message'){
                        resolve(response)
                    } 
                });
            })
    }
    receiveChallenge(){
        console.log('are we calling receiveChallenge?')
        this.connect()
        return new Promise((resolve, reject) => {
            this.socketRef.addEventListener("message", (e) => {
                var response = JSON.parse(e.data)
                if(response.type === 'send_challenge'){
                    resolve(response)
                    // console.log(`!!!!! RESPONSE HAS BEEN RECEIVED ${response}`)
                } 
            });
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

