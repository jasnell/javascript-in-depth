// Measures event loop delay percentiles with monitorEventLoopDelay() from node:perf_hooks.

import { monitorEventLoopDelay } from 'node:perf_hooks';

// resolution: how often (ms) the histogram probes for delay.
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

// Periodically block the loop so p99 diverges from p50.
setInterval(() => {
  const until = Date.now() + 120;
  while (Date.now() < until) {} // synchronous stall
}, 500);

setInterval(() => {
  // percentile() returns nanoseconds; divide by 1e6 for milliseconds.
  console.log(
    `p50 ${(h.percentile(50) / 1e6).toFixed(1)} ms  ` +
    `p99 ${(h.percentile(99) / 1e6).toFixed(1)} ms  ` +
    `max ${(h.max / 1e6).toFixed(1)} ms`,
  );
  h.reset();
}, 2000);
