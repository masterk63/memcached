const cache = {};

const getMemcachedInstance = () => cache;

const createKey = data => cache[data.key] = data;

const readKey = key => cache[key];

const updateKey = data => cache[data.key] = data;

const deleteKeyCache = key => delete cache[key];

const isKeyStored = key => Boolean(cache[key]);

module.exports = {
  getMemcachedInstance,
  createKey,
  readKey,
  updateKey,
  isKeyStored,
  deleteKeyCache
}

