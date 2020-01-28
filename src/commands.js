const { commandNotFound, badCommandLineFormat, storedMessage } = require('./socket');
const GET = 'get';
const GETS = 'gets';
const SET = 'set';
const ADD = 'add';
const REPLACE = 'replace';
const APPEND = 'append';
const PREPREND = 'prepend';
const CAS = 'cas';
const commandNames = [GET, GETS, SET, ADD, REPLACE, APPEND, PREPREND, CAS];
const retrievalCommand = [GET, GETS];
const commandCasLength = 6;
const commandsAddLength = 5;
const commandsGetLength = 2;
const maxValueUnsigned16bit = 65535;

const isRetrievalCommand = command => retrievalCommand.includes(command);

const checkStoreCommand = command => {
  let [_, key, flag, exptime, bytes] = command;
  if(key === '') return commandNotFound();
  if (isNaN(flag) || isNaN(exptime) || isNaN(bytes)) return badCommandLineFormat();
  flag = parseInt(flag);
  exptime = parseInt(exptime);
  bytes = parseInt(bytes);
  if (flag < 0 || flag > maxValueUnsigned16bit || bytes < 0) return badCommandLineFormat();
  return true;
};

const isValidCommand = fullCommand => {
  const commandName = fullCommand[0];
  if (commandNames.includes(commandName)) {
    if (commandName === CAS && fullCommand.length === commandCasLength) return true;
    if (isRetrievalCommand(commandName) && fullCommand.length === commandsGetLength) return true;
    if (fullCommand.length === commandsAddLength) return checkStoreCommand(fullCommand);
  }
  return commandNotFound();
};

const get = command => {};

const gets = command => {};

const set = (command, value) => {
  console.log('estyo');
  storedMessage();
};

const add = (command, value) => {};

const replace = (command, value) => {};

const append = (command, value) => {};

const prepend = (command, value) => {};

const cas = (command, value) => {};

const deleteKey = key => {};

const runCommand = (command, value) => {
  const commandName = command[0];
  switch (commandName) {
    case GET:
      get(command);
      break;
    case GETS:
      gets(command);
      break;
    case SET:
      set(command, value);
      break;
    case ADD:
      add(command, value);
      break;
    case REPLACE:
      replace(command, value);
      break;
    case APPEND:
      append(command, value);
      break;
    case PREPREND:
      prepend(command, value);
      break;
    case CAS:
      cas(command, value);
      break;
    default:
      break;
  }
};

module.exports = { isValidCommand, runCommand, isRetrievalCommand, deleteKey };
