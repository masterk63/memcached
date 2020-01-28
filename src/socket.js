let socket;

const initSocket = skt => socket = skt;

const writeMessage = message => socket.write(`${message}\r\n`);

//Means the client sent a nonexistent command name.
const commandNotFound = () => writeMessage('ERROR');

// Means some sort of client error in the input line, i.e. the input
// doesn't conform to the protocol in some way. <error> is a
// human-readable error string.
const clientError = message => writeMessage(`CLIENT_ERROR ${message}`);

module.exports = { initSocket, writeMessage, commandNotFound, clientError };
