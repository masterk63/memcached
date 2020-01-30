//@ts-check
const { GET, GETS, SET, ADD, REPLACE, APPEND, PREPREND, CAS, commandNames, retrievalCommand, commandCasLength, commandsAddLength, commandsGetLength, maxValueUnsigned16bit } = require('./constants/commands');
const { createKey, deleteKeyCache, isKeyStored, readKey, updateKey } = require('./memcached');
const { getIncrementCas } = require('./cas');
const Data = require('./models/Data');

const isRetrievalCommand = command => retrievalCommand.includes(command);

const parseCommandValues = command => {
  let [_, key, flag, exptime, bytes] = command;
  flag = parseInt(flag);
  exptime = parseInt(exptime);
  bytes = parseInt(bytes);
  return [key, flag, exptime, bytes];
};

const checkStoreCommand = (command, socket) => {
  let [key, flag, exptime, bytes] = parseCommandValues(command);
  if (key === '') return socket.commandNotFound();
  if (isNaN(flag) || isNaN(exptime) || isNaN(bytes)) return socket.badCommandLineFormat();
  if (flag < 0 || flag > maxValueUnsigned16bit || bytes < 0) return socket.badCommandLineFormat();
  return true;
};

const isValidCommand = (fullCommand, socket) => {
  const commandName = fullCommand[0];
  if (commandNames.includes(commandName)) {
    if (commandName === CAS && fullCommand.length === commandCasLength) return true;
    if (isRetrievalCommand(commandName) && fullCommand.length > commandsGetLength) return true;
    if (commandName !== CAS && fullCommand.length === commandsAddLength) return checkStoreCommand(fullCommand, socket);
  }
  return socket.commandNotFound();
};

const get = (socket, values, showCas = false) => {
  values.shift();
  values.forEach(value => {
    const storedValue = readKey(value);
    if(storedValue) socket.getValueMessage({ ...storedValue, showCas });
  });
  socket.endMessage();
};

const gets = (socket, values) => get(socket, values, true);

//store this data
const set = (command, value, socket) => {
  let [key, flag, exptime, bytes] = parseCommandValues(command);
  if (value.length !== bytes) return socket.badDataChunk();
  if(exptime < 0) return socket.storedMessage();
  const data = new Data(key, flag, exptime, value);
  createKey(data);
  socket.storedMessage();
};

// store this data, but only if the server *doesn't* already
// hold data for this key
const add = (command, value, socket) => {
  const key = command[1];
  if(isKeyStored(key)) return socket.notStoredMessage();
  set(command, value, socket);
};

const replace = (command, value, socket) => {
  const key = command[1];
  if(!isKeyStored(key)) return socket.notStoredMessage();
  set(command, value, socket);
};

const appendLogic = isAppend  => (command, value, socket) => {
  let [key, _, __, bytes] = parseCommandValues(command);
  if (value.length !== bytes) return socket.badDataChunk();
  if(!isKeyStored(key)) return socket.notStoredMessage();
  const data = { ...readKey(key) };
  data.value = isAppend ? `${data.value}${value}` : `${value}${data.value}`;
  data.cas = getIncrementCas();
  updateKey(data);
  socket.storedMessage();
};

const append = appendLogic(true);

const prepend = appendLogic(false);

const cas = (command, value, socket) => {
  const key = command[1];
  const userCas = parseInt(command[5]);
  if(!isKeyStored(key)) return socket.writeMessage('NOT_FOUND');
  const data = readKey(key);
  if(data.cas !== userCas) return socket.writeMessage('EXISTS');
  set(command, value, socket);
};

const deleteKey = key => deleteKeyCache(key);

const runCommand = (socket, command, value) => {
  const commandName = command[0];
  switch (commandName) {
    case GET:
      get(socket, command);
      break;
    case GETS:
      gets(socket, command);
      break;
    case SET:
      set(command, value, socket);
      break;
    case ADD:
      add(command, value, socket);
      break;
    case REPLACE:
      replace(command, value, socket);
      break;
    case APPEND:
      append(command, value, socket);
      break;
    case PREPREND:
      prepend(command, value, socket);
      break;
    case CAS:
      cas(command, value, socket);
      break;
    default:
      break;
  }
};

module.exports = { isValidCommand, runCommand, isRetrievalCommand, deleteKey };
