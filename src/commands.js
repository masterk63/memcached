const { commandNotFound, badCommandLineFormat, storedMessage, badDataChunk } = require('./socket');
const { GET, GETS, SET, ADD, REPLACE, APPEND, PREPREND, CAS, commandNames, retrievalCommand, commandCasLength, commandsAddLength, commandsGetLength, maxValueUnsigned16bit } = require('./constants/commands');
const Data = require('./models/Data');
const LogUser = require('./models/LogUser');
const { createKey, deleteKeyCache, isKeyStored } = require('./memcached');

const isRetrievalCommand = command => retrievalCommand.includes(command);

const parseCommandValues = command => {
  let [_, key, flag, exptime, bytes] = command;
  flag = parseInt(flag);
  exptime = parseInt(exptime);
  bytes = parseInt(bytes);
  return [key, flag, exptime, bytes];
};

const checkStoreCommand = command => {
  let [key, flag, exptime, bytes] = parseCommandValues(command);
  if (key === '') return commandNotFound();
  if (isNaN(flag) || isNaN(exptime) || isNaN(bytes)) return badCommandLineFormat();
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

//store this data
const set = (command, value) => {
  let [key, flag, exptime, bytes] = parseCommandValues(command);
  if (value.length !== bytes) return badDataChunk();
  const data = new Data(key, flag, exptime, value);
  const logUser = new LogUser();
  data.updateLog.push(logUser);
  createKey(data);
  storedMessage();
};

// store this data, but only if the server *doesn't* already
// hold data for this key
const add = (command, value) => {
  const key = command[1];
  if(isKeyStored(key)) return false;
  set(command, value);
};

const replace = (command, value) => {};

const append = (command, value) => {};

const prepend = (command, value) => {};

const cas = (command, value) => {};

const deleteKey = key => deleteKeyCache(key);

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
