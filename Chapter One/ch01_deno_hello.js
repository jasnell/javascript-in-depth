// Chapter 1: How JavaScript Runs - The "Hello" Puzzle (Deno version)
// See: "Runtime differences" and "Deno's approach"
//
// Run with: deno run ch01_deno_hello.js

import { setImmediate } from 'node:timers';

function print(a) {
  process.stdout.write(a);
}

queueMicrotask(() => print('e'));
process.nextTick(() => print('H'));
setTimeout(() => print('l'), 0);
Promise.resolve().then(() => print('l'));
setImmediate(() => print('o\n'));
