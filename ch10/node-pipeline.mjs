// Node.js stream.pipeline: joins Readable -> Transform -> Writable, propagating errors and honoring backpressure.
import { pipeline } from 'node:stream/promises';
import { Readable, Transform, Writable } from 'node:stream';

const source = Readable.from(['alpha', 'beta', 'gamma']);

const shout = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase() + '\n');
  },
});

const sink = new Writable({
  write(chunk, encoding, callback) {
    process.stdout.write(chunk);
    callback();
  },
});

try {
  await pipeline(source, shout, sink); // resolves on success, rejects and destroys the streams on failure
  console.log('pipeline finished');
} catch (err) {
  console.error('pipeline failed', err);
}
