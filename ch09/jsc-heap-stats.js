// run: bun jsc-heap-stats.js  (Bun-only; uses the bun:jsc module, which has no equivalent on Node)
// JSC exposes coarse heap stats plus manual eden/full collection instead of V8's per-event --trace-gc log.

import { heapStats, edenGC, fullGC } from 'bun:jsc';

function snapshot(label) {
  const s = heapStats();
  console.log(`${label}: objectCount=${s.objectCount} heapSize=${s.heapSize} heapCapacity=${s.heapCapacity}`);
}

snapshot('start');

let retained = [];
for (let i = 0; i < 100000; i++) {
  const o = { i, data: 'x'.repeat(50) };
  if (i % 50 === 0) retained.push(o);
}

snapshot('after allocation');

edenGC(); // young-generation (eden) collection: skips objects whose sticky mark bit is already set
snapshot('after edenGC');

retained = null;
fullGC(); // full collection clears the mark bits and re-examines the whole heap
snapshot('after fullGC');
