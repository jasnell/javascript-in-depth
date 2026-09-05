// Web Streams TransformStream: transform() converts each chunk between a writable side and a readable side.
const upper = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const writer = upper.writable.getWriter();
const reader = upper.readable.getReader();

await writer.write('hello');
await writer.write('world');
await writer.close();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  console.log(value);
}
