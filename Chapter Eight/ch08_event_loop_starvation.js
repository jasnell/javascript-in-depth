// Listing 1.X - Event Loop Starvation
// This example demonstrates how microtasks can starve the event loop

let macrotaskRan = false;

// Schedule a macrotask
setTimeout(() => {
  macrotaskRan = true;
  console.log('Macrotask finally ran!');
}, 0);

// This function recursively queues microtasks
function recursiveMicrotask(count) {
  if (count <= 0) {
    console.log('Microtasks done. Macrotask ran?', macrotaskRan);
    return;
  }

  if (count % 10000 === 0) {
    console.log(`Microtask ${count}...`);
  }

  queueMicrotask(() => recursiveMicrotask(count - 1));
}

console.log('Starting 50,000 recursive microtasks...');
console.log('The setTimeout is scheduled but cannot run until ALL microtasks complete.\n');

recursiveMicrotask(50000);

// Expected output (abbreviated):
// Starting 50,000 recursive microtasks...
// The setTimeout is scheduled but cannot run until ALL microtasks complete.
//
// Microtask 50000...
// Microtask 40000...
// Microtask 30000...
// Microtask 20000...
// Microtask 10000...
// Microtasks done. Macrotask ran? false
// Macrotask finally ran!

// KEY INSIGHT: Even though setTimeout was scheduled first with 0ms delay,
// it cannot run until the microtask queue is empty. If microtasks keep
// adding more microtasks indefinitely, the event loop is "starved" and
// timers, I/O callbacks, and other macrotasks will never execute.
//
// This is why it's dangerous to use recursive microtasks for long-running
// work. Use setImmediate (Node.js) or setTimeout to yield to the event loop.

// SAFE ALTERNATIVE - yielding to the event loop:
function safeRecursive(count, callback) {
  if (count <= 0) {
    callback();
    return;
  }

  // Using setTimeout(fn, 0) allows other tasks to run between iterations
  setTimeout(() => safeRecursive(count - 1, callback), 0);
}
