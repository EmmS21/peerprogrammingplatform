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
          const path = `ws://127.0.0.1:8000/connect/challenge_sync/?${queryString}`;
          this.socketRef = new WebSocket(path);
          this.socketRef.onopen = (data) => {
              console.log('Second WebSocket open');
          }
          this.socketRef.onerror = e => {
              console.log(e);
          };
      }
      sendData(data){
          console.log(`***second websocket is sending: ${JSON.stringify(data)}***`)
          if(this.socketRef.readyState !== WebSocket.OPEN) {
              console.log('second still waiting')
              return this.socketRef.onopen = () => this.socketRef.send(data);
          } 
          return this.socketRef.send(data);
      };
      secondResponse(){
        this.connect()
        return new Promise((resolve, reject) => {
                this.socketRef.addEventListener("challenge", (e) => {
                    var response = JSON.parse(e.data)
                    resolve(response)
                });
                // this.socketRef.onmessage = e => {
                //     var response = JSON.parse(e.data)
                //     console.log(`!!!! response: ${JSON.stringify(response)} !!!`)
                //     resolve(response)
                // }  
            })
    }
      disconnect(){
          this.socketRef.onclose = () =>{
              console.log('disconnecting from websocket')
          };
      }
  }
  const SecondSocketInstance = WebSocketService.getInstance()
  export default SecondSocketInstance;
  
  