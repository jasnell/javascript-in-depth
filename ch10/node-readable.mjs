// Node.js Readable: the push model where read() calls push() and each push emits a 'data' event.
import { Readable } from 'node:stream';

let count = 0;
const r = new Readable({
  read() {
    this.push('hello');
    if (++count === 5) this.push(null); // pushing null signals end-of-stream
  },
});

r.on('data', (chunk) => console.log(chunk.toString()));
r.on('end', () => console.log('done'));
