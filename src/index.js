const CMD = {
  HSHK: 1,
  EU: 2,
  SYNC: 4,
}

const ACTION = {
  NONE: 8,
  EDIT: 16
}

class BroadcastablChannel extends MessageChannel {

  #port
  #target

  constructor() {
    super();
    this.#port = this.port1;
    this.init();
  }
  
  init() {
    customElements.whenDefined('my-iframe').then(() => {
      this.#target = document.querySelector('iframe[is=my-iframe]');
      this.bindEvents();
    });
  }
  
  bindEvents() {
    this.#port.start();
    this.#port.addEventListener('messageerror', this.handleError);
    this.#target.addEventListener('load', () => this.#target.contentWindow.postMessage({ cmd: CMD.HSHK }, '*', [this.port2]));
  }

  subscribe(messageHandler) {
    if(messageHandler == null) {
      throw 'Parameter can not be null!';
    }
    
    this.#port.addEventListener('message', messageHandler);
  }

  unsubscribe(messageHandler) {}

  send(message) {
      this.#port.postMessage(message);
  }
  
  handleError(event) {
    console.error('wooops');
  }

}

class SubscribableChannel extends BroadcastChannel {
  #port;

  constructor(name) {
    super(name);
  }

  subscribe(messageHandler) {

    if (messageHandler == null) {
      throw "Parameter can not be null!";
    }

    window.addEventListener("message", (event) => this.handler(event, messageHandler));
    this.addEventListener('message', messageHandler);
  }

  handler(event, messageHandler) {

    const data = event.data;

    switch (data.cmd) {
      case CMD.HSHK:
        console.log('🤝 got handshake from server');
        this.#port = event.ports[0];
        // this.#port.onmessage = messageHandler;

        this.#port.addEventListener('message', messageHandler);
        this.#port.addEventListener('message', console.log('HAHAHAHAHA'));
        this.#port.addEventListener('messageerror', this.error);
        this.#port.start();
        break;

      default:
        break;
    }
  }

  unsubscribe() {}

  send(payload) {
    this.#port?.postMessage(payload);
    this.postMessage(payload);
  }

  broadcast(payload) {
    this.postMessage(payload);
  }

  error(error) {
    console.error(error);
  }

}

const subscribableChannel = new SubscribableChannel();

export default new BroadcastablChannel();
export { CMD, ACTION, subscribableChannel }
