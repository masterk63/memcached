const net = require('net');
const Socket = require('./src/socket');
const parser = require('./src/parser');
const PORT = process.env.PORT || 11211;

const handleSocket = skt => {
  const socket = new Socket(skt);
  console.log('==========================================');
  console.log(`|| Welcome ${socket.getCurrentUser()} to memcached ||`);
  console.log('==========================================');
  socket.getInstance().on('data', data => parser.read(data, socket));
}

const server = net.createServer(handleSocket);
server.listen(PORT, '0.0.0.0')
server.on('listening', () => console.log(`Memcached listening on ${PORT}`));
