const Command = require('../Command');
const Memcached = require('../models/Memcached');
const memcached = new Memcached().getInstance();
const { STORED, BAD_DATA_CHUNK, COMMAND_NOT_FOUND } = require('../constants/messages');

const parseCommand = command => command.split(' ');

const mockData1 = {
  key: 'foo',
  value: 'say',
  flags: 0,
  cas: 1
};

const mockData2 = {
  key: 'name',
  value: 'kevin',
  flags: 0,
  cas: 2
};

// const appendLogic = command => {
//   const socket = new Socket();
//   const value = 'bye';
//   memcached.createKey(mockData1);
//   runCommand(socket, parseCommand(command), value);
//   expect(socket.storedMessage).toHaveBeenCalledTimes(1);
//   expect(socket.notStoredMessage).not.toHaveBeenCalled();
//   expect(JSON.stringify(cache)).toMatchSnapshot();
//   memcached.deleteKeyCache('foo');
// }

// const getLogicMulti = command => {
//   const socket = new Socket();
//   memcached.createKey(mockData1);
//   memcached.createKey(mockData2);
//   runCommand(socket, parseCommand(command));
//   expect(socket.endMessage).toHaveBeenCalledTimes(1);
//   expect(socket.writeMessage).toHaveBeenCalledTimes(4);
//   expect(socket.writeMessage).toHaveBeenCalledWith('VALUE foo 0 3');
//   expect(socket.writeMessage).toHaveBeenCalledWith('say');
//   expect(socket.writeMessage).toHaveBeenCalledWith('VALUE name 0 5');
//   expect(socket.writeMessage).toHaveBeenCalledWith('kevin');
//   memcached.deleteKeyCache('foo');
//   memcached.deleteKeyCache('name');
// }

