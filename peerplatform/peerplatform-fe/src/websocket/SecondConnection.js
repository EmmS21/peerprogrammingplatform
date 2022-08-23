class WebSocketService {
  static instance = null;

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
    const path = 'ws://127.0.0.1:8000/connect/second/';
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log('Second websocket open');
      }
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("Second websocket closed let's reopen");
      this.connect();
    };
  }
 }
const WebSocketInstance = WebSocketService.getInstance()
export default WebSocketInstance;

