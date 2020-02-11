const { SECOND } = require('../constants/app');

class Data {
  constructor({ key, flags, exptime, value, cas }) {
    const Command = require('../Command');
    this.key = key;
    this.value = value;
    this.flags = flags;
    this.cas = cas;
    //if exptime = 0 the key never expire
    if (exptime > 0) {
      setTimeout(() => {
        Command.deleteKey(key);
      }, exptime * SECOND);
    }
  }
}

module.exports = Data;
