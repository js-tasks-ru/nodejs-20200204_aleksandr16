const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.transferedBytes = 0;
  }

  _transform(chunk, encoding, callback) {
    this.transferedBytes += chunk.length;
    if (this.transferedBytes > this.limit) {
      callback(new LimitExceededError());
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
