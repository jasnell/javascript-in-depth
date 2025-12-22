// Chapter 6: Functions - The Arguments Object Cost
// See: "The arguments object" and "Function optimization"
//
// The 'arguments' object is a legacy feature that can prevent optimizations.
// It creates a link between the object and the actual parameters, which
// engines must maintain. Rest parameters are the modern, optimizable alternative.
//
// Run with: node --allow-natives-syntax ch06_arguments_object.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- The Arguments Object ---\n');

function showArguments(a, b) {
  console.log('arguments:', [...arguments]);
  console.log('a:', a, 'b:', b);
}

showArguments(1, 2, 3, 4);

console.log('\n--- The Aliasing Problem ---\n');

function aliased(x) {
  console.log('Initial x:', x);
  arguments[0] = 'modified';
  console.log('After arguments[0] = "modified"');
  console.log('x is now:', x);
}

// In non-strict mode, arguments[0] and x are aliased!
aliased('original');

console.log('\n(In strict mode, this aliasing does not occur)');

console.log('\n--- Why Arguments Hurts Optimization ---\n');

function withArguments(a, b, c) {
  // Using arguments prevents certain optimizations:
  // 1. Cannot eliminate unused parameters
  // 2. Must maintain arguments object even if not obviously used
  // 3. Aliasing requires tracking parameter/arguments relationship
  let sum = 0;
  for (let i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
}

function withRestParams(...args) {
  // Rest parameters are a real array, no aliasing issues
  let sum = 0;
  for (let i = 0; i < args.length; i++) {
    sum += args[i];
  }
  return sum;
}

// Warm up
for (let i = 0; i < 10000; i++) {
  withArguments(i, i + 1, i + 2);
  withRestParams(i, i + 1, i + 2);
}

console.log('arguments: Object that aliases parameters');
console.log('rest params: Real array, no aliasing');

console.log('\n--- Performance Comparison ---\n');

const iterations = 100000;

const start1 = performance.now();
for (let i = 0; i < iterations; i++) {
  withArguments(1, 2, 3, 4, 5);
}
const time1 = performance.now() - start1;

const start2 = performance.now();
for (let i = 0; i < iterations; i++) {
  withRestParams(1, 2, 3, 4, 5);
}
const time2 = performance.now() - start2;

log('Using arguments', `${time1.toFixed(2)}ms`);
log('Using rest params', `${time2.toFixed(2)}ms`);

console.log('\n--- Leaking Arguments ---\n');

function leaksArguments() {
  // Passing arguments to another function can prevent optimization
  return Array.prototype.slice.call(arguments);
}

function safeRest(...args) {
  return args.slice();
}

console.log('Passing arguments to other functions "leaks" it');
console.log('This can prevent the function from being inlined');

console.log('\n--- Arguments Patterns That Block Optimization ---\n');

function badPattern1() {
  arguments[0] = 'x';  // Modification
  return arguments[0];
}

function badPattern2() {
  return arguments;  // Returning arguments object
}

function badPattern3() {
  someOtherFunction(arguments);  // Passing to another function
}

function badPattern4(a) {
  if (arguments.length > 1) {  // Fine on its own
    a = arguments[1];          // But reassigning parameter = problem
  }
  return a;
}

console.log('Patterns that can block optimization:');
console.log('  1. Modifying arguments[i]');
console.log('  2. Returning the arguments object');
console.log('  3. Passing arguments to other functions');
console.log('  4. Reassigning parameters when arguments is accessed');

console.log('\n--- Modern Alternatives ---\n');

// Old pattern: convert arguments to array
function oldWay() {
  const args = Array.prototype.slice.call(arguments);
  return args.map(x => x * 2);
}

// Modern: rest parameters
function newWay(...args) {
  return args.map(x => x * 2);
}

// Old pattern: "borrowing" methods
function oldApply(fn) {
  return fn.apply(null, Array.prototype.slice.call(arguments, 1));
}

// Modern: rest and spread
function newApply(fn, ...args) {
  return fn(...args);
}

log('oldWay(1, 2, 3)', oldWay(1, 2, 3));
log('newWay(1, 2, 3)', newWay(1, 2, 3));

console.log('\n--- Summary ---\n');

console.log('Prefer rest parameters (...args) over arguments:');
console.log('  - Real array with all array methods');
console.log('  - No aliasing with parameters');
console.log('  - Better optimized by V8');
console.log('  - Clearer intent in code');
console.log('');
console.log('Only use arguments when you need:');
console.log('  - arguments.callee (deprecated, avoid)');
console.log('  - Legacy code compatibility');
