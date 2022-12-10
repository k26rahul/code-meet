export default class AchexWs {
  ws;
  isAuthenticated = false;
  constructor({ url, setID, passwd, onPayload }) {
    this.ws = new WebSocket(url);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);

    this.setID = setID;
    this.passwd = passwd;
    this.onPayload = onPayload;
  }

  onOpen(event) {
    log('ws: connected');
  }

  onMessage(event) {
    let data = JSON.parse(event.data);
    log('ws: onmessage', data);

    if (data.auth === 'ok') {
      this.isAuthenticated = true;
      return;
    }
    if (!this.isAuthenticated) {
      this.authenticate();
      return;
    }

    this.onPayload(data.payload);
  }

  onError(event) {
    log('ws: onerror', event);
  }

  onClose(event) {
    log('ws: onclose', event);
  }

  send(messageObj) {
    this.ws.send(JSON.stringify(messageObj));
  }

  authenticate() {
    this.send({
      setID: this.setID,
      passwd: this.passwd,
    });
  }
}
