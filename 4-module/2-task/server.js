const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

function collectRequestData(request, callback) {
  let body = [];
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  request.on('end', () => {
    body = Buffer.concat(body);
    callback(body);
  });
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }
  switch (req.method) {
    case 'POST':
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end();
        return;
      }
      collectRequestData(req, (data) => {
        const limitSizeStream = new LimitSizeStream({limit: 1024*1024});
        const writeStream = fs.createWriteStream(filepath);

        limitSizeStream.on('error', (e) => {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
          res.statusCode = 413;
          res.end();
        });

        limitSizeStream.on('finish', () => {
          console.log('enddd')
          res.statusCode = 201;
          res.end();
        });

        limitSizeStream.pipe(writeStream);
        if (data.length) {
          limitSizeStream.write(data);
          limitSizeStream.end();
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
