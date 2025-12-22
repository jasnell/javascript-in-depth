// Chapter 7: Errors - Stack Trace Limit and Performance
// See: "Stack traces" and "Error performance"
//
// Capturing stack traces is expensive. V8's Error.stackTraceLimit controls
// how many frames are captured. In high-throughput code, reducing this limit
// or avoiding stack trace capture entirely can improve performance.
//
// Run with: node ch07_stack_trace_limit.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Error.stackTraceLimit ---\n');

log('Default limit', Error.stackTraceLimit);

// The default is 10 frames
function deep1() { return deep2(); }
function deep2() { return deep3(); }
function deep3() { return deep4(); }
function deep4() { return deep5(); }
function deep5() { return deep6(); }
function deep6() { return deep7(); }
function deep7() { return deep8(); }
function deep8() { return deep9(); }
function deep9() { return deep10(); }
function deep10() { return deep11(); }
function deep11() { return deep12(); }
function deep12() { return new Error('deep'); }

const deepError = deep1();
console.log('Stack with default limit:');
console.log(deepError.stack);

console.log('\n--- Changing the Limit ---\n');

Error.stackTraceLimit = 3;
const shallowError = deep1();
console.log('Stack with limit = 3:');
console.log(shallowError.stack);

Error.stackTraceLimit = 10;  // Restore default

console.log('\n--- Performance Impact ---\n');

function createErrors(count, captureStack) {
  const oldLimit = Error.stackTraceLimit;

  if (!captureStack) {
    Error.stackTraceLimit = 0;
  }

  const start = performance.now();
  for (let i = 0; i < count; i++) {
    new Error('test');
  }
  const time = performance.now() - start;

  Error.stackTraceLimit = oldLimit;
  return time;
}

const iterations = 10000;

const withStack = createErrors(iterations, true);
const withoutStack = createErrors(iterations, false);

log(`Creating ${iterations} errors with stack`, `${withStack.toFixed(2)}ms`);
log(`Creating ${iterations} errors without stack`, `${withoutStack.toFixed(2)}ms`);
log('Speedup', `${(withStack / withoutStack).toFixed(1)}x`);

console.log('\n--- Deep Call Stacks Are Expensive ---\n');

function makeDeepCall(depth) {
  if (depth === 0) {
    return new Error('at bottom');
  }
  return makeDeepCall(depth - 1);
}

Error.stackTraceLimit = 100;

const start1 = performance.now();
for (let i = 0; i < 1000; i++) {
  makeDeepCall(10);
}
const time1 = performance.now() - start1;

const start2 = performance.now();
for (let i = 0; i < 1000; i++) {
  makeDeepCall(100);
}
const time2 = performance.now() - start2;

log('1000 errors at depth 10', `${time1.toFixed(2)}ms`);
log('1000 errors at depth 100', `${time2.toFixed(2)}ms`);

Error.stackTraceLimit = 10;

console.log('\n--- Error.captureStackTrace ---\n');

// V8 provides a way to capture stack traces on demand
const obj = {};
Error.captureStackTrace(obj);
console.log('Captured stack on plain object:');
console.log(obj.stack.split('\n').slice(0, 5).join('\n'));

console.log('\n--- Lazy Stack Trace Access ---\n');

// Stack traces are captured when Error is created, but formatted lazily
// The formatting happens when .stack is first accessed

class LazyError extends Error {
  constructor(message) {
    super(message);
    console.log('  Error created (stack captured but not formatted)');
  }
}

console.log('Creating error...');
const lazy = new LazyError('test');
console.log('Accessing .stack (formatting happens now)...');
const _ = lazy.stack;
console.log('Done');

console.log('\n--- Production Best Practices ---\n');

console.log('For high-performance code:');
console.log('  1. Set Error.stackTraceLimit = 0 in hot paths');
console.log('  2. Restore the limit after the critical section');
console.log('  3. Consider custom error classes without stack capture');
console.log('  4. Log full stacks only in development');

console.log('\n--- Custom Error Without Stack ---\n');

// Sometimes you want a lightweight error
// The key is to disable stack capture BEFORE calling super()
class LightweightError extends Error {
  constructor(message, code) {
    const originalLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    super(message);
    Error.stackTraceLimit = originalLimit;
    this.code = code;
  }
}

const lightStart = performance.now();
for (let i = 0; i < iterations; i++) {
  new LightweightError('test', 'ERR_CODE');
}
const lightTime = performance.now() - lightStart;

log(`${iterations} lightweight errors`, `${lightTime.toFixed(2)}ms`);
log('Compared to regular errors', `${(withStack / lightTime).toFixed(1)}x faster`);
