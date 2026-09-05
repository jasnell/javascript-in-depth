// Shows microtask starvation and its fix: a tight await loop starves timers/I/O, so periodically yield to a macrotask (setTimeout) to let the event loop turn.
async function processItem(item) {
  return item * 2; // resolves synchronously; each await only yields to the microtask queue
}

async function wait() {
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(resolve, 0); // a macrotask: forces the microtask queue to empty first
  await promise;
}

let timerFired = 0;
const ticker = setInterval(() => { timerFired++; }, 0);

async function processQueue(items) {
  for (let i = 0; i < items.length; i++) {
    await processItem(items[i]);
    if (i % 100 === 0) {
      await wait(); // yield to the timer/macrotask queue so it is not starved
    }
  }
}

await processQueue(Array.from({ length: 500 }, (_, i) => i));
clearInterval(ticker);

console.log('processed 500 items');
console.log('interval fired', timerFired, 'times (> 0 because we yielded)');

// Without the periodic `await wait()`, every await only re-enters the microtask
// queue, which drains to completion before any timer runs: the interval would
// fire ~0 times and, in a real server, I/O and incoming requests would stall.
