// BigInt arithmetic runs in software over variable-length chunks, so it is slower than Number.

// Absolute timings vary by machine and engine; the ratio is the point.
const ITERATIONS = 5_000_000;

let numberSink = 0;
console.time('Number addition');
for (let i = 0; i < ITERATIONS; i++) {
  numberSink += i; // fixed-width, hardware add
}
console.timeEnd('Number addition');

let bigintSink = 0n;
console.time('BigInt addition');
for (let i = 0; i < ITERATIONS; i++) {
  bigintSink += BigInt(i); // arbitrary-precision, software add
}
console.timeEnd('BigInt addition');

// Division widens the gap further because it is the most expensive BigInt operation.
console.time('Number division');
let nDiv = 0;
for (let i = 1; i <= ITERATIONS; i++) {
  nDiv = (numberSink / i) | 0;
}
console.timeEnd('Number division');

console.time('BigInt division');
let bDiv = 0n;
for (let i = 1n; i <= BigInt(ITERATIONS); i++) {
  bDiv = bigintSink / i;
}
console.timeEnd('BigInt division');

// Reference the sinks so nothing is eliminated as dead code.
console.log(numberSink, bigintSink, nDiv, bDiv);
