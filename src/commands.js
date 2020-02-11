//@ts-check
const {
  GET,
  GETS,
  SET,
  ADD,
  REPLACE,
  APPEND,
  PREPREND,
  CAS,
  COMMANDS_NAMES,
  STORED,
  END,
  BAD_DATA_CHUNK,
  NOT_STORED,
  NOT_FOUND,
  EXISTS,
  RETRIEVAL_COMMANDS,
  COMMAND_CAS_LENGTH,
  COMMANDS_ADD_LENGTH,
  COMMANDS_GET_LENGTH,
  MAX_VALUES_UNSIGNED_16BIT,
  BAD_COMMAND_LINE_FORMAT,
  COMMAND_NOT_FOUND
} = require('./constants/commands');
const { createKey, deleteKeyCache, isKeyStored, readKey, updateKey } = require('./memcached');

const isRetrievalCommand = command => RETRIEVAL_COMMANDS.includes(command);

const parseCommandValues = command => {
  let [_, key, flag, exptime, bytes] = command;
  flag = parseInt(flag);
  exptime = parseInt(exptime);
  bytes = parseInt(bytes);
  return [key, flag, exptime, bytes];
};

const checkInvalidCommand = fullCommand => {
  const commandName = fullCommand[0];
  const [key, flag, exptime, bytes] = parseCommandValues(fullCommand);
  if (
    !COMMANDS_NAMES.includes(commandName) ||
    (commandName === CAS && fullCommand.length !== COMMAND_CAS_LENGTH) ||
    (isRetrievalCommand(commandName) && fullCommand.length < COMMANDS_GET_LENGTH) ||
    (!isRetrievalCommand(commandName) && commandName !== CAS && fullCommand.length !== COMMANDS_ADD_LENGTH) ||
    (!isRetrievalCommand(commandName) && key === '')
  )
    return COMMAND_NOT_FOUND;
  if (
    !isRetrievalCommand(commandName) &&
    (isNaN(flag) || isNaN(exptime) || isNaN(bytes) || flag < 0 || flag > MAX_VALUES_UNSIGNED_16BIT || bytes < 0)
  )
    return BAD_COMMAND_LINE_FORMAT;
};

const getValueMessage = ({ key, flags, value, cas, showCas }, messageArray) => {
  let message = `VALUE ${key} ${flags} ${value.length}`;
  if (showCas) message += ` ${cas}`;
  messageArray.push(message);
  messageArray.push(`${value}`);
};

const get = (values, showCas = false) => {
  const message = [];
  values.shift();
  values.forEach(value => {
    const storedValue = readKey(value);
    if (storedValue) getValueMessage({ ...storedValue, showCas }, message);
  });
  message.push(END);
  return message;
};

const gets = values => get(values, true);

//store this data
const set = (command, value) => {
  let [key, flag, exptime, bytes] = parseCommandValues(command);
  if (value.length !== bytes) return [BAD_DATA_CHUNK, COMMAND_NOT_FOUND];
  if (exptime < 0) return STORED;
  createKey({ key, flag, exptime, value });
  return STORED;
};

// store this data, but only if the server *doesn't* already
// hold data for this key
const add = (command, value) => {
  const key = command[1];
  if (isKeyStored(key)) return NOT_STORED;
  return set(command, value);
};

const replace = (command, value) => {
  const key = command[1];
  if (!isKeyStored(key)) return NOT_STORED;
  return set(command, value);
};

const appendLogic = isAppend => (command, value) => {
  let [key, _, __, bytes] = parseCommandValues(command);
  if (value.length !== bytes) return [BAD_DATA_CHUNK, COMMAND_NOT_FOUND];
  if (!isKeyStored(key)) return NOT_STORED;
  const data = { ...readKey(key) };
  data.value = isAppend ? `${data.value}${value}` : `${value}${data.value}`;
  updateKey(data);
  return STORED;
};

const append = appendLogic(true);

const prepend = appendLogic(false);

const cas = (command, value) => {
  const key = command[1];
  const userCas = parseInt(command[5]);
  if (!isKeyStored(key)) return NOT_FOUND;
  const data = readKey(key);
  if (data.cas !== userCas) return EXISTS;
  return set(command, value);
};

const deleteKey = key => deleteKeyCache(key);

const runCommand = (command, value) => {
  const commandName = command[0];
  switch (commandName) {
    case GET:
      return get(command);
    case GETS:
      return gets(command);
    case SET:
      return set(command, value);
    case ADD:
      return add(command, value);
    case REPLACE:
      return replace(command, value);
    case APPEND:
      return append(command, value);
    case PREPREND:
      return prepend(command, value);
    case CAS:
      return cas(command, value);
    default:
      break;
  }
};

module.exports = { checkInvalidCommand, runCommand, isRetrievalCommand, deleteKey };
