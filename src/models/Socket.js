class Socket {

  constructor(socket) {
    this.socket = socket;
  }

	getInstance() {
		return this.socket;
	}

  writeMessage(message) {
    this.socket.write(`${message}\r\n`);
  }

  //Means the client sent a nonexistent command name.
  commandNotFound() {
    this.writeMessage('ERROR');
    return false;
  }

  // Means some sort of client error in the input line, i.e. the input
  // doesn't conform to the protocol in some way. <error> is a
  // human-readable error string.
  clientError(message) {
    this.writeMessage(`CLIENT_ERROR ${message}`);
  }

  badCommandLineFormat() {
    this.clientError('bad command line format');
    return false;
  }

  badDataChunk() {
    this.clientError('bad data chunk');
    this.commandNotFound();
    return false;
  }

  storedMessage() {
    this.writeMessage('STORED');
  }

  notStoredMessage() {
    this.writeMessage('NOT_STORED');
    return false;
  }

  endMessage() {
    this.writeMessage('END');
  }

  getValueMessage({ key, flags, value, cas, showCas }) {
    let message = `VALUE ${key} ${flags} ${value.length}`;
    if (showCas) message += ` ${cas}`;
    this.writeMessage(message);
    this.writeMessage(`${value}`);
  }

  getCurrentUser() {
    return `${this.socket.remoteAddress}:${this.socket.remotePort}`;
  }
}

module.exports = Socket;
