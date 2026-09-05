// Anti-pattern: wrapping synchronous work in an async transform forces a needless promise per chunk; keep it synchronous.
import { Transform } from 'node:stream';

function processChunk(chunk) {
  return String(chunk).toUpperCase();
}

// Anti-pattern (Web Streams): async transform around purely synchronous work.
const wasteful = new TransformStream({
  async transform(chunk, controller) {
    const result = processChunk(chunk); // no I/O, yet every call is forced through the promise machinery
    controller.enqueue(result);
  },
});

// Fix (Web Streams): a synchronous transform allocates no extra promise on top of the stream's own.
const leanWeb = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(processChunk(chunk));
  },
});

// Fix (Node.js): the callback fires synchronously, so no promise and no microtask are created.
const leanNode = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, processChunk(chunk));
  },
});

async function pump(ts, chunk) {
  const writer = ts.writable.getWriter();
  const reader = ts.readable.getReader();
  await writer.write(chunk);
  await writer.close();
  const { value } = await reader.read();
  return value;
}

console.log('wasteful', await pump(wasteful, 'a'));
console.log('leanWeb', await pump(leanWeb, 'b'));
leanNode.on('data', (c) => console.log('leanNode', c.toString()));
leanNode.end('c');
