//@ts-check
const { checkInvalidCommand, runCommand, isRetrievalCommand } = require('./commands');
const { BAD_DATA_CHUNK, COMMAND_NOT_FOUND, LINE_BREAK } = require('./constants/commands');

let textChunk = '';
let storeCommand = '';

const enterPressed = () => textChunk.includes(LINE_BREAK);

const parseCommand = () =>
  textChunk
    .replace(LINE_BREAK, '')
    .toLowerCase()
    .split(' ');

const read = data => {
  textChunk += data.toString('utf8');
  if (enterPressed()) {
    if (!storeCommand) {
      const command = parseCommand();
      textChunk = '';
      const isInvalidCommand = checkInvalidCommand(command);
      if(isInvalidCommand) return isInvalidCommand;
      if (isRetrievalCommand(command[0])) {
        return runCommand(command);
      } else {
        storeCommand = command;
      }
    } else {
      const command = parseCommand();
      let result;
      if (command.length === 1) {
        const value = command[0];
        result = runCommand(storeCommand, value);
      } else {
        result = [BAD_DATA_CHUNK, COMMAND_NOT_FOUND];
      }
      storeCommand = '';
      textChunk = '';
      return result;
    }
  }
};

module.exports = { read };
