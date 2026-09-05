// run: node --trace-gc trace-gc-allocator.mjs
// A tiny allocator that drives Scavenge and Mark-Compact events so --trace-gc prints a live collection log to stderr.

// Short-lived allocations feed the young generation (Scavenges); the
// survivors array promotes some objects to old space (Mark-Compact).
const survivors = [];

let round = 0;
const timer = setInterval(() => {
  // Churn: mostly garbage that dies before the next tick.
  for (let i = 0; i < 50_000; i++) {
    const tmp = { i, s: 'x'.repeat(32) };
    if (i % 500 === 0) survivors.push(tmp);
  }
  if (++round >= 20) clearInterval(timer);
}, 50);
