const net = require('net');
const Socket = require('./src/models/Socket');
const parser = require('./src/parser');
const PORT = process.env.PORT || 11211;

const handleSocket = skt => {
  const socket = new Socket(skt);
  socket.getInstance().on('data', data => parser.read(data, socket));
  socket.writeMessage('==========================================');
  socket.writeMessage(`|| Welcome ${socket.getCurrentUser()} to memcached ||`);
  socket.writeMessage('==========================================');
}

const server = net.createServer(handleSocket);
server.listen(PORT, '0.0.0.0')
server.on('listening', () => console.log(`Memcached listening on ${PORT}`));