describe('Running Commands', () => {
  test('Set command bad chunk', () => {
    const command = 'set foo 3 3 3';
    const value = 'done';
    const result = Command.runCommand(parseCommand(command), value);
    expect(result).toEqual([BAD_DATA_CHUNK, COMMAND_NOT_FOUND]);
    expect(memcached.isKeyStored('foo')).toBe(false);
  });
  test('Set command ran successfully', () => {
    const command = 'set foo 3 3 3';
    const value = 'say';
    const result = Command.runCommand(parseCommand(command), value);
    expect(result).toBe(STORED);
    expect(JSON.stringify(memcached.getInstance())).toMatchSnapshot();
    memcached.deleteKeyCache('foo');
  });
  // test('Set command with exptime -1 (auto delete)', () => {
  //   const socket = new Socket();
  //   const command = 'set foo 3 -1 3';
  //   const value = 'say';
  //   runCommand(socket, parseCommand(command), value);
  //   expect(socket.storedMessage).toHaveBeenCalledTimes(1);
  //   expect(socket.badDataChunk).not.toHaveBeenCalled();
  //   expect(memcached.isKeyStored('foo')).toBe(false);
  // });
  // test('Add command ran successfully', () => {
  //   const socket = new Socket();
  //   const command = 'add foo 3 3 3';
  //   const value = 'say';
  //   runCommand(socket, parseCommand(command), value);
  //   expect(socket.storedMessage).toHaveBeenCalledTimes(1);
  //   expect(socket.badDataChunk).not.toHaveBeenCalled();
  //   expect(JSON.stringify(cache)).toMatchSnapshot();
  //   memcached.deleteKeyCache('foo');
  // });
  // test('Add command not stored', () => {
  //   const socket = new Socket();
  //   const command = 'add foo 3 3 3';
  //   const value = 'say';
  //   memcached.createKey(mockData1);
  //   runCommand(socket, parseCommand(command), value);
  //   expect(socket.notStoredMessage).toHaveBeenCalledTimes(1);
  //   expect(socket.storedMessage).not.toHaveBeenCalled();
  //   memcached.deleteKeyCache('foo');
  // });
  // test('Replace command ran successfully', () => {
  //   const socket = new Socket();
  //   const command = 'replace foo 3 3 3';
  //   const value = 'bye';
  //   memcached.createKey(mockData1);
  //   runCommand(socket, parseCommand(command), value);
  //   expect(socket.storedMessage).toHaveBeenCalledTimes(1);
  //   expect(socket.notStoredMessage).not.toHaveBeenCalled();
  //   expect(JSON.stringify(cache)).toMatchSnapshot();
  //   memcached.deleteKeyCache('foo');
  // });
  // test('Replace command not stored', () => {
  //   const socket = new Socket();
  //   const command = 'replace foo 3 3 3';
  //   const value = 'bye';
  //   runCommand(socket, parseCommand(command), value);
  //   expect(socket.notStoredMessage).toHaveBeenCalledTimes(1);
  //   expect(socket.storedMessage).not.toHaveBeenCalled();
  //   expect(memcached.isKeyStored('foo')).toBe(false);
  // });
  // test('Append command not stored', () => {
  //   const socket = new Socket();
  //   const command = 'append foo 3 3 3';
  //   const value = 'bye';
  //   runCommand(socket, parseCommand(command), value);
  //   expect(socket.notStoredMessage).toHaveBeenCalledTimes(1);
  //   expect(socket.storedMessage).not.toHaveBeenCalled();
  //   expect(memcached.isKeyStored('foo')).toBe(false);
  // });
  // test('Append command bad data chunk', () => {
  //   const socket = new Socket();
  //   const command = 'append foo 3 3 3';
  //   const value = 'byee';
  //   runCommand(socket, parseCommand(command), value);
  //   expect(socket.badDataChunk).toHaveBeenCalledTimes(1);
  //   expect(socket.storedMessage).not.toHaveBeenCalled();
  //   expect(memcached.isKeyStored('foo')).toBe(false);
  // });
  // test('Append command ran successfully', () => {
  //   const command = 'append foo 3 3 3';
  //   appendLogic(command);
  // });
  // test('Prepend command ran successfully', () => {
  //   const command = 'prepend foo 3 3 3';
  //   appendLogic(command);
  // });
  // test('Cas command not found', () => {
  //   const socket = new Socket();
  //   const command = 'cas foo 3 3 3 3';
  //   const value = 'bye';
  //   runCommand(socket, parseCommand(command), value);
  //   expect(socket.writeMessage).toHaveBeenCalledTimes(1);
  //   expect(socket.writeMessage).toHaveBeenCalledWith('NOT_FOUND');
  //   expect(socket.storedMessage).not.toHaveBeenCalled();
  //   expect(memcached.isKeyStored('foo')).toBe(false);
  // });
  // test('Cas command EXISTS', () => {
  //   const socket = new Socket();
  //   const command = 'cas foo 3 3 3 3';
  //   const value = 'bye';
  //   memcached.createKey(mockData1);
  //   runCommand(socket, parseCommand(command), value);
  //   expect(socket.writeMessage).toHaveBeenCalledTimes(1);
  //   expect(socket.writeMessage).toHaveBeenCalledWith('EXISTS');
  //   expect(socket.storedMessage).not.toHaveBeenCalled();
  //   expect(memcached.isKeyStored('foo')).toBe(true);
  //   memcached.deleteKeyCache('foo');
  // });
  // test('Cas command ran successfully', () => {
  //   const socket = new Socket();
  //   const command = 'cas foo 3 3 3 1';
  //   const value = 'cas';
  //   memcached.createKey(mockData1);
  //   runCommand(socket, parseCommand(command), value);
  //   expect(socket.writeMessage).not.toHaveBeenCalled();
  //   expect(socket.storedMessage).toHaveBeenCalledTimes(1);
  //   expect(JSON.stringify(cache)).toMatchSnapshot();
  //   memcached.deleteKeyCache('foo');
  // });
  // test('Get command key not found', () => {
  //   const socket = new Socket();
  //   const command = 'get hola';
  //   runCommand(socket, parseCommand(command));
  //   expect(socket.endMessage).toHaveBeenCalledTimes(1);
  // });
  // test('Get command ran successfully with 1 param', () => {
  //   const socket = new Socket();
  //   const command = 'get foo';
  //   memcached.createKey(mockData1);
  //   runCommand(socket, parseCommand(command));
  //   expect(socket.endMessage).toHaveBeenCalledTimes(1);
  //   expect(socket.writeMessage).toHaveBeenCalledTimes(2);
  //   expect(socket.writeMessage).toHaveBeenCalledWith('VALUE foo 0 3');
  //   expect(socket.writeMessage).toHaveBeenCalledWith('say');
  //   memcached.deleteKeyCache('foo');
  // });
  // test('Get command ran successfully with 2 param', () => {
  //   const command = 'get foo name';
  //   getLogicMulti(command);
  // });
  // test('Get command ran with 3 param and 1 miss', () => {
  //   const command = 'get foo name notstored';
  //   getLogicMulti(command);
  // });
  // test('Gets command ran successfully with 1 param', () => {
  //   const socket = new Socket();
  //   const command = 'gets foo';
  //   memcached.createKey(mockData1);
  //   runCommand(socket, parseCommand(command));
  //   expect(socket.endMessage).toHaveBeenCalledTimes(1);
  //   expect(socket.writeMessage).toHaveBeenCalledTimes(2);
  //   expect(socket.writeMessage).toHaveBeenCalledWith('VALUE foo 0 3 1');
  //   expect(socket.writeMessage).toHaveBeenCalledWith('say');
  //   memcached.deleteKeyCache('foo');
  // });
});
