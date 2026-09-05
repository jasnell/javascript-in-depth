// Measures the cost of coercing inside a sort comparator (parse per comparison) versus converting once at the boundary.

import { performance } from 'node:perf_hooks';

// Build a shuffled array of ISO date-time strings, like an API might send.
const N = 20_000;
const base = Date.UTC(1990, 0, 1);
const dayMs = 86_400_000;
const timestamps = Array.from({ length: N }, (_, i) =>
  new Date(base + ((i * 7919) % N) * dayMs).toISOString()
);

// SLOW: the comparator parses BOTH strings into Dates on every comparison.
// A sort of N items does on the order of N*log2(N) comparisons, so this parses
// each string many times over.
function sortWithCoercionEachCompare(input) {
  const arr = input.slice();
  arr.sort((a, b) => new Date(a) - new Date(b)); // Date parse happens per comparison
  return arr;
}

// FAST: parse each string to a number ONCE, sort by the precomputed key,
// then read the strings back out (a "decorate-sort-undecorate").
function sortWithConversionOnce(input) {
  const decorated = input.map((s) => ({ key: Date.parse(s), s })); // N parses total
  decorated.sort((a, b) => a.key - b.key);                          // compares plain numbers
  return decorated.map((d) => d.s);
}

function time(label, fn, input) {
  const start = performance.now();
  const out = fn(input);
  const ms = performance.now() - start;
  console.log(`${label}: ${ms.toFixed(1)} ms`);
  return out;
}

const slow = time('coerce every comparison', sortWithCoercionEachCompare, timestamps);
const fast = time('convert once at boundary', sortWithConversionOnce, timestamps);

// Both produce the same order; only the cost differs.
console.log('same result:', slow.length === fast.length && slow[0] === fast[0] && slow.at(-1) === fast.at(-1));
