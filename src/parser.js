const { isValidCommand, runCommand, isGetCommand } = require('./commands');
const LINE_BREAK = '\r\n';
let textChunk = '';
let addCommand = '';

const enterPressed = () => textChunk.includes(LINE_BREAK);

const parseCommand = () =>
  textChunk.replace(LINE_BREAK, '')
  .toLowerCase()
  .split(' ');

const read = data => {
  textChunk += data.toString('utf8');
  if (enterPressed()) {
    if (!addCommand) {
      const command = parseCommand();
      if (isValidCommand(command)) {
        if(isGetCommand(command[0])) {
          runCommand(command);
        } else {
          addCommand = command;
        }
      }
    } else {
      const value = parseCommand()[0];
      runCommand(addCommand, value);
      addCommand= '';
    }
    textChunk = '';
  }
};

module.exports = { read };
