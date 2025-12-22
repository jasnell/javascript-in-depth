// Chapter 7: Errors - Async Boundaries Break Error Propagation
// See: "When the stack disappears" and "Global error handlers"
//
// try-catch only works within a single call stack. When you schedule async
// work with setTimeout, the original stack is gone by the time the callback
// runs. Errors thrown in callbacks can't be caught by try-catch around the
// scheduling code.

console.log('--- The Async Boundary Problem ---\n');

// This try-catch will NOT catch the error
function brokenErrorHandling() {
  try {
    setTimeout(() => {
      throw new Error('Async error in setTimeout');
    }, 50);
    console.log('try block completed (error not thrown yet)');
  } catch (e) {
    // This never runs - the error is thrown in a different stack
    console.log('Caught:', e.message);
  }
}

brokenErrorHandling();
console.log('Function returned (error still not thrown)\n');

// Global handler catches errors that escape all try-catch blocks
process.on('uncaughtException', (err, origin) => {
  console.log('--- Global Handler Caught Error ---');
  console.log('Error:', err.message);
  console.log('Origin:', origin);
  console.log('\nStack trace (notice: no info about who scheduled this):');
  console.log(err.stack);

  // In production, you'd log this and exit gracefully
  // process.exit(1);
});

// The correct pattern: handle errors inside the async callback
function correctErrorHandling() {
  setTimeout(() => {
    try {
      throw new Error('Error handled inside callback');
    } catch (e) {
      console.log('\n--- Correct Pattern ---');
      console.log('Caught inside callback:', e.message);
    }
  }, 100);
}

correctErrorHandling();

// Error-first callbacks (Node.js convention)
function withErrorCallback(callback) {
  setTimeout(() => {
    try {
      throw new Error('Operation failed');
    } catch (e) {
      callback(e, null);
      return;
    }
    callback(null, 'success');
  }, 150);
}

withErrorCallback((err, result) => {
  if (err) {
    console.log('\n--- Error-First Callback Pattern ---');
    console.log('Handled via callback:', err.message);
    return;
  }
  console.log('Result:', result);
});

setTimeout(() => {
  console.log('\n--- Summary ---');
  console.log('try-catch only works within the same call stack.');
  console.log('Async operations run in new stacks, breaking propagation.');
  console.log('Use: error callbacks, Promises, or async/await for async errors.');
}, 200);

// When async work is scheduled, the original call stack is gone by the time
// the callback runs. Global handlers are a last resort - handle errors at
// proper boundaries before they get there.
