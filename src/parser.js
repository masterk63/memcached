const Command = require('./Commands');
const { BAD_DATA_CHUNK, COMMAND_NOT_FOUND, LINE_BREAK } = require('./constants/commands');

class Parser {
  constructor() {
    this.textChunk = '';
    this.storeCommand = '';
  }

  enterPressed() {
    return this.textChunk.includes(LINE_BREAK);
  }

  parseCommand() {
    return this.textChunk
      .replace(LINE_BREAK, '')
      .toLowerCase()
      .split(' ');
  }

  read(data) {
    this.textChunk += data.toString('utf8');
    if (this.enterPressed()) {
      if (!this.storeCommand) {
        const commandParsed = this.parseCommand();
        this.textChunk = '';
        const isInvalidCommand = Command.checkInvalidCommand(commandParsed);
        if (isInvalidCommand) return isInvalidCommand;
        if (Command.isRetrievalCommand(commandParsed[0])) {
          return Command.runCommand(commandParsed);
        } else {
          this.storeCommand = commandParsed;
        }
      } else {
        const commandParsed = this.parseCommand();
        let result;
        if (commandParsed.length === 1) {
          const value = commandParsed[0];
          result = Command.runCommand(this.storeCommand, value);
        } else {
          result = [BAD_DATA_CHUNK, COMMAND_NOT_FOUND];
        }
        this.storeCommand = '';
        this.textChunk = '';
        return result;
      }
    }
  }
}

module.exports = Parser;
