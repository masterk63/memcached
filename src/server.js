const net = require('net');
const create = port =>
  new Promise(resolve =>
    net
      .createServer(socket => resolve(socket))
      .listen(port, '0.0.0.0')
      .on('listening', () => console.log(`Memcached listening on ${port}`))
  );

module.exports = { create };
