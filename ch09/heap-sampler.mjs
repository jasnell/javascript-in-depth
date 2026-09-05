// run: node --expose-gc heap-sampler.mjs   (--expose-gc optional; it makes the post-collection baseline readable)
// Samples heapUsed after each round: a healthy workload holds a flat baseline, a leak climbs.

const retained = [];

function round(leak) {
  const batch = [];
  for (let i = 0; i < 20000; i++) {
    batch.push({ i, payload: 'x'.repeat(200) });
  }
  if (leak) retained.push(batch.slice(0, 2000)); // survivors accumulate across rounds
  return batch.length;
}

function sample(label, leak) {
  console.log(`\n${label} (heapUsed after each round, MB):`);
  for (let r = 0; r < 10; r++) {
    round(leak);
    if (globalThis.gc) globalThis.gc(); // force collection so the reading is a post-GC baseline
    const mb = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`  round ${r}: ${mb.toFixed(1)}`);
  }
}

sample('healthy', false); // baseline returns to roughly the same level each round (sawtooth)
retained.length = 0;
sample('leaking', true); // baseline climbs monotonically
