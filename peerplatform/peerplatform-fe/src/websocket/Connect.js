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
//    this.socketRef.onmessage = e => {
//      this.socketNewMessage(e.data);
//    };

    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect();
    };
  }
  sendData(data){
    if(this.socketRef.readyState === WebSocket.OPEN) {
        console.log('data has been sent', data)
        this.socketRef.send(data)
    }
    else {
        console.log('we are still waiting')
        this.socketRef.addEventListener('open', () => this.sendData(data))
    }
  }
  };
const WebSocketInstance = WebSocketService.getInstance()
export default WebSocketInstance;