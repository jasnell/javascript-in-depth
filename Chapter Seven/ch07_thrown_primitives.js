// Chapter 7: Errors - Throwing Primitives
// See: "What you can throw" and "Error handling"
//
// JavaScript allows throwing any value, not just Error objects. While this
// flexibility exists, throwing non-Error values loses stack traces and
// makes debugging much harder. This explores the implications.
//
// Run with: node ch07_thrown_primitives.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- You Can Throw Anything ---\n');

const throwables = [
  'a string',
  42,
  true,
  null,
  undefined,
  { custom: 'object' },
  ['an', 'array'],
  Symbol('symbol'),
  () => 'a function',
  new Error('actual error')
];

for (const value of throwables) {
  try {
    throw value;
  } catch (e) {
    const type = e === null ? 'null' :
                 e === undefined ? 'undefined' :
                 typeof e === 'symbol' ? 'symbol' :
                 typeof e;
    log(`Caught ${type}`, e?.toString?.() ?? String(e));
  }
}

console.log('\n--- The Problem: No Stack Trace ---\n');

function throwString() {
  throw 'Something went wrong';
}

function throwError() {
  throw new Error('Something went wrong');
}

function caller1() { throwString(); }
function caller2() { throwError(); }

try {
  caller1();
} catch (e) {
  console.log('Caught string:');
  console.log('  Value:', e);
  console.log('  Stack:', e.stack);  // undefined!
  console.log('  Where did this come from? No idea.');
}

console.log('');

try {
  caller2();
} catch (e) {
  console.log('Caught Error:');
  console.log('  Value:', e.message);
  console.log('  Stack:', e.stack.split('\n').slice(0, 4).join('\n'));
}

console.log('\n--- Type Checking Thrown Values ---\n');

function processError(error) {
  // Robust error handling must account for non-Error values
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name
    };
  }

  // Handle thrown primitives
  return {
    message: String(error),
    stack: null,
    name: 'NonError'
  };
}

console.log('Processing thrown string:');
log('Result', JSON.stringify(processError('oops')));

console.log('\nProcessing thrown Error:');
log('Result', JSON.stringify(processError(new Error('oops')), null, 2));

console.log('\n--- Re-throwing and Wrapping ---\n');

function riskyOperation() {
  // Some code might throw a string
  throw 'connection timeout';
}

function safeWrapper() {
  try {
    riskyOperation();
  } catch (e) {
    // Normalize to Error object
    if (e instanceof Error) {
      throw e;
    }
    const wrapped = new Error(String(e));
    wrapped.originalValue = e;
    throw wrapped;
  }
}

try {
  safeWrapper();
} catch (e) {
  console.log('Wrapped error has stack:');
  console.log(e.stack.split('\n').slice(0, 4).join('\n'));
  log('Original value', e.originalValue);
}

console.log('\n--- Promise Rejections ---\n');

// Promises can also reject with non-Error values
async function rejectWithString() {
  return Promise.reject('async failure');
}

async function rejectWithError() {
  return Promise.reject(new Error('async failure'));
}

try {
  await rejectWithString();
} catch (e) {
  console.log('Promise rejected with string:');
  log('  Type', typeof e);
  log('  Stack', e.stack);  // undefined
}

try {
  await rejectWithError();
} catch (e) {
  console.log('\nPromise rejected with Error:');
  log('  Type', typeof e);
  log('  Has stack', !!e.stack);
}

console.log('\n--- Libraries That Throw Strings ---\n');

console.log('Some older libraries throw strings for "quick" errors:');
console.log('  throw "Invalid argument"');
console.log('');
console.log('Problems:');
console.log('  1. No stack trace - where did this come from?');
console.log('  2. No error name or type discrimination');
console.log('  3. Cannot add properties (cause, code, etc.)');
console.log('  4. Breaks error monitoring tools');

console.log('\n--- Best Practices ---\n');

console.log('Always throw Error objects or subclasses:');
console.log('');
console.log('  // Good');
console.log('  throw new Error("message");');
console.log('  throw new TypeError("message");');
console.log('  throw new CustomError("message");');
console.log('');
console.log('  // Bad');
console.log('  throw "message";');
console.log('  throw { error: "message" };');
console.log('  throw 404;');

console.log('\n--- ESLint Rule ---\n');

console.log('Enable "no-throw-literal" rule to catch this:');
console.log('  "rules": { "no-throw-literal": "error" }');
console.log('');
console.log('This will error on: throw "string"');
console.log('This will pass on:  throw new Error("string")');

console.log('\n--- Catching Unknown Throws ---\n');

function catchAll() {
  try {
    // Unknown code that might throw anything
    throw Math.random() > 0.5 ? new Error('error') : 'string';
  } catch (e) {
    // Defensive handling
    const message = e instanceof Error ? e.message : String(e);
    const stack = e instanceof Error ? e.stack : new Error().stack;

    console.log('Normalized error:');
    log('  Message', message);
    console.log('  Stack available:', !!stack);
  }
}

catchAll();
