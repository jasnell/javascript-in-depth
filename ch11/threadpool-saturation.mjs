// run: UV_THREADPOOL_SIZE=4 node threadpool-saturation.mjs
// Detects libuv thread pool saturation by timing fs.stat while crypto work occupies the pool, and reads uvMetricsInfo.

import fs from 'node:fs';
import crypto from 'node:crypto';
import { performance } from 'node:perf_hooks';

// fs.stat, dns.lookup, and pbkdf2 all share the same libuv thread pool
// (default size 4, set via UV_THREADPOOL_SIZE before start; it cannot
// change at runtime). Note: dns.lookup uses the pool, dns.resolve does
// not (it queries DNS servers directly over the network).

// Saturate the pool: enough concurrent pbkdf2 calls to occupy every thread.
for (let i = 0; i < 8; i++) {
  crypto.pbkdf2('secret', 'salt', 1_000_000, 64, 'sha512', () => {});
}

// A local fs.stat should finish in well under a millisecond. If it takes
// tens of ms, it was waiting for a free thread, not for the disk.
const probe = setInterval(() => {
  const start = performance.now();
  fs.stat(import.meta.filename, () => {
    const elapsed = performance.now() - start;
    console.log(`fs.stat took ${elapsed.toFixed(1)} ms`);
  });
}, 200);

// uvMetricsInfo: rising eventsWaiting means events arrive faster than the
// loop drains them, a direct saturation signal.
setInterval(() => {
  console.log('uvMetricsInfo', performance.nodeTiming.uvMetricsInfo);
}, 1000);

setTimeout(() => clearInterval(probe), 6000);
