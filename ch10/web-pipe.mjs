// Web Streams pipeThrough/pipeTo: chain TransformStreams then end at a WritableStream; both manage backpressure and errors.
const source = new ReadableStream({
  start(controller) {
    for (const word of ['alpha', 'beta', 'gamma']) controller.enqueue(word);
    controller.close();
  },
});

const upper = new TransformStream({
  transform(chunk, controller) { controller.enqueue(chunk.toUpperCase()); },
});

const exclaim = new TransformStream({
  transform(chunk, controller) { controller.enqueue(chunk + '!'); },
});

const sink = new WritableStream({
  write(chunk) { console.log(chunk); },
});

await source.pipeThrough(upper).pipeThrough(exclaim).pipeTo(sink); // pipeTo resolves when the pipeline completes
console.log('pipeline finished');
