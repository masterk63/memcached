const Data = require('./models/Data');
const { getIncrementCas } = require('./cas');

const cache = {};

const getMemcachedInstance = () => cache;

const createKey = values => {
  const data = new Data(values);
  cache[data.key] = data;
};

const readKey = key => cache[key];

const updateKey = data => {
  data.cas = getIncrementCas();
  cache[data.key] = data;
};

const deleteKeyCache = key => delete cache[key];

const isKeyStored = key => Boolean(cache[key]);

module.exports = {
  getMemcachedInstance,
  createKey,
  readKey,
  updateKey,
  isKeyStored,
  deleteKeyCache
};
