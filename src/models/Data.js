const SECOND = 1000;

class Data {
  constructor({ key, flags, exptime, value, cas }) {
    const Command = require('./Commands');
    const command = new Command();
    this.key = key;
    this.value = value;
    this.flags = flags;
    this.cas = cas;
    //if exptime = 0 the key never expire
    if (exptime > 0) {
      setTimeout(() => {
        command.deleteKey(key);
      }, exptime * SECOND);
    }
  }
}

module.exports = Data;
