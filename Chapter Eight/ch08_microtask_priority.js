// Listing 1.X - Microtask Priority Demonstration
// This example shows that ALL microtasks drain before the next macrotask runs

console.log('1. Script start');

// Schedule a macrotask (timer)
setTimeout(() => {
  console.log('5. setTimeout callback (macrotask)');

  // Schedule a microtask from inside a macrotask
  queueMicrotask(() => {
    console.log('6. Microtask queued from setTimeout');
  });
}, 0);

// Schedule microtasks
queueMicrotask(() => {
  console.log('3. First microtask');

  // Microtasks can queue more microtasks - they ALL run before any macrotask
  queueMicrotask(() => {
    console.log('4. Nested microtask (still runs before setTimeout!)');
  });
});

Promise.resolve().then(() => {
  console.log('3.5. Promise microtask');
});

console.log('2. Script end');

// Expected output:
// 1. Script start
// 2. Script end
// 3. First microtask
// 3.5. Promise microtask
// 4. Nested microtask (still runs before setTimeout!)
// 5. setTimeout callback (macrotask)
// 6. Microtask queued from setTimeout

// KEY INSIGHT: The microtask queue completely drains (including newly
// added microtasks) before the event loop moves to the next macrotask.
// This is why nested microtasks run before setTimeout, even though
// setTimeout was scheduled first.
