module.exports = class LogUser {
  constructor(user) {
    this.user = user;
    this.time = Date.now()
  }
}