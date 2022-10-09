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
        // console.log('what is in querystring', queryString)
        const path = `wss://codesquad.onrender.com/connect/testing/?${queryString}`;
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = (data) => {
            console.log('WebSocket open');
        }
        this.socketRef.onerror = e => {
            console.log(e);
        };
    }
    async sendData(data){
        // console.log('!!!we are sending this data!!!', data)
        if(this.socketRef.readyState !== WebSocket.OPEN) {
            console.log('we are still waiting')
            this.socketRef.onopen = () => this.socketRef.send(data);
            const socketResp = await new Promise((resolve, reject) => {
                this.socketRef.onmessage = e => {
//                console.log(JSON.parse(e.data))
                resolve(e.data)
                }
            })
            return socketResp;
        }
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

