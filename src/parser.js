//@ts-check
const Command = require('./models/Commands');
const command = new Command();
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
      const commandParsed = parseCommand();
      textChunk = '';
      const isInvalidCommand = command.checkInvalidCommand(commandParsed);
      if(isInvalidCommand) return isInvalidCommand;
      if (command.isRetrievalCommand(commandParsed[0])) {
        return command.runCommand(commandParsed);
      } else {
        storeCommand = commandParsed;
      }
    } else {
      const commandParsed = parseCommand();
      let result;
      if (commandParsed.length === 1) {
        const value = commandParsed[0];
        result = command.runCommand(storeCommand, value);
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
