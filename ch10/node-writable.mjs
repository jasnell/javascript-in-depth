// Node.js Writable: a consumer whose write() receives each chunk and calls back when ready for the next.
import { Writable } from 'node:stream';

const w = new Writable({
  write(chunk, encoding, callback) {
    console.log('received', chunk.toString());
    callback(); // signal that this chunk is handled and the next may arrive
  },
});

w.write('one');
w.write('two');
w.end('three', () => console.log('finished'));
