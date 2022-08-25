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
    const path = 'ws://127.0.0.1:8000/connect/testing/';
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = (data) => {
      console.log('WebSocket open');
      }
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect();
    };
  }
  async sendData(data){
    if(this.socketRef.readyState !== WebSocket.OPEN) {
        console.log('we are still waiting')
        await new Promise((resolve, reject) => {
            this.socketRef.addEventListener('open', resolve);
        });
    }
    this.socketRef.send(data)
//    const result  = this.socketRef.onmessage =  e => { return e.data }
    const result = await new Promise((resolve, reject) => {
        this.socketRef.onmessage = e => {
            resolve(e.data)
        }
    });
    return result
  };
}
const WebSocketInstance = WebSocketService.getInstance()
export default WebSocketInstance;

