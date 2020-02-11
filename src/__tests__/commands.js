const Command = require('../Command');
const Memcached = require('../models/Memcached');
const memcached = new Memcached().getInstance();
const { STORED, BAD_DATA_CHUNK, COMMAND_NOT_FOUND, NOT_STORED, NOT_FOUND, EXISTS, END } = require('../constants/messages');

const parseCommand = command => command.split(' ');

const mockData1 = {
  key: 'foo',
  value: 'say',
  exptime: 300,
  flags: 0
};

const mockData2 = {
  key: 'name',
  value: 'kevin',
  exptime: 300,
  flags: 0
};

const appendLogic = command => {
  const value = 'bye';
  memcached.createKey(mockData1);
  const result = Command.run(parseCommand(command), value);
  expect(result).toBe(STORED);
  expect(JSON.stringify(memcached.getInstance())).toMatchSnapshot();
  memcached.deleteKeyCache('foo');
};

const getLogicMulti = command => {
  memcached.createKey(mockData1);
  memcached.createKey(mockData2);
  const result = Command.run(parseCommand(command));
  expect(result).toEqual(['VALUE foo 0 3', 'say', 'VALUE name 0 5', 'kevin', END]);
  memcached.deleteKeyCache('foo');
  memcached.deleteKeyCache('name');
};

describe('Running Commands', () => {
  test('Set command bad chunk', () => {
    const command = 'set foo 3 3 3';
    const value = 'done';
    const result = Command.run(parseCommand(command), value);
    expect(result).toEqual([BAD_DATA_CHUNK, COMMAND_NOT_FOUND]);
    expect(memcached.isKeyStored('foo')).toBe(false);
  });
  test('Set command ran successfully', () => {
    const command = 'set foo 3 3 3';
    const value = 'say';
    const result = Command.run(parseCommand(command), value);
    expect(result).toBe(STORED);
    expect(JSON.stringify(memcached.getInstance())).toMatchSnapshot();
    memcached.deleteKeyCache('foo');
  });
  test('Set command with exptime -1 (auto delete)', () => {
    const command = 'set foo 3 -1 3';
    const value = 'say';
    const result = Command.run(parseCommand(command), value);
    expect(result).toBe(STORED);
    expect(memcached.isKeyStored('foo')).toBe(false);
  });
  test('Add command ran successfully', () => {
    const command = 'add foo 3 3 3';
    const value = 'say';
    const result = Command.run(parseCommand(command), value);
    expect(result).toBe(STORED);
    expect(JSON.stringify(memcached.getInstance())).toMatchSnapshot();
    memcached.deleteKeyCache('foo');
  });
  test('Add command not stored', () => {
    const command = 'add foo 3 3 3';
    const value = 'say';
    memcached.createKey(mockData1);
    const result = Command.run(parseCommand(command), value);
    expect(result).toBe(NOT_STORED);
    memcached.deleteKeyCache('foo');
  });
  test('Replace command ran successfully', () => {
    const command = 'replace foo 3 3 3';
    const value = 'bye';
    memcached.createKey(mockData1);
    const result = Command.run(parseCommand(command), value);
    expect(result).toBe(STORED);
    expect(JSON.stringify(memcached.getInstance())).toMatchSnapshot();
    memcached.deleteKeyCache('foo');
  });
  test('Replace command not stored', () => {
    const command = 'replace foo 3 3 3';
    const value = 'bye';
    const result = Command.run(parseCommand(command), value);
    expect(result).toBe(NOT_STORED);
    expect(memcached.isKeyStored('foo')).toBe(false);
  });
  test('Append command not stored', () => {
    const command = 'append foo 3 3 3';
    const value = 'bye';
    const result = Command.run(parseCommand(command), value);
    expect(result).toBe(NOT_STORED);
    expect(memcached.isKeyStored('foo')).toBe(false);
  });
  test('Append command bad data chunk', () => {
    const command = 'append foo 3 3 3';
    const value = 'byee';
    const result = Command.run(parseCommand(command), value);
    expect(result).toEqual([BAD_DATA_CHUNK, COMMAND_NOT_FOUND]);
    expect(memcached.isKeyStored('foo')).toBe(false);
  });
  test('Append command ran successfully', () => {
    const command = 'append foo 3 3 3';
    appendLogic(command);
  });
  test('Prepend command ran successfully', () => {
    const command = 'prepend foo 3 3 3';
    appendLogic(command);
  });
  test('Cas command not found', () => {
    const command = 'cas foo 3 3 3 3';
    const value = 'bye';
    const result = Command.run(parseCommand(command), value);
    expect(result).toBe(NOT_FOUND);
    expect(memcached.isKeyStored('foo')).toBe(false);
  });
  test('Cas command EXISTS', () => {
    const command = 'cas foo 3 3 3 3';
    const value = 'bye';
    memcached.createKey(mockData1);
    const result = Command.run(parseCommand(command), value);
    expect(result).toBe(EXISTS);
    expect(memcached.isKeyStored('foo')).toBe(true);
    memcached.deleteKeyCache('foo');
  });
  test('Cas command ran successfully', () => {
    const command = 'cas foo 3 3 3 11';
    const value = 'cas';
    memcached.createKey(mockData1);
    const result = Command.run(parseCommand(command), value);
    expect(result).toBe(STORED);
    expect(JSON.stringify(memcached.getInstance())).toMatchSnapshot();
    memcached.deleteKeyCache('foo');
  });
  test('Get command key not found', () => {
    const command = 'get hola';
    const result = Command.run(parseCommand(command));
    expect(result).toEqual([END]);
  });
  test('Get command ran successfully with 1 param', () => {
    const command = 'get foo';
    memcached.createKey(mockData1);
    const result = Command.run(parseCommand(command));
    expect(result).toEqual(['VALUE foo 0 3', 'say', END]);
    memcached.deleteKeyCache('foo');
  });
  test('Get command ran successfully with 2 param', () => {
    const command = 'get foo name';
    getLogicMulti(command);
  });
  test('Get command ran with 3 param and 1 miss', () => {
    const command = 'get foo name notstored';
    getLogicMulti(command);
  });
  test('Gets command ran successfully with 1 param', () => {
    const command = 'gets foo';
    memcached.createKey(mockData1);
    const result = Command.run(parseCommand(command));
    expect(result).toEqual(['VALUE foo 0 3 18', 'say', END]);
    memcached.deleteKeyCache('foo');
  });
});
