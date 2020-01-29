const cache = {};

const getMemcachedInstance = () => cache;

const createKey = data => cache[data.key] = data;

const readKey = () => {};

const updateKey = () => {};

const deleteKeyCache = key => delete cache[key];

module.exports = {
  getMemcachedInstance,
  createKey,
  readKey,
  updateKey,
  deleteKeyCache
}

