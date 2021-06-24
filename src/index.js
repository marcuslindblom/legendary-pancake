const CMD = {
  HSHK: 1,
  EU: 2,
  SYNC: 4,
}

const ACTION = {
  NONE: 8,
  EDIT: 16
}

class SubscribableChannel extends MessageChannel {

  #port
  #target

  constructor() {
    super();
    this.#port = this.port1;
    this.#target = document.querySelector('iframe[is=my-iframe]');
    this.#target.addEventListener( "load", (e) => this.#target.contentWindow.postMessage({ cmd: CMD.HSHK }, '*', [this.port2]));
  }

  subscribe(messageHandler) {
    if(messageHandler == null) {
      throw 'Parameter can not be null!';
    }
    this.#port.onmessage = messageHandler;
  }

  unsubscribe(messageHandler) {}

  send(message) {
      this.#port.postMessage(message);
  }

}

export default new SubscribableChannel();
export { CMD, ACTION }
