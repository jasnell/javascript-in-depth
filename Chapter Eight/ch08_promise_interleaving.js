// Listing 1.X - Promise Chain Interleaving
// This example reveals how multiple promise chains interleave execution

console.log('Start');

// Chain A
Promise.resolve()
  .then(() => console.log('A1'))
  .then(() => console.log('A2'))
  .then(() => console.log('A3'));

// Chain B
Promise.resolve()
  .then(() => console.log('B1'))
  .then(() => console.log('B2'))
  .then(() => console.log('B3'));

console.log('End');

// Expected output:
// Start
// End
// A1
// B1
// A2
// B2
// A3
// B3

// WHY THIS HAPPENS:
// Each .then() doesn't run immediately - it schedules a microtask.
// After the synchronous code finishes, the microtask queue contains:
//   [A1-callback, B1-callback]
//
// When A1 runs, it schedules A2. When B1 runs, it schedules B2.
// The queue becomes: [A2-callback, B2-callback]
//
// This pattern continues, creating an interleaved execution order.
// Understanding this is crucial for debugging async code that appears
// to run "out of order" when multiple promise chains are active.

// CONTRAST WITH AWAIT:
// Using await changes the mental model but not the underlying behavior
async function chainA() {
  await Promise.resolve();
  console.log('Async A1');
  await Promise.resolve();
  console.log('Async A2');
}

async function chainB() {
  await Promise.resolve();
  console.log('Async B1');
  await Promise.resolve();
  console.log('Async B2');
}

// These will also interleave: Async A1, Async B1, Async A2, Async B2
// chainA();
// chainB();
