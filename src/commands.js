const { commandNotFound, clientError } = require('./socket');
const GET = 'get';
const GETS = 'gets';
const SET = 'set';
const ADD = 'add';
const REPLACE = 'replace';
const APPEND = 'append';
const PREPREND = 'prepend';
const CAS = 'cas';
const commandNames = [GET, GETS, SET, ADD, REPLACE, APPEND, PREPREND, CAS];
const getCommands = [GET, GETS];
const commandCasLength = 6;
const commandsAddLength = 5;
const commandsGetLength = 2;

const isGetCommand = command => getCommands.includes(command);

const isValidCommand = fullCommand => {
  const commandName = fullCommand[0];
  if (commandNames.includes(commandName)) {
    if (commandName === CAS && fullCommand.length === commandCasLength) return true;
    if (isGetCommand(commandName) && fullCommand.length === commandsGetLength) return true;
    if (fullCommand.length === commandsAddLength) return true;
    clientError('length error');
    return false;
  } else {
    commandNotFound();
    return false;
  }
};

const get = command => {};

const gets = command => {};

const set = command => {};

const add = command => {};

const replace = command => {};

const append = command => {};

const prepend = command => {};

const cas = command => {};

const runCommand = command => {
  const commandName = command[0];
  switch (commandName) {
    case GET:
      get(command);
      break;
    case GETS:
      gets(command);
      break;
    case SET:
      set(command);
      break;
    case ADD:
      add(command);
      break;
    case REPLACE:
      replace(command);
      break;
    case APPEND:
      append(command);
      break;
    case PREPREND:
      prepend(command);
      break;
    case CAS:
      cas(command);
      break;
    default:
      break;
  }
};

module.exports = { isValidCommand, runCommand, isGetCommand };
