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
    if(this.socketRef.readyState === WebSocket.OPEN) {
        this.socketRef.send(data)
        this.socketRef.onmessage = e => {
            const result = JSON.parse(JSON.stringify(e.data))
            console.log('received in client:', result)
            return result
        }
    }
    else {
        console.log('we are still waiting')
        this.socketRef.addEventListener('open', () => this.sendData(data))
    }
//    console.log('what is retVal', retVal)
  }
  };
const WebSocketInstance = WebSocketService.getInstance()
export default WebSocketInstance;