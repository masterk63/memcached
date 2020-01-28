const { isValidCommand, runCommand, isRetrievalCommand } = require('./commands');
const { badDataChunk } = require('./socket');
const LINE_BREAK = '\r\n';
let textChunk = '';
let addCommand = '';

const enterPressed = () => textChunk.includes(LINE_BREAK);

const parseCommand = () =>
  textChunk
    .replace(LINE_BREAK, '')
    .toLowerCase()
    .split(' ');

const read = data => {  
  textChunk += data.toString('utf8');
  if (enterPressed()) {
    if (!addCommand) {
      const command = parseCommand();
      if (isValidCommand(command)) {
        if (isRetrievalCommand(command[0])) {
          runCommand(command);
        } else {
          addCommand = command;
        }
      }
    } else {
      const command = parseCommand();
      if (command.length === 1) {
        const value = command[0];
        runCommand(addCommand, value);
      } else {
        badDataChunk();
      }
      addCommand = '';
    }
    textChunk = '';
  }
};

module.exports = { read };
