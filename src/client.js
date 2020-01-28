var net = require('net');
var client = net.connect({ port: 4444 }, function() {
  console.log('connected to server!');
	client.write('set foo 3 3 3\r\n');
	client.write('hola\r\n');
});

client.on('data', function(data) {
	const reponse = data.toString('utf8');
	if(reponse !== '\r\n') {
		console.log(reponse);
		client.end();
	}
});

client.on('end', function() {
  console.log('disconnected from server');
});
