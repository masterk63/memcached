const { LINE_BREAK } = require('../constants/commands');

class Socket {
  constructor(socket) {
    this.socket = socket;
  }

  getInstance() {
    return this.socket;
  }

  writeMessage(msg) {
    const messages = Array.isArray(msg) ? msg : [msg];
    messages.map(message => this.socket.write(`${message}${LINE_BREAK}`));
  }

  getCurrentUser() {
    return `${this.socket.remoteAddress}:${this.socket.remotePort}`;
  }
}

module.exports = Socket;
