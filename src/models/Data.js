const { deleteKey } = require('../commands');
const SECOND = 1000;

module.exports = class Data {
  constructor(key, flags, exptime, value) {
    this.value = value;
    this.flags = flags;
    this.fetchLog = [];
    this.updateLog = [];
    setTimeout(() => {
      deleteKey(key);
    }, exptime * SECOND);
  }
};
