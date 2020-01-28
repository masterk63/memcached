let socket;

const initSocket = skt => (socket = skt);

const writeMessage = message => socket.write(`${message}\r\n`);

//Means the client sent a nonexistent command name.
const commandNotFound = () => {
	writeMessage('ERROR');
	return false;
}

// Means some sort of client error in the input line, i.e. the input
// doesn't conform to the protocol in some way. <error> is a
// human-readable error string.
const clientError = message => writeMessage(`CLIENT_ERROR ${message}`);

const badCommandLineFormat = () => {
	clientError('bad command line format');
	return false;
}

const badDataChunk = () => {
  clientError('bad data chunk');
	commandNotFound();
	return false;
};

const storedMessage = () => writeMessage('STORED');

module.exports = {
  initSocket,
  writeMessage,
  commandNotFound,
	clientError,
	storedMessage,
  badDataChunk,
  badCommandLineFormat
};
