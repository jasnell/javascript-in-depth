// Anti-pattern: a stream for a tiny in-memory payload pays for buffers and scheduling a plain function would not.
const small = JSON.stringify({ user: 'ada', role: 'admin' }); // a few bytes; fits comfortably in memory

// Anti-pattern: wrap a tiny, bounded payload in a full stream pipeline.
async function viaStream(text) {
  const source = new ReadableStream({
    start(controller) { controller.enqueue(text); controller.close(); },
  });
  const validate = new TransformStream({
    transform(chunk, controller) { controller.enqueue(JSON.parse(chunk)); },
  });
  let result;
  await source.pipeThrough(validate).pipeTo(new WritableStream({
    write(obj) { result = obj; },
  }));
  return result;
}

// Fix: read it once and process synchronously. No buffers, no backpressure, no per-chunk promises.
function viaFunction(text) {
  return JSON.parse(text);
}

console.log('viaStream', await viaStream(small));
console.log('viaFunction', viaFunction(small));
