// Shows the fundamental rule: run the macrotask, drain microtasks, then timers. Output order: sync, promise, timeout.
setTimeout(() => console.log('timeout'), 0); // macrotask (timer)
Promise.resolve().then(() => console.log('promise')); // microtask
console.log('sync'); // runs now, inside the current macrotask

// This ordering (sync, promise, timeout) is consistent across every runtime,
// because it only relies on the language-defined microtask queue vs a timer.
