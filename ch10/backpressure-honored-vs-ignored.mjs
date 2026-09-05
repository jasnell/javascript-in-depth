// Backpressure honored vs ignored: a fast producer into a slow Node.js Writable, paced correctly then pushed regardless.
import { Writable } from 'node:stream';
import { once } from 'node:events';

function slowSink() {
  return new Writable({
    highWaterMark: 2,
    write(chunk, encoding, callback) { setTimeout(callback, 10); },
  });
}

// Honored: stop when write() returns false, resume on 'drain'. At most one buffer of chunks is ever in flight.
async function honored(items) {
  const sink = slowSink();
  for (const item of items) {
    if (!sink.write(item)) await once(sink, 'drain');
  }
  sink.end();
  console.log('honored: producer paced to the sink, memory stays bounded');
}

// Ignored: push regardless of the return value. Chunks pile into the buffer with nothing to pace the producer.
function ignored(items) {
  const sink = slowSink();
  for (const item of items) {
    sink.write(item); // return value discarded; the internal buffer grows unbounded
  }
  sink.end();
  console.log('ignored: every chunk queued at once, buffer grows without limit');
}

const data = Array.from({ length: 20 }, (_, i) => `chunk-${i}`);
await honored(data);
ignored(data);
