const net = require('net');
const { initSocket } = require('./src/socket');
const parser = require('./src/parser');
const PORT = process.env.PORT || 11211;

const handleSocket = socket => {
  initSocket(socket);
  console.log('====================================');
  console.log(`|| Welcome ${socket.remoteAddress} to memcached ||`);
  console.log('====================================');
  socket.on('data', parser.read);
}

const server = net.createServer(handleSocket);
server.listen(PORT, '0.0.0.0')
server.on('listening', () => console.log(`Memcached listening on ${PORT}`));
