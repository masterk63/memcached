const net = require('net');

const clientTest = fn => {
  const client = net.connect({ port: 4444 });
  client.on('data', function(data) {
    const reponse = data.toString('utf8');
    if (reponse !== '\r\n') {
			fn(reponse);
      client.end();
    }
	});
	return client;
};

const client = clientTest(data => {
	console.log('showing', data);
});
client.write('set foo 3 3 3\r\n');
client.write('hol\r\n');
