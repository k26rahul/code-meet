export default class AchexWs {
  ws;
  isAuthenticated = false;
  constructor({ url, auth, passwd, onPayload }) {
    this.ws = new WebSocket(url);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);

    this.auth = auth;
    this.passwd = passwd;
    this.onPayload = onPayload;
  }

  onOpen() {
    log('ws: connected');
    this.authenticate();
  }

  onMessage(event) {
    let data = JSON.parse(event.data);
    log('ws: onmessage', data);

    if (data.auth === 'OK') {
      this.isAuthenticated = true;
      return;
    }
    if (!this.isAuthenticated) {
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
      auth: this.auth,
      passwd: this.passwd,
    });
  }
}
