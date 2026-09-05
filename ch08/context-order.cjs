// Context determines order: identical code, run as CommonJS (.cjs/.js), prints B A A B. Compare with context-order.mjs.
queueMicrotask(() => {
  queueMicrotask(() => console.log('A'));
  process.nextTick(() => console.log('B'));
});

process.nextTick(() => {
  queueMicrotask(() => console.log('A'));
  process.nextTick(() => console.log('B'));
});

// As CommonJS the top-level script is a macrotask. Node drains the nextTick
// queue fully, then the microtask queue, at each checkpoint. Result: B A A B.
