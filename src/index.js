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

export default new SubscribableChannel();
export { CMD, ACTION }
