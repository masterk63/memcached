const server = require("./src/server");
const parser = require("./src/parser");
const PORT = process.env.PORT || 11211;

(async () => {
	const socket = await server.create(PORT);
  socket.write(`====================================\r\n`);
  socket.write(`|| Welcome ${socket.remoteAddress} to memcached ||\r\n`);
  socket.write(`====================================\r\n`);
  socket.on("data", data => parser.read(data, socket));
})();
