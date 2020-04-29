module.exports = function handleConnection(conn) {
  conn.setEncoding('utf-8');

  conn.on('data', (data) => {
    console.log(`Received data: ${data}`);
  });

  conn.on('error', (err) => {
    console.log('Connection error!');
    console.error(err);
  });

  conn.on('close', () => {
    console.log(`Connection from ${conn.remoteAddress} closed.`);
  });
}
