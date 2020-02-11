const net = require('net');
const Socket = require('./src/models/Socket');
const Parser = require('./src/parser');
const parser = new Parser();
const PORT = process.env.PORT || 11211;

const handleSocket = skt => {
  const socket = new Socket(skt);
  socket.getInstance().setEncoding('utf8');
  socket.getInstance().on('data', data => {
    const response = parser.read(data);
    if(response) socket.writeMessage(response);
  });
  console.log('==========================================');
  console.log(`|| Welcome ${socket.getCurrentUser()} to memcached ||`);
  console.log('==========================================')
};

const server = net.createServer(handleSocket);
server.listen(PORT, '0.0.0.0');
server.on('listening', () => console.log(`Memcached listening on ${PORT}`));
