// Node.js Transform: both Writable and Readable; each written chunk passes through transform() and is pushed onward.
import { Transform } from 'node:stream';

const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase()); // the second callback arg is pushed to the readable side
  },
});

upper.on('data', (chunk) => console.log(chunk.toString()));
upper.write('hello');
upper.write('world');
upper.end();
