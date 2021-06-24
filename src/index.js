const IFRAME = document.querySelector('iframe[is=my-iframe]');

class SubscribableChannel extends MessageChannel {

  #port
  #target

  constructor(target) {
    super();
    this.#port = this.port1;
    this.#target = target;
    const payload = { cmd: CMD.HSHK };
    this.#target.contentWindow.postMessage( { ...payload }, '*', [this.port2]);
  }

  subscribe(messageHandler) {
    if(messageHandler == null) {
      throw 'Parameter can not be null!';
    }
    this.port1.onmessage = messageHandler;
  }

  unsubscribe(messageHandler) {}

  send(message) {
      this.#port.postMessage(message);
  }

}

export default new SubscribableChannel(IFRAME);