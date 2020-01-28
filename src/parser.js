const { isValidCommand, runCommand, isGetCommand } = require('./commands');
const LINE_BREAK = '\r\n';
let textChunk = '';
let addCommand = '';

const enterPressed = () => textChunk.includes(LINE_BREAK);

const deleteLineBreak = () => textChunk.replace(LINE_BREAK, '');

const read = data => {
  textChunk += data.toString('utf8');
  if (enterPressed()) {
    if (!addCommand) {
      const command = deleteLineBreak();
      if (isValidCommand(command)) {
        if(isGetCommand(command)) {
          runCommand(command);
        } else {
          addCommand = command;
        }
      }
    } else {
      const value = deleteLineBreak();
      runCommand(addCommand, value);
      addCommand= '';
    }
    textChunk = '';
  }
};

module.exports = { read };
