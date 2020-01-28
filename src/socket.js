let socket;

const initSocket = skt => socket = skt;

const writeMessage = message => socket.write(`${message}\r\n`);

module.exports = { initSocket, writeMessage };
