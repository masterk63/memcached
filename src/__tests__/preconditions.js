const Parser = require('../Parser');
const parser = new Parser();
const Commands = require('../Command');
const { COMMAND_NOT_FOUND, BAD_COMMAND_LINE_FORMAT } = require('../constants/messages');
jest.mock('../Command', function() {
  const mockRealCommand = jest.requireActual('../Command');
  jest.spyOn(mockRealCommand, 'runCommand');
  return mockRealCommand;
});

const basicStructure = (command, result) => {
  const response = parser.read(`${command}\r\n`);
  expect(Commands.runCommand).not.toHaveBeenCalled();
  expect(response).toBe(result);
};

describe('Checking Preconditions', () => {
  test('Command not exist', () => {
    basicStructure('moovit', COMMAND_NOT_FOUND);
  });
  test('Command with bad number of params', () => {
    basicStructure('set foo 3 3', COMMAND_NOT_FOUND);
  });
  test('Store Command with empty key', () => {
    basicStructure('set   3 3 3', COMMAND_NOT_FOUND);
  });
  test('Store Command not meet correct type', () => {
    basicStructure('set foo 3 hola 3', BAD_COMMAND_LINE_FORMAT);
  });
  test('Store Command not meet correct type', () => {
    basicStructure('set foo -3 3 3', BAD_COMMAND_LINE_FORMAT);
  });
  test('Store Command not meet correct type', () => {
    basicStructure('set foo 3 3 -3', BAD_COMMAND_LINE_FORMAT);
  });
});