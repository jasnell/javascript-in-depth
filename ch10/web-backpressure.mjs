// Web Streams backpressure: writer.ready gates writes and desiredSize reports remaining room in the queue.
const slow = new WritableStream(
  {
    async write(chunk) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // slow destination
      console.log('wrote', chunk);
    },
  },
  new CountQueuingStrategy({ highWaterMark: 2 })
);

const writer = slow.getWriter();
for (const chunk of ['a', 'b', 'c', 'd', 'e']) {
  await writer.ready; // resolves only when the queue has room again
  console.log('desiredSize before write', writer.desiredSize);
  writer.write(chunk); // not awaited; writer.ready is what paces the loop
}
await writer.close();
