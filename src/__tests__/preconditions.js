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

describe('Checking Preconditions', () => {
  test('Command not exist', () => {
    const socket = new Socket();
    const command = 'moovit\r\n';
    read(command, socket);
    expect(commands.runCommand).not.toHaveBeenCalled();
    expect(socket.commandNotFound).toHaveBeenCalledTimes(1);
  });
});