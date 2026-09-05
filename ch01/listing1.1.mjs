// Demonstrates that identical code run as an ES module reorders the same queues (Node.js ESM).
// run: node listing1.1.mjs
// Prints: elHo then l on the next line (different from the CommonJS run)

function print(a) {
  process.stdout.write(a);
}

queueMicrotask(() => print('e'));
process.nextTick(() => print('H'));
setTimeout(() => print('l'), 0);
Promise.resolve().then(() => print('l'));
setImmediate(() => print('o\n'));
