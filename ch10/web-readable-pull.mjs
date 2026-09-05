// Web Streams ReadableStream: pull() runs only when the queue has room, so the consumer sets the pace.
let n = 0;
const stream = new ReadableStream({
  pull(controller) {
    controller.enqueue(n);
    if (++n === 5) controller.close();
  },
});

const reader = stream.getReader();
while (true) {
  const { value, done } = await reader.read(); // each read() returns a promise for the next chunk
  if (done) break;
  console.log(value);
}
