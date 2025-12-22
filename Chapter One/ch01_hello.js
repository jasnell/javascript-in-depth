// Chapter 1: How JavaScript Runs - The "Hello" Puzzle
// See: "Event loop, microtasks, and task scheduling"
//
// This example prints "Hello" by scheduling each character through a different
// queue mechanism. The output order reveals how Node.js prioritizes different
// types of scheduled work:
//
//   1. process.nextTick() - runs before any other queued work
//   2. Promise microtasks and queueMicrotask() - run after nextTick
//   3. setTimeout() - macrotask, runs in the timers phase
//   4. setImmediate() - runs in the check phase, after I/O
//
// Run with: node ch01_hello.js

function print(a) {
  process.stdout.write(a);
}

queueMicrotask(() => print('e'));
process.nextTick(() => print('H'));
setTimeout(() => print('l'), 0);
Promise.resolve().then(() => print('l'));
setImmediate(() => print('o\n'));
