const { runCommand } = require('../commands');
const Socket = require('../models/Socket');
const memcached = require('../memcached');
const cache = memcached.getMemcachedInstance();

jest.mock('../models/Socket');

const parseCommand = command => command.split(' ');

const mockData1 = {
  key: 'foo',
  value: 'say',
  flags: 3,
  cas: 1,
  fetchLog: [],
  updateLog: []
};

beforeEach(() => {
  Socket.mockClear();
});

describe('Store Commands', () => {
  test('Set command bad chunk', () => {
    const socket = new Socket();
    const command = 'set foo 3 3 3';
    const value = 'done';
    runCommand(socket, parseCommand(command), value);
    expect(socket.badDataChunk).toHaveBeenCalledTimes(1);
    expect(socket.storedMessage).not.toHaveBeenCalled();
    expect(memcached.isKeyStored('foo')).toBe(false);
  });
  test('Set command ran successfully', () => {
    const socket = new Socket();
    const command = 'set foo 3 3 3';
    const value = 'say';
    runCommand(socket, parseCommand(command), value);
    expect(socket.storedMessage).toHaveBeenCalledTimes(1);
    expect(socket.badDataChunk).not.toHaveBeenCalled();
    expect(JSON.stringify(cache)).toMatchSnapshot();
    memcached.deleteKeyCache('foo');
  });
  test('Set command with exptime -1 (auto delete)', () => {
    const socket = new Socket();
    const command = 'set foo 3 -1 3';
    const value = 'say';
    runCommand(socket, parseCommand(command), value);
    expect(socket.storedMessage).toHaveBeenCalledTimes(1);
    expect(socket.badDataChunk).not.toHaveBeenCalled();
    expect(memcached.isKeyStored('foo')).toBe(false);
  });
  test('Add command ran successfully', () => {
    const socket = new Socket();
    const command = 'add foo 3 3 3';
    const value = 'say';
    runCommand(socket, parseCommand(command), value);
    expect(socket.storedMessage).toHaveBeenCalledTimes(1);
    expect(socket.badDataChunk).not.toHaveBeenCalled();
    expect(JSON.stringify(cache)).toMatchSnapshot();
    memcached.deleteKeyCache('foo');
  });
  test('Add command not stored', () => {
    const socket = new Socket();
    const command = 'add foo 3 3 3';
    const value = 'say';
    memcached.createKey(mockData1);
    runCommand(socket, parseCommand(command), value);
    expect(socket.notStoredMessage).toHaveBeenCalledTimes(1);
    expect(socket.storedMessage).not.toHaveBeenCalled();
    memcached.deleteKeyCache('foo');
  });
  test('Replace command ran successfully', () => {
    const socket = new Socket();
    const command = 'replace foo 3 3 3';
    const value = 'bye';
    memcached.createKey(mockData1);
    runCommand(socket, parseCommand(command), value);
    expect(socket.storedMessage).toHaveBeenCalledTimes(1);
    expect(socket.notStoredMessage).not.toHaveBeenCalled();
    expect(JSON.stringify(cache)).toMatchSnapshot();
    memcached.deleteKeyCache('foo');
  });
  test('Replace command not stored', () => {
    const socket = new Socket();
    const command = 'replace foo 3 3 3';
    const value = 'bye';
    runCommand(socket, parseCommand(command), value);
    expect(socket.notStoredMessage).toHaveBeenCalledTimes(1);
    expect(socket.storedMessage).not.toHaveBeenCalled();
    expect(memcached.isKeyStored('foo')).toBe(false);
  });
});
