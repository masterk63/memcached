module.exports = class LogUser {
  constructor(socket) {
    this.user = socket.getCurrentUser();
    this.time = Date.now();
  }
};
