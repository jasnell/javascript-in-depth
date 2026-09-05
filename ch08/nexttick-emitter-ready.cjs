// Shows the canonical, correct use of process.nextTick: defer an event until after the constructor returns so a handler can attach in time. Output: ready!
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {
  constructor() {
    super();
    // this.emit('ready');                  // WRONG: fires before any handler is attached, so it is missed
    process.nextTick(() => this.emit('ready')); // RIGHT: fires after the constructor returns
  }
}

const emitter = new MyEmitter();
emitter.on('ready', () => console.log('ready!')); // attached synchronously, before nextTick drains

// nextTick guarantees the emit happens after this synchronous code finishes but
// before any I/O, so the listener is registered in time. This is the one job
// nextTick was designed for; for "run soon" use queueMicrotask instead.
