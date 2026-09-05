// Demonstrates making the puzzle run under Deno by importing setImmediate from node:timers (syntax corrected).
// run: deno run listing1.2.js
// Prints under Deno: elHlo

import { setImmediate } from 'node:timers';

function print(a) {
  process.stdout.write(a);
}

queueMicrotask(() => print('e'));
process.nextTick(() => print('H'));
setTimeout(() => print('l'), 0);
Promise.resolve().then(() => print('l'));
setImmediate(() => print('o\n'));
