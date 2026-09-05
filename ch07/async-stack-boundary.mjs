// Async boundaries sever the call stack: try/catch cannot catch a setTimeout throw.

function processData(data) {
  setTimeout(() => {
    // Runs on a fresh stack after processData has already returned.
    throw new Error('Processing failed');
  }, 50);
}

// Demonstrate that the error escapes try/catch by observing it globally.
process.once('uncaughtException', (err) => {
  console.log('escaped try/catch, reached global handler:', err.message);
  process.exit(0);
});

try {
  processData('payload');
} catch (e) {
  // Never reached: the throw happens later, on an unrelated stack.
  console.log('caught synchronously:', e.message);
}

console.log('processData returned; try/catch already unwound');
