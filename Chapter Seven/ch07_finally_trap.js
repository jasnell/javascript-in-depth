// Chapter 7: Errors - The Finally Trap
// See: "The finally trap"
//
// finally blocks always run, which makes them perfect for cleanup. But they
// have a dangerous edge case: a return or throw in finally will suppress or
// replace the original error entirely.

console.log('--- finally Can Suppress Errors ---\n');

function errorSuppressed() {
  try {
    throw new Error('This error disappears');
  } finally {
    return 'Success!';  // Suppresses the error entirely
  }
}

console.log('errorSuppressed() returns:', errorSuppressed());
// No error thrown - the return in finally suppressed it

console.log('\n--- finally Can Replace Errors ---\n');

function errorReplaced() {
  try {
    throw new Error('Original error');
  } finally {
    throw new Error('Replacement error');  // Replaces the original
  }
}

try {
  errorReplaced();
} catch (e) {
  console.log('Caught:', e.message);  // 'Replacement error', not 'Original error'
}

console.log('\n--- Correct finally Usage ---\n');

// finally should only do cleanup - no return, no throw
function correctFinally() {
  let resource = null;
  try {
    resource = { name: 'acquired' };
    console.log('Resource acquired:', resource.name);
    throw new Error('Operation failed');
  } catch (e) {
    console.log('Error caught:', e.message);
    throw e;  // Re-throw after handling
  } finally {
    // Cleanup only - no return, no throw
    if (resource) {
      console.log('Cleaning up resource');
      resource = null;
    }
  }
}

try {
  correctFinally();
} catch (e) {
  console.log('Original error preserved:', e.message);
}

console.log('\n--- Transaction Boundary Pattern ---\n');

// Proper error handling at a semantic boundary
function updateWithTransaction(data) {
  const tx = { active: true, rollback() { this.active = false; } };

  try {
    console.log('Beginning transaction');
    if (data.invalid) {
      throw new Error('Validation failed');
    }
    console.log('Committing transaction');
    tx.active = false;
    return { success: true };
  } catch (e) {
    console.log('Rolling back due to:', e.message);
    tx.rollback();
    throw new Error('Transaction failed', { cause: e });
  } finally {
    // Cleanup only - ensure transaction state is consistent
    if (tx.active) {
      console.log('Ensuring transaction cleanup');
      tx.rollback();
    }
  }
}

try {
  updateWithTransaction({ invalid: true });
} catch (e) {
  console.log('Final error:', e.message);
  console.log('Cause:', e.cause?.message);
}

// finally blocks always run, which is why they're used for cleanup.
// But return or throw in finally will suppress or replace the original
// error. Use finally only for cleanup code that doesn't affect control flow.
