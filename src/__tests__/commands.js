const { runCommand } = require('../commands');
const Socket = require('../models/Socket');
const memcached = require('../memcached');
const cache = memcached.getMemcachedInstance();

jest.mock('../models/Socket');

const parseCommand = command => command.split(' ');

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
});
