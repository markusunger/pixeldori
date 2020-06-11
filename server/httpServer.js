const http = require('http');
const url = require('url');

module.exports = (cfg) => {
  const server = http.createServer((req, res) => {
    // extract actual command from url query string
    const command = url.parse(req.url).query.split('=')[1];

    console.log(`Incoming request with command ${command}`);
    res.end();
  });
  
  server.listen(cfg.port, () => console.log(`Pixeldori server started on port ${cfg.port}...`));

  return server;
};
