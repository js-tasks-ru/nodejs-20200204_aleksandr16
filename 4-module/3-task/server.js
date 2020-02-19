const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }
  switch (req.method) {
    case 'DELETE':
      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end();
        return;
      }

      fs.unlink(filepath, (err) => {
        res.statusCode = err ? 500 : 200
        res.end();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
