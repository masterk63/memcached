const { read } = require('../parser');
const Socket = require('../models/Socket');
const commands = require('../commands');
jest.mock('../models/Socket');
jest.mock('../commands', () => ({
  ...require.requireActual('../commands'),
  runCommand: jest.fn()
}));

beforeEach(() => {
  Socket.mockClear();
});

const basicStructure = (command, fun) => {
  const socket = new Socket();
  read(`${command}\r\n`, socket);
  expect(commands.runCommand).not.toHaveBeenCalled();
  expect(socket[fun]).toHaveBeenCalledTimes(1);
};

describe('Checking Preconditions', () => {
  test('Command not exist', () => {
    basicStructure('moovit', 'commandNotFound');
  });
  test('Command with bad number of params', () => {
    basicStructure('set foo 3 3', 'commandNotFound');
  });
  test('Store Command with empty key', () => {
    basicStructure('set   3 3 3', 'commandNotFound');
  });
  test('Store Command not meet correct type', () => {
    basicStructure('set foo 3 hola 3', 'badCommandLineFormat');
  });
  test('Store Command not meet correct type', () => {
    basicStructure('set foo -3 3 3', 'badCommandLineFormat');
  });
  test('Store Command not meet correct type', () => {
    basicStructure('set foo 3 3 -3', 'badCommandLineFormat');
  });
});