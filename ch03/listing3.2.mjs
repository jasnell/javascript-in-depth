// Listing 3.2 Self-contained harness measuring the SMI vs HeapNumber cost. Prints its own timings.

// Results vary by engine version, CPU, and load; expect only a rough ratio, not fixed numbers.
const ITERATIONS = 10_000_000;

// Phase 1: a base inside the SMI range keeps intermediate integers on the fast path.
let smiBase = 2147483647; // the maximum SMI value
let smiSink = 0;
console.time('SMI arithmetic');
for (let i = 0; i < ITERATIONS; i++) {
  // Sink prevents the loop body from being eliminated as dead code.
  smiSink += (smiBase - 1) - (smiBase - 2);
}
console.timeEnd('SMI arithmetic');

// Phase 2: a base just past the SMI range forces HeapNumber allocation from the start.
let heapBase = 2147483648; // SMI max + 1, always a HeapNumber
let heapSink = 0;
console.time('HeapNumber arithmetic');
for (let i = 0; i < ITERATIONS; i++) {
  heapSink += (heapBase - 1) - (heapBase - 2);
}
console.timeEnd('HeapNumber arithmetic');

// Print the sinks so the optimizer cannot discard the work.
console.log('sinks:', smiSink, heapSink);
// HeapNumber operations are often 2-3x slower, but the gap is not guaranteed.
