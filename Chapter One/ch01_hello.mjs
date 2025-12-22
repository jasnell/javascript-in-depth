// Chapter 1: How JavaScript Runs - The "Hello" Puzzle (ESM version)
// See: "Event loop, microtasks, and task scheduling"
//
// Same puzzle as ch01_hello.js, but using ES module syntax. In ESM,
// The execution order of some queues may differ slightly due to module loading
// behavior.
//
// Run with: node ch01_hello.mjs

function print(a) {
  process.stdout.write(a);
}

queueMicrotask(() => print('e'));
process.nextTick(() => print('H'));
setTimeout(() => print('l'), 0);
Promise.resolve().then(() => print('l'));
setImmediate(() => print('o\n'));
