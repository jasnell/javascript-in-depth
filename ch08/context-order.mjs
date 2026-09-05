// Same code as context-order.cjs, but run as an ECMAScript module it prints A B B A. Context flips the order.
queueMicrotask(() => {
  queueMicrotask(() => console.log('A'));
  process.nextTick(() => console.log('B'));
});

process.nextTick(() => {
  queueMicrotask(() => console.log('A'));
  process.nextTick(() => console.log('B'));
});

// An ESM top-level body runs as a microtask, not a macrotask. Because the
// microtask queue is drained to completion, the microtasks scheduled here run
// ahead of the nextTicks, inverting the CommonJS result to A B B A.
