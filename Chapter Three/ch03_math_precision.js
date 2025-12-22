// Chapter 3: Numbers - Math Precision and Rounding Errors
// See: "Floating-point arithmetic" and "Precision loss"
//
// IEEE 754 floating-point numbers can't represent most decimal fractions
// exactly. This leads to accumulated rounding errors that can cause
// subtle bugs in financial calculations, comparisons, and loops.
//
// Run with: node ch03_math_precision.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- The Classic 0.1 + 0.2 Problem ---\n');

const sum = 0.1 + 0.2;
log('0.1 + 0.2', sum);
log('0.1 + 0.2 === 0.3', sum === 0.3);
log('Difference from 0.3', Math.abs(sum - 0.3));

// Why? 0.1 and 0.2 can't be represented exactly in binary
console.log('\nBinary representation issues:');
log('0.1 stored as', (0.1).toPrecision(20));
log('0.2 stored as', (0.2).toPrecision(20));
log('0.3 stored as', (0.3).toPrecision(20));

console.log('\n--- Accumulated Rounding Errors ---\n');

// Adding 0.1 many times
let accumulated = 0;
for (let i = 0; i < 10; i++) {
  accumulated += 0.1;
}
log('0.1 added 10 times', accumulated);
log('Expected 1.0, difference', Math.abs(accumulated - 1.0));

// More iterations = more error
let sum100 = 0;
for (let i = 0; i < 100; i++) {
  sum100 += 0.01;
}
log('\n0.01 added 100 times', sum100);
log('Expected 1.0, difference', Math.abs(sum100 - 1.0));

console.log('\n--- Comparing Floating-Point Numbers ---\n');

// Never use === for floating-point comparison
function naiveEqual(a, b) {
  return a === b;
}

function epsilonEqual(a, b, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon;
}

function relativeEqual(a, b, tolerance = 1e-10) {
  const diff = Math.abs(a - b);
  const max = Math.max(Math.abs(a), Math.abs(b));
  return diff < tolerance * max;
}

const a = 0.1 + 0.2;
const b = 0.3;

log('Naive (===)', naiveEqual(a, b));
log('Epsilon comparison', epsilonEqual(a, b, 1e-15));
log('Relative comparison', relativeEqual(a, b));

console.log('\n--- Loop Counter Problems ---\n');

// Floating-point loop counters can cause infinite loops or off-by-one errors
console.log('Counting from 0 to 1 by 0.1:');
let count = 0;
for (let x = 0; x <= 1; x += 0.1) {
  count++;
}
log('Iterations (expected 11)', count);

// The issue: after 10 additions, x might be 0.9999999999999999 or 1.0000000000000002
console.log('\nFinal values in similar loops:');
let x1 = 0;
for (let i = 0; i < 10; i++) x1 += 0.1;
log('After 10 additions of 0.1', x1);
log('x1 <= 1.0', x1 <= 1.0);

console.log('\n--- Financial Calculation Errors ---\n');

// Never use floats for money!
const price = 19.99;
const quantity = 3;
const subtotal = price * quantity;
log('$19.99 x 3', subtotal);

const tax = subtotal * 0.08;
log('8% tax', tax);
log('Tax rounded', Math.round(tax * 100) / 100);

// Errors compound
let balance = 1000.00;
const dailyInterest = 0.0001;  // 0.01% daily
for (let day = 0; day < 365; day++) {
  balance += balance * dailyInterest;
}
log('\n$1000 with 0.01% daily for 365 days', balance);
log('Precise calculation would be', 1000 * Math.pow(1 + dailyInterest, 365));

console.log('\n--- Solutions for Precision ---\n');

console.log('1. Integer arithmetic (cents, not dollars):');
const priceInCents = 1999;
const totalCents = priceInCents * 3;
log('   1999 cents x 3', totalCents + ' cents = $' + (totalCents / 100).toFixed(2));

console.log('\n2. Rounding to fixed decimals:');
function roundTo(n, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}
log('   roundTo(0.1 + 0.2, 2)', roundTo(0.1 + 0.2, 2));

console.log('\n3. Using toFixed for display:');
log('   (0.1 + 0.2).toFixed(1)', (0.1 + 0.2).toFixed(1));

console.log('\n4. BigInt for exact integers:');
const bigPrice = 1999n;  // cents as BigInt
const bigTotal = bigPrice * 3n;
log('   1999n * 3n', bigTotal.toString() + ' cents');

console.log('\n--- Precision Loss at Large Numbers ---\n');

// Beyond 2^53, integers lose precision
const big = Number.MAX_SAFE_INTEGER;
log('MAX_SAFE_INTEGER', big);
log('MAX_SAFE_INTEGER + 1', big + 1);
log('MAX_SAFE_INTEGER + 2', big + 2);
log('Lost precision?', big + 1 === big + 2);

// Scientific calculations
const avogadro = 6.02214076e23;
log('\nAvogadro number', avogadro);
log('+ 1', avogadro + 1);
log('Same value?', avogadro === avogadro + 1);

console.log('\n--- Cancellation Errors ---\n');

// Subtracting nearly equal numbers loses precision
const large1 = 1 + Number.EPSILON;
const large2 = 1 + 2 * Number.EPSILON;
console.log('Two nearly equal numbers:');
log('  a', large1.toPrecision(20));
log('  b', large2.toPrecision(20));
log('  b - a', (large2 - large1).toPrecision(5));

// More dramatic example
const x = 1e16;
const y = 1;
console.log('\nLarge + small + cancel:');
console.log('  x = 1e16, y = 1');
log('  (x + y) - x', (x + y) - x);  // Should be 1, but y is lost

console.log('\n--- Best Practices Summary ---\n');

console.log('1. Use integers for money (store cents, not dollars)');
console.log('2. Use epsilon comparison for floating-point equality');
console.log('3. Avoid floating-point loop counters');
console.log('4. Round results appropriately for display');
console.log('5. Use BigInt for exact large integers');
console.log('6. Consider decimal libraries for financial calculations');
