// Chapter 6: Functions - Tail Call Optimization
// See: "Tail calls" and "Recursion"
//
// Proper Tail Calls (PTC) were added to ES6, but only Safari implements them.
// V8/Node.js does NOT implement PTC. This demo shows the difference between
// tail-call and non-tail-call recursion, and the trampolining technique
// to achieve similar benefits in engines without PTC.
//
// Run with: node ch06_tail_call_optimization.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- What Is a Tail Call? ---\n');

// A tail call is when a function's LAST action is calling another function
// and returning its result directly. The current stack frame is no longer needed.

// NOT a tail call: must keep stack frame to add 1 after recursion returns
function factorialNotTail(n) {
  if (n <= 1) return 1;
  return n * factorialNotTail(n - 1);  // Must multiply AFTER the call
}

// IS a tail call: just returns the recursive call directly
function factorialTail(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factorialTail(n - 1, n * accumulator);  // Nothing left to do
}

log('Non-tail factorial(5)', factorialNotTail(5));
log('Tail factorial(5)', factorialTail(5));

console.log('\n--- Tail Call Position Examples ---\n');

// These ARE tail calls:
console.log('Tail call examples:');
console.log('  return f()              - Direct return');
console.log('  return a ? f() : g()    - In ternary');
console.log('  return a && f()         - Short-circuit');
console.log('  return (expr, f())      - After comma operator');

console.log('\nNOT tail calls:');
console.log('  return f() + 1          - Operation after call');
console.log('  return 1 + f()          - Operation after call');
console.log('  f(); return;            - Call not in return');
console.log('  return f(), g()         - Comma before, not after');

console.log('\n--- Stack Overflow Without TCO ---\n');

// V8/Node.js will stack overflow on deep recursion
function countdown(n) {
  if (n === 0) return 'done';
  return countdown(n - 1);  // Tail call position, but V8 doesn't optimize
}

try {
  countdown(10000);  // Might work
  log('countdown(10000)', 'succeeded');
} catch (e) {
  log('countdown(10000)', e.message);
}

try {
  countdown(100000);  // Likely fails
  log('countdown(100000)', 'succeeded');
} catch (e) {
  log('countdown(100000)', e.message);
}

console.log('\n--- Trampolining: Manual TCO ---\n');

// Trampolining converts recursion to iteration
// Instead of calling recursively, return a function to call next

function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);
    while (typeof result === 'function') {
      result = result();
    }
    return result;
  };
}

// Convert tail-recursive function to use trampolining
function countdownTrampoline(n) {
  if (n === 0) return 'done';
  return () => countdownTrampoline(n - 1);  // Return thunk instead of calling
}

const trampolinedCountdown = trampoline(countdownTrampoline);

try {
  log('trampolined(100000)', trampolinedCountdown(100000));
  log('trampolined(1000000)', trampolinedCountdown(1000000));
} catch (e) {
  log('Error', e.message);
}

console.log('\n--- Trampolined Factorial ---\n');

function factorialTrampoline(n, acc = 1) {
  if (n <= 1) return acc;
  return () => factorialTrampoline(n - 1, n * acc);
}

const trampolinedFactorial = trampoline(factorialTrampoline);
log('factorial(10)', trampolinedFactorial(10));
log('factorial(20)', trampolinedFactorial(20));

console.log('\n--- Continuation-Passing Style (CPS) ---\n');

// Another approach: pass "what to do next" as a function
function sumArrayCPS(arr, index, acc, continuation) {
  if (index >= arr.length) {
    return continuation(acc);
  }
  // Instead of tail call, use continuation
  return () => sumArrayCPS(arr, index + 1, acc + arr[index], continuation);
}

function runCPS(thunk) {
  while (typeof thunk === 'function') {
    thunk = thunk();
  }
  return thunk;
}

const bigArray = Array.from({ length: 100000 }, (_, i) => i);
const cpsSum = runCPS(sumArrayCPS(bigArray, 0, 0, x => x));
log('Sum of 0..99999 via CPS', cpsSum);

console.log('\n--- Comparing Stack Depth ---\n');

let maxDepth = 0;

function measureDepthRecursive(n, depth = 0) {
  maxDepth = Math.max(maxDepth, depth);
  if (n === 0) return depth;
  return measureDepthRecursive(n - 1, depth + 1);
}

function measureDepthTrampoline(n, depth = 0) {
  maxDepth = Math.max(maxDepth, depth);
  if (n === 0) return depth;
  return () => measureDepthTrampoline(n - 1, depth + 1);
}

// Measure recursive depth
maxDepth = 0;
try {
  measureDepthRecursive(50000);
} catch (e) {
  // Stack overflow expected
}
log('Max depth (recursive)', maxDepth);

// Measure trampolined depth
maxDepth = 0;
trampoline(measureDepthTrampoline)(50000);
log('Max depth (trampolined)', maxDepth);
log('Trampolined completed', 'yes');

console.log('\n--- Generator-Based Trampolining ---\n');

// Generators provide another way to avoid stack growth
function* fibGenerator(n, a = 0n, b = 1n) {
  if (n === 0) return a;
  yield;  // Pause execution, allowing stack to unwind
  return yield* fibGenerator(n - 1, b, a + b);
}

function runGenerator(gen) {
  let result = gen.next();
  while (!result.done) {
    result = gen.next();
  }
  return result.value;
}

log('fib(50) via generator', runGenerator(fibGenerator(50)).toString());
log('fib(100) via generator', runGenerator(fibGenerator(100)).toString());

console.log('\n--- Iterative Alternatives ---\n');

// Often the best solution is just to use iteration
function factorialIterative(n) {
  let result = 1n;
  for (let i = 2n; i <= n; i++) {
    result *= i;
  }
  return result;
}

function fibIterative(n) {
  if (n === 0) return 0n;
  let a = 0n, b = 1n;
  for (let i = 1; i < n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

log('factorial(50) iterative', factorialIterative(50n).toString().slice(0, 30) + '...');
log('fib(100) iterative', fibIterative(100).toString());

console.log('\n--- Summary ---\n');

console.log('Key points:');
console.log('  1. ES6 specifies Proper Tail Calls, but only Safari implements them');
console.log('  2. V8/Node.js does NOT optimize tail calls');
console.log('  3. Use trampolining for deep recursion without stack overflow');
console.log('  4. Consider iterative solutions when possible');
console.log('  5. Generators can also avoid stack growth');
