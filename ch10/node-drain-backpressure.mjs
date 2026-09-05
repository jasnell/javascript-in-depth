// Node.js backpressure: write() returns false when the buffer is full; wait for 'drain' before writing more.
import { Writable } from 'node:stream';
import { once } from 'node:events';

// A slow sink with a small highWaterMark so its buffer fills after only a few writes.
const slow = new Writable({
  highWaterMark: 4,
  write(chunk, encoding, callback) {
    setTimeout(callback, 10); // simulate a slow destination
  },
});

async function writeAll(items) {
  for (const item of items) {
    if (!slow.write(item)) {
      await once(slow, 'drain'); // buffer is full; resume only once it drains below the mark
    }
  }
  slow.end();
}

await writeAll(['a', 'b', 'c', 'd', 'e', 'f']);
console.log('all written with backpressure honored');
