// Chapter 6: Functions - Inlining Decisions
// See: "JIT compilation" and "Function inlining"
//
// V8's TurboFan compiler can inline function calls, replacing the call with
// the function body. This eliminates call overhead and enables further
// optimizations. But not all functions can be inlined.
//
// Run with: node --allow-natives-syntax --trace-turbo-inlining ch06_inlining.js
// (--trace-turbo-inlining shows detailed inlining decisions)
//
// =============================================================================
// READING --trace-turbo-inlining OUTPUT:
// =============================================================================
//
// When you run with --trace-turbo-inlining, look for lines like:
//
//   Inlining small function "square" into "sumOfSquares"
//     - Function was inlined successfully
//
//   Not inlining "factorial" into "main" (recursive)
//     - Recursive functions have limited inlining depth
//
//   Not inlining "bigFunction" into "caller" (bytecode too large)
//     - Function exceeds the inlining bytecode budget
//
//   Not inlining (megamorphic call site)
//     - Too many different function targets at this call site
//
// %OptimizeFunctionOnNextCall(fn) forces TurboFan to optimize the function
// on its next invocation, useful for testing inlining behavior.
//
// %GetOptimizationStatus(fn) confirms optimization tier (see ch06_optimization_tiers.js)
// =============================================================================

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- What Is Inlining? ---\n');

console.log('Without inlining:');
console.log('  function square(x) { return x * x; }');
console.log('  function sumSquares(a, b) { return square(a) + square(b); }');
console.log('  // Each square() call has overhead: push args, jump, return');
console.log('');
console.log('With inlining:');
console.log('  function sumSquares(a, b) { return (a * a) + (b * b); }');
console.log('  // No call overhead, enables constant folding, etc.');

console.log('\n--- Simple Inlining Example ---\n');

function square(x) {
  return x * x;
}

function sumOfSquares(a, b) {
  return square(a) + square(b);
}

// Warm up to trigger optimization
for (let i = 0; i < 10000; i++) {
  sumOfSquares(i, i + 1);
}

%OptimizeFunctionOnNextCall(sumOfSquares);
const result = sumOfSquares(3, 4);
log('sumOfSquares(3, 4)', result);

console.log('square() is likely inlined into sumOfSquares()');

console.log('\n--- Functions Too Large to Inline ---\n');

function tooLarge(x) {
  // V8 has bytecode size limits for inlining
  // Large functions are not inlined
  let result = x;
  result = result + 1;
  result = result * 2;
  result = result - 3;
  result = result / 4;
  result = result + 5;
  result = result * 6;
  result = result - 7;
  result = result / 8;
  result = result + 9;
  result = result * 10;
  result = result - 11;
  result = result / 12;
  // ... more operations would make this definitely too large
  return result;
}

function callTooLarge(x) {
  return tooLarge(x) + tooLarge(x + 1);
}

for (let i = 0; i < 10000; i++) {
  callTooLarge(i);
}

console.log('Large functions may exceed inlining budget');

console.log('\n--- Recursive Functions ---\n');

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function callFactorial(x) {
  return factorial(x);
}

for (let i = 0; i < 10000; i++) {
  callFactorial(10);
}

console.log('Recursive functions: limited inlining depth');
console.log('V8 may inline a few levels, then stop');

console.log('\n--- Megamorphic Call Sites ---\n');

function processItem(item) {
  return item.process();
}

class TypeA { process() { return 1; } }
class TypeB { process() { return 2; } }
class TypeC { process() { return 3; } }
class TypeD { process() { return 4; } }
class TypeE { process() { return 5; } }
class TypeF { process() { return 6; } }

const items = [
  new TypeA(), new TypeB(), new TypeC(),
  new TypeD(), new TypeE(), new TypeF()
];

for (let i = 0; i < 10000; i++) {
  for (const item of items) {
    processItem(item);
  }
}

console.log('Megamorphic call sites (many different types):');
console.log('  - Cannot inline because target is unknown');
console.log('  - Each type has different process() implementation');

console.log('\n--- Helping the Inliner ---\n');

// Instead of one polymorphic function, use type-specific paths
function processTyped(item, type) {
  switch (type) {
    case 'A': return item.a;
    case 'B': return item.b;
    default: return item.value;
  }
}

console.log('Strategies to enable inlining:');
console.log('  1. Keep functions small (< ~100 bytecode instructions)');
console.log('  2. Use consistent types at call sites');
console.log('  3. Avoid deeply recursive structures');
console.log('  4. Prefer direct function calls over method calls');

console.log('\n--- Measuring Inlining Impact ---\n');

function innerHot(x) {
  return x * x + x;
}

function outerHot(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += innerHot(arr[i]);  // Hot call site, will be inlined
  }
  return sum;
}

const testArr = Array.from({ length: 1000 }, (_, i) => i);

// Warm up
for (let i = 0; i < 100; i++) {
  outerHot(testArr);
}

%OptimizeFunctionOnNextCall(outerHot);
outerHot(testArr);

const start = performance.now();
for (let i = 0; i < 10000; i++) {
  outerHot(testArr);
}
const time = performance.now() - start;

log('Time with inlined inner function', `${time.toFixed(2)}ms`);

console.log('\n--- Checking Inlining Decisions ---\n');

console.log('Use --trace-turbo-inlining to see:');
console.log('  - Which functions are inlined');
console.log('  - Why some functions are NOT inlined');
console.log('  - Inlining depth and budget remaining');
console.log('');
console.log('Example output:');
console.log('  Inlining square into sumOfSquares');
console.log('  Not inlining tooLarge: bytecode too large');
