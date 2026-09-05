// Web Streams WritableStream: a destination whose write() receives each chunk through the promise machinery.
const sink = new WritableStream({
  write(chunk) {
    console.log('received', chunk);
  },
  close() {
    console.log('closed');
  },
});

const writer = sink.getWriter();
await writer.write('one');
await writer.write('two');
await writer.close();
