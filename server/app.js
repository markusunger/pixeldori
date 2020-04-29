const net = require('net');
require('dotenv').config();

const handleConnection = require('./tcp/handleConnection');

// start up TCP server
const tcpServer = net.createServer(handleConnection);

tcpServer.listen(process.env.PORT, () => {
  console.log(`Pixeldori server started and listening on port ${process.env.PORT}.`);
});

tcpServer.on('error', (e) => {
  console.error(e);
  throw(e);
});
