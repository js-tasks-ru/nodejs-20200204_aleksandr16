const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.lastLine = null;
  }

  _transform(chunk, encoding, callback) {
    let data = chunk.toString();
    if (this.lastLine) {
      data = this.lastLine + data;
    }

    const lines = data.split(os.EOL);
    this.lastLine = lines.splice(lines.length - 1, 1)[0];
    lines.forEach((line) => this.push(line));
    callback(null);
  }

  _flush(callback) {
    if (this.lastLine) {
      this.push(this.lastLine);
    }

    this.lastLine = null;
    callback(null);
  }
}

module.exports = LineSplitStream;
