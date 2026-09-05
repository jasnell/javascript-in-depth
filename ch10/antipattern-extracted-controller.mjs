// Anti-pattern: capturing the controller to push independently of pull() breaks backpressure; produce inside pull() instead.
import { EventEmitter } from 'node:events';

// A push source that emits on its own schedule and can be paced with pause()/resume().
class Feed extends EventEmitter {
  constructor(limit = 5) { super(); this.paused = false; this.i = 0; this.limit = limit; }
  pause() { this.paused = true; }
  resume() { this.paused = false; this.tick(); }
  start() { this.tick(); }
  tick() {
    if (this.paused) return;
    if (this.i >= this.limit) { this.emit('close'); return; }
    this.emit('message', this.i++);
    queueMicrotask(() => this.tick());
  }
}

// Anti-pattern: extract the controller and enqueue every message regardless of desiredSize.
function brokenStreamFromFeed(feed) {
  let controller;
  const stream = new ReadableStream({ start(c) { controller = c; } });
  feed.on('message', (msg) => controller.enqueue(msg)); // pushes regardless of room; the queue can grow without bound
  feed.on('close', () => controller.close());
  return stream;
}

// Fix: still bridge the events, but let desiredSize pace the source and resume it from pull().
function pacedStreamFromFeed(feed) {
  return new ReadableStream({
    start(controller) {
      feed.on('message', (msg) => {
        controller.enqueue(msg);
        if (controller.desiredSize <= 0) feed.pause(); // queue is full, stop the source
      });
      feed.on('close', () => controller.close());
      feed.start();
    },
    pull() { feed.resume(); }, // the consumer asked for more, let the source flow again
    cancel() { feed.removeAllListeners(); }, // the consumer went away, release the source
  });
}

// Cleanest fix when the source can be read on demand: produce entirely inside pull().
function pullStreamFromSource(limit = 5) {
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i >= limit) controller.close(); // ask for the next value only when the consumer wants it
      else controller.enqueue(i++);
    },
  });
}

async function drain(stream, label) {
  const reader = stream.getReader();
  const out = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    out.push(value);
  }
  console.log(label, out);
}

await drain(pacedStreamFromFeed(new Feed()), 'paced');
await drain(pullStreamFromSource(), 'pull');
void brokenStreamFromFeed; // shown for contrast only
