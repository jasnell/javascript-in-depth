// run: node --expose-gc write-barrier-cost.mjs
// Storing a young-object reference into a promoted (old-generation) object pays the write barrier; a fresh object does not.

function promote(obj) {
  for (let i = 0; i < 5; i++) globalThis.gc(); // survive several scavenges to reach the old generation
  return obj;
}

const COUNT = 5_000_000;

const oldHolders = [];
for (let i = 0; i < 10000; i++) oldHolders.push({ ref: null });
promote(oldHolders);

const payloads = [];
for (let i = 0; i < 10000; i++) payloads.push({ i });

function timeit(label, fn) {
  const start = process.hrtime.bigint();
  fn();
  const ms = Number(process.hrtime.bigint() - start) / 1e6;
  console.log(`${label}: ${ms.toFixed(1)} ms`);
}

// Each store writes a young reference into an old object: it crosses the
// generation boundary and is recorded in the remembered set (write barrier).
timeit('write into OLD objects', () => {
  for (let n = 0; n < COUNT; n++) {
    const h = oldHolders[n % oldHolders.length];
    h.ref = payloads[n % payloads.length];
  }
});

// The holder is freshly allocated each iteration, so no cross-generation
// store happens and no remembered-set entry is recorded (allocation cost is included).
timeit('write into FRESH objects', () => {
  for (let n = 0; n < COUNT; n++) {
    const h = { ref: null };
    h.ref = payloads[n % payloads.length];
  }
});
