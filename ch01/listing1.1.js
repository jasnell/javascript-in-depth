// Demonstrates Node.js task scheduling order across nextTick, microtask, timer, and immediate queues (CommonJS).
// run: node listing1.1.js
// Prints: Hello

function print(a) {
  process.stdout.write(a);
}

queueMicrotask(() => print('e'));
process.nextTick(() => print('H'));
setTimeout(() => print('l'), 0);
Promise.resolve().then(() => print('l'));
setImmediate(() => print('o\n'));
