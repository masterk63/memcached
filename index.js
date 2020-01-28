const server = require("./src/server");
const { initSocket } = require("./src/socket");
const parser = require("./src/parser");
const PORT = process.env.PORT || 11211;

(async () => {
  const socket = await server.create(PORT);
  initSocket(socket);
  console.log('====================================');
  console.log(`|| Welcome ${socket.remoteAddress} to memcached ||`);
  console.log('====================================');
  socket.on("data", parser.read);
})();
