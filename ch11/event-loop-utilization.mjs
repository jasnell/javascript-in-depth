// Computes event loop utilization (ELU) as the delta between two performance.eventLoopUtilization() readings.

import { performance } from 'node:perf_hooks';

// ELU is active time (running callbacks, microtasks, timers, GC pauses)
// divided by total loop time. Called with two prior readings it returns
// the utilization for just that interval, unlike CPU which counts
// background thread noise.
let last = performance.eventLoopUtilization();

// Alternate busy and idle intervals so the ratio moves between samples.
setInterval(() => {
  const until = Date.now() + 300;
  while (Date.now() < until) {} // occupy the loop for part of the window
}, 1000);

setInterval(() => {
  const current = performance.eventLoopUtilization();
  const delta = performance.eventLoopUtilization(current, last);
  console.log(
    `ELU ${(delta.utilization * 100).toFixed(1)}%  ` +
    `active ${delta.active.toFixed(0)} ms  ` +
    `idle ${delta.idle.toFixed(0)} ms`,
  );
  last = current;
}, 2000);
