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
} = require('../constants/commands');
const Memcached = require('../memcached');
const memcached = new Memcached();

class Command {
  isRetrievalCommand(command) {
    return RETRIEVAL_COMMANDS.includes(command);
  }

  parseCommandValues(command) {
    let [_, key, flag, exptime, bytes] = command;
    flag = parseInt(flag);
    exptime = parseInt(exptime);
    bytes = parseInt(bytes);
    return [key, flag, exptime, bytes];
  }

  checkInvalidCommand(fullCommand) {
    const commandName = fullCommand[0];
    const [key, flag, exptime, bytes] = this.parseCommandValues(fullCommand);
    if (
      !COMMANDS_NAMES.includes(commandName) ||
      (commandName === CAS && fullCommand.length !== COMMAND_CAS_LENGTH) ||
      (this.isRetrievalCommand(commandName) && fullCommand.length < COMMANDS_GET_LENGTH) ||
      (!this.isRetrievalCommand(commandName) && commandName !== CAS && fullCommand.length !== COMMANDS_ADD_LENGTH) ||
      (!this.isRetrievalCommand(commandName) && key === '')
    )
      return COMMAND_NOT_FOUND;
    if (
      !this.isRetrievalCommand(commandName) &&
      (isNaN(flag) || isNaN(exptime) || isNaN(bytes) || flag < 0 || flag > MAX_VALUES_UNSIGNED_16BIT || bytes < 0)
    )
      return BAD_COMMAND_LINE_FORMAT;
  }

  getValueMessage({ key, flags, value, cas, showCas }, messageArray) {
    let message = `VALUE ${key} ${flags} ${value.length}`;
    if (showCas) message += ` ${cas}`;
    messageArray.push(message);
    messageArray.push(`${value}`);
  }

  get(values, showCas = false) {
    const message = [];
    values.shift();
    values.forEach(value => {
      const storedValue = memcached.readKey(value);
      if (storedValue) this.getValueMessage({ ...storedValue, showCas }, message);
    });
    message.push(END);
    return message;
  }

  gets(values) {
    return this.get(values, true);
  }

  //store this data
  set(command, value) {
    let [key, flags, exptime, bytes] = this.parseCommandValues(command);
    if (value.length !== bytes) return [BAD_DATA_CHUNK, COMMAND_NOT_FOUND];
    if (exptime < 0) return STORED;
    memcached.createKey({ key, flags, exptime, value });
    return STORED;
  }

  // store this data, but only if the server *doesn't* already
  // hold data for this key
  add(command, value) {
    const key = command[1];
    if (memcached.isKeyStored(key)) return NOT_STORED;
    return this.set(command, value);
  }

  replace(command, value) {
    const key = command[1];
    if (!memcached.isKeyStored(key)) return NOT_STORED;
    return this.set(command, value);
  }

  appendLogic(isAppend, command, value) {
    let [key, _, __, bytes] = this.parseCommandValues(command);
    if (value.length !== bytes) return [BAD_DATA_CHUNK, COMMAND_NOT_FOUND];
    if (!memcached.isKeyStored(key)) return NOT_STORED;
    const data = { ...memcached.readKey(key) };
    data.value = isAppend ? `${data.value}${value}` : `${value}${data.value}`;
    memcached.updateKey(data);
    return STORED;
  }

  append(command, value) {
    return this.appendLogic(true, command, value);
  }

  prepend(command, value) {
    return this.appendLogic(false, command, value);
  }

  cas(command, value) {
    const key = command[1];
    const userCas = parseInt(command[5]);
    if (!memcached.isKeyStored(key)) return NOT_FOUND;
    const data = memcached.readKey(key);
    if (data.cas !== userCas) return EXISTS;
    return this.set(command, value);
  }

  deleteKey(key) {
    memcached.deleteKeyCache(key);
  }

  runCommand(command, value) {
    const commandName = command[0];
    switch (commandName) {
      case GET:
        return this.get(command);
      case GETS:
        return this.gets(command);
      case SET:
        return this.set(command, value);
      case ADD:
        return this.add(command, value);
      case REPLACE:
        return this.replace(command, value);
      case APPEND:
        return this.append(command, value);
      case PREPREND:
        return this.prepend(command, value);
      case CAS:
        return this.cas(command, value);
      default:
        break;
    }
  }
}

module.exports = Command;
