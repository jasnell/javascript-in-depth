// run: node --trace-opt --trace-deopt warmup-hot-loop.mjs
// A stable hot loop climbs the tiers: Ignition to Maglev to TurboFan (watch for OSR).

function add(a, b) {
  return a + b;
}

// Called once, add stays interpreted by Ignition (no optimization traced).
console.log(add(1, 2)); // 3

// Called two million times with the same number shapes: V8 marks add
// "hot and stable", compiles it with Maglev, then promotes it to TurboFan.
// The long-running loop itself is optimized in place via on-stack replacement.
let acc = 0;
for (let n = 0; n < 2_000_000; n++) {
  acc = add(acc, 1);
}
console.log(acc); // 2000000
