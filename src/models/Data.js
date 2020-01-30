const SECOND = 1000;
let casUnique = 0;

class Data {
  constructor(key, flags, exptime, value) {
    const { deleteKey } = require('../commands');
    casUnique++;
    this.key = key;
    this.value = value;
    this.flags = flags;
    this.cas = casUnique;
    //if exptime = 0 the key never expire
    if (exptime > 0) {
      setTimeout(() => {
        deleteKey(key);
      }, exptime * SECOND);
    }
  }
}

module.exports = Data;
