const Memcached = require('../models/Memcached');
const memcached = new Memcached().getInstance();

const mockData1 = {
  key: 'foo',
  value: 'say',
  exptime: 300,
  flags: 0
};

const mockData2 = {
  key: 'foo',
  value: 'kevin',
  exptime: 300,
  flags: 0
};

describe('Memcached logic', () => {
  test('Create key', () => {
    memcached.createKey(mockData1);
    expect(JSON.stringify(memcached.getInstance())).toMatchSnapshot();
    delete memcached.getInstance()[mockData1.key];
  });
  test('Read empty key', () => {
    const result = memcached.readKey(mockData1.key);
    expect(result).toBeUndefined();
  });
  test('Read key', () => {
    memcached.createKey(mockData1);
    const result = memcached.readKey(mockData1.key);
    expect(JSON.stringify(result)).toMatchSnapshot();
    delete memcached.getInstance()[mockData1.key];
  });
  test('UpdateKey key', () => {
    memcached.createKey(mockData1);
    memcached.updateKey(mockData2);
    expect(JSON.stringify(memcached.getInstance())).toMatchSnapshot();
    delete memcached.getInstance()[mockData1.key];
  });
  test('Delete key', () => {
    memcached.createKey(mockData1);
    memcached.deleteKeyCache(mockData1.key);
    expect(JSON.stringify(memcached.getInstance())).toMatchSnapshot();
  });
  test('Is Key Stored Key', () => {
    memcached.createKey(mockData1);
    const result = memcached.isKeyStored(mockData1.key);
    expect(result).toBe(true);
    delete memcached.getInstance()[mockData1.key];
  });
});
