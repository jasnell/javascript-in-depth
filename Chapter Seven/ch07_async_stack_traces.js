// Chapter 7: Errors - Async Stack Traces
// See: "Async error handling" and "Stack traces across async boundaries"
//
// In async code, the call stack at error time doesn't show what initiated
// the async operation. Node.js and V8 provide async stack traces to help,
// but they have performance costs and limitations.
//
// Run with: node --async-stack-traces ch07_async_stack_traces.js
// (--async-stack-traces is on by default in modern Node.js)

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- The Async Stack Problem ---\n');

async function fetchUser(id) {
  // Simulated async operation
  await new Promise(resolve => setTimeout(resolve, 10));
  throw new Error(`User ${id} not found`);
}

async function loadProfile(userId) {
  return await fetchUser(userId);
}

async function displayDashboard() {
  return await loadProfile(123);
}

// Without async stack traces, we'd only see the immediate call stack
(async () => {
  try {
    await displayDashboard();
  } catch (error) {
    console.log('Error caught:');
    console.log(error.stack);
  }
})();

// Give async operations time to complete
await new Promise(resolve => setTimeout(resolve, 100));

console.log('\n--- Async Stack Trace Markers ---\n');

console.log('Look for markers in the stack trace:');
console.log('  - "at async" prefix shows async function boundaries');
console.log('  - Full chain of async callers is preserved');
console.log('');
console.log('Without async stack traces:');
console.log('  Only the immediate call stack at throw time');
console.log('');
console.log('With async stack traces:');
console.log('  See the full async call chain that led here');

console.log('\n--- Callbacks Lose Context ---\n');

function fetchWithCallback(id, callback) {
  setTimeout(() => {
    callback(new Error(`Callback: User ${id} not found`));
  }, 10);
}

function loadWithCallback() {
  fetchWithCallback(456, (error) => {
    if (error) {
      console.log('Callback error stack:');
      console.log(error.stack);
      console.log('\nNote: No trace back to loadWithCallback()');
    }
  });
}

loadWithCallback();
await new Promise(resolve => setTimeout(resolve, 100));

console.log('\n--- Preserving Context with Error.captureStackTrace ---\n');

function fetchWithContext(id, callback) {
  // Capture stack at call time, not callback time
  const callSiteError = {};
  Error.captureStackTrace(callSiteError);

  setTimeout(() => {
    const error = new Error(`User ${id} not found`);
    error.stack += '\n--- Call site stack ---\n' + callSiteError.stack;
    callback(error);
  }, 10);
}

function loadWithContext() {
  fetchWithContext(789, (error) => {
    if (error) {
      console.log('Error with preserved context:');
      console.log(error.stack);
    }
  });
}

loadWithContext();
await new Promise(resolve => setTimeout(resolve, 100));

console.log('\n--- Performance Cost ---\n');

async function fastAsync() {
  return await Promise.resolve(42);
}

const iterations = 10000;

// Warm up
for (let i = 0; i < 100; i++) {
  await fastAsync();
}

const start = performance.now();
for (let i = 0; i < iterations; i++) {
  await fastAsync();
}
const time = performance.now() - start;

log(`${iterations} async calls`, `${time.toFixed(2)}ms`);
console.log('Async stack traces add overhead to every async operation');
console.log('Consider --no-async-stack-traces in production for performance');

console.log('\n--- Error.cause for Async Chains ---\n');

async function lowLevel() {
  throw new Error('Database connection failed');
}

async function midLevel() {
  try {
    await lowLevel();
  } catch (error) {
    throw new Error('Failed to fetch user', { cause: error });
  }
}

async function highLevel() {
  try {
    await midLevel();
  } catch (error) {
    throw new Error('Dashboard load failed', { cause: error });
  }
}

try {
  await highLevel();
} catch (error) {
  console.log('Error chain with cause:');

  let current = error;
  let depth = 0;
  while (current) {
    console.log(`${'  '.repeat(depth)}${current.message}`);
    current = current.cause;
    depth++;
  }
}

console.log('\n--- Best Practices ---\n');

console.log('1. Use async/await over callbacks when possible');
console.log('2. Enable async stack traces in development');
console.log('3. Consider disabling in production for performance');
console.log('4. Use error.cause to build explicit error chains');
console.log('5. Add context when wrapping errors');
