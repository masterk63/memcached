const { isValidCommand, runCommand, isRetrievalCommand } = require('./commands');
const LINE_BREAK = '\r\n';
let textChunk = '';
let addCommand = '';

const enterPressed = () => textChunk.includes(LINE_BREAK);

const parseCommand = () =>
  textChunk
    .replace(LINE_BREAK, '')
    .toLowerCase()
    .split(' ');

const read = (data, socket) => {  
  textChunk += data.toString('utf8');
  if (enterPressed()) {
    if (!addCommand) {
      const command = parseCommand();
      if (isValidCommand(command, socket)) {
        if (isRetrievalCommand(command[0])) {
          runCommand(socket, command);
        } else {
          addCommand = command;
        }
      }
    } else {
      const command = parseCommand();
      if (command.length === 1) {
        const value = command[0];
        runCommand(socket, addCommand, value);
      } else {
        socket.badDataChunk();
      }
      addCommand = '';
    }
    textChunk = '';
  }
};

module.exports = { read };
