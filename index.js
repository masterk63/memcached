const server = require("./src/server");
const { initSocket } = require("./src/socket");
const parser = require("./src/parser");
const PORT = process.env.PORT || 11211;

(async () => {
  const socket = await server.create(PORT);
  initSocket(socket);
  socket.write('====================================\r\n');
  socket.write(`|| Welcome ${socket.remoteAddress} to memcached ||\r\n`);
  socket.write('====================================\r\n');
  socket.on("data", parser.read);
})();
