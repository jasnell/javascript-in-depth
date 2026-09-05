// Shows the two Node scheduling extremes: nextTick runs before I/O and before microtasks; setImmediate runs after them (check phase). Output: sync, nextTick, promise, setImmediate.
setImmediate(() => console.log('setImmediate')); // macrotask, check phase (after this loop turn)
process.nextTick(() => console.log('nextTick')); // pre-microtask, before the event loop continues
Promise.resolve().then(() => console.log('promise')); // microtask
console.log('sync');

// Ordering: current stack (sync) -> nextTick queue -> promise microtasks ->
// event loop advances -> setImmediate. nextTick means "before the loop turns
// again"; setImmediate means "on the next turn, after I/O". Both are Node
// inventions with no language standard: in browsers neither exists, and Deno/Bun
// provide them through a Node compat layer that may not match this order.
