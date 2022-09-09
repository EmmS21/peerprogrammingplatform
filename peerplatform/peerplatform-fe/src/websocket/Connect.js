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
    connect(args) {
    const queryString = args.refresh
    const path = `ws://127.0.0.1:8000/connect/testing/?${queryString}`;
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
            console.log('now opening websocket')
            this.socketRef.addEventListener('open', resolve);
        });
    }
    this.socketRef.send(data)
    const socketResp = await new Promise((resolve, reject) => {
        this.socketRef.onmessage = e => {
            console.log('we are receiving', e.data)
//            console.log(`we are receiving userBs id:${e.data.split(' ')[0]} and roomID:${e.data.split(' ')[1]}`)
            resolve(e.data)
        }
    })
    return socketResp;
  };
}
const WebSocketInstance = WebSocketService.getInstance()
export default WebSocketInstance;

