const { getCurrentUser } = require('../socket');

module.exports = class LogUser {
  constructor() {
    this.user = getCurrentUser();
    this.time = Date.now();
  }
};
