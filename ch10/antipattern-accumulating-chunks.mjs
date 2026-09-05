// Anti-pattern: retaining every chunk defeats streaming's bounded memory; accumulate a summary instead of the data.
import { createHash } from 'node:crypto';

// Anti-pattern: each chunk is kept alive for the whole lifetime of the pipeline.
const allChunks = [];
const retaining = new TransformStream({
  transform(chunk, controller) {
    allChunks.push(chunk); // the entire dataset ends up resident in memory, one chunk at a time
    controller.enqueue(chunk);
  },
});

// Fix: fold each chunk into a running summary so the raw data becomes unreachable after it passes through.
function summarizing() {
  const hash = createHash('sha256');
  let bytes = 0;
  return new TransformStream({
    transform(chunk, controller) {
      const buf = Buffer.from(chunk);
      hash.update(buf);
      bytes += buf.length;
      controller.enqueue(chunk); // forward it, then let the chunk die
    },
    flush() {
      console.log('bytes', bytes, 'digest', hash.digest('hex'));
    },
  });
}

const ts = summarizing();
const writer = ts.writable.getWriter();
const reader = ts.readable.getReader();
for (const word of ['alpha', 'beta', 'gamma']) await writer.write(word);
await writer.close();
while (true) {
  const { done } = await reader.read();
  if (done) break;
}
void retaining; // shown for contrast only
