const IFRAME = document.querySelector('iframe[is=my-iframe]');

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
  }

  subscribe(messageHandler) {
    if(messageHandler == null) {
      throw 'Parameter can not be null!';
    }
    this.#target = IFRAME;
    this.#target.contentWindow.postMessage({ cmd: CMD.HSHK }, '*', [this.port2]);    
    this.#port.onmessage = messageHandler;
  }

  unsubscribe(messageHandler) {}

  send(message) {
      this.#port.postMessage(message);
  }

}

export default new SubscribableChannel();
export { CMD, ACTION }