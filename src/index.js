const CMD = {
  HSHK: 1,
  EU: 2,
  SYNC: 4,
}

const ACTION = {
  NONE: 8,
  EDIT: 16
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
        console.log('🤝 got handshake from server', event);
        this.#port = event.ports[0];
        this.#port.addEventListener('message', messageHandler);
        this.#port.addEventListener('message', (event) => this.postMessage(event.data));
        this.#port.addEventListener('messageerror', this.error);
        this.#port.start();
        
        handler(event);
        
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

  error(error) {
    console.error(error);
  }

}

const useSubscribe = (self, messageHandler) => {
  const ch = new SubscribableChannel(self.dataset.propertyName);
  ch.subscribe(messageHandler);
  ['click', 'focus'].forEach(event => {
    self.addEventListener(event, (e) => {
      e.preventDefault();
      e.stopPropagation();
      ch.send({
        cmd: CMD.EU,
        updates: [
          {
            lastUserInteraction: new Date().toJSON(),
            action: ACTION.EDIT,
            origin: location.origin,
            currentPath: location.pathname,
            propertyName: self.dataset.propertyName,
            editorName: self.dataset.editorName,
            placeholder: self.ariaPlaceholder,
          },
        ],
      });
  })
  });
  return ch;
};

export {
  CMD,
  ACTION,
  SubscribableChannel,
  useSubscribe
}
