const Data = require('./Data');
const Cas = require('./Cas');
const cas = new Cas();

class Memcached {
  constructor() {
    this.cache = {};
  }

  getInstance() {
    return this.cache;
  }

  createKey(values) {
    const data = new Data({ ...values, cas: cas.getIncrementCas() });
    this.cache[data.key] = data;
  }

  readKey(key) {
    return this.cache[key];
  }

  updateKey(data) {
    data.cas = cas.getIncrementCas();
    this.cache[data.key] = data;
  }

  deleteKeyCache(key) {
    delete this.cache[key];
  }

  isKeyStored(key) {
    return Boolean(this.cache[key]);
  }
}

class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new Memcached();
    }
  }

  getInstance() {
    return Singleton.instance;
  }
}

module.exports = Singleton;
