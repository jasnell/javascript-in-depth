// Chapter 7: Errors - The Error Cause Chain
// See: "The error cause chain" (ES2022)
//
// The cause property lets you wrap errors at boundaries, preserving the full
// debugging context while presenting clean, safe messages to callers. This
// solves the tension between recovery (needs simple error types) and
// debugging (needs complete context).

console.log('--- Error Cause for Context Preservation ---\n');

// Low-level database error with potentially sensitive details
function queryDatabase(sql) {
  throw new Error('Connection refused: auth token expired for user db_admin');
}

// Middle layer wraps with business context
function getUserById(id) {
  try {
    return queryDatabase(`SELECT * FROM users WHERE id = ${id}`);
  } catch (dbError) {
    throw new Error(`Failed to fetch user ${id}`, { cause: dbError });
  }
}

// API layer wraps with public-safe message
function handleUserRequest(userId) {
  try {
    return getUserById(userId);
  } catch (serviceError) {
    throw new Error('User service unavailable', { cause: serviceError });
  }
}

try {
  handleUserRequest(123);
} catch (err) {
  console.log('Public error:', err.message);
  console.log('Service error:', err.cause?.message);
  console.log('Database error:', err.cause?.cause?.message);

  // Walk the complete cause chain for debugging
  console.log('\n--- Full Error Chain ---');
  let current = err;
  let depth = 0;
  while (current) {
    console.log(`${'  '.repeat(depth)}${current.message}`);
    current = current.cause;
    depth++;
  }
}

console.log('\n--- Recovery vs Debugging ---\n');

// For recovery: check error type or code, not message
function handleWithRecovery(err) {
  if (err.message.includes('unavailable')) {
    console.log('Recovery: Will retry later');
    return { retry: true };
  }
  console.log('Recovery: Cannot recover, propagating error');
  throw err;
}

// For debugging: walk the cause chain for full context
function logForDebugging(err) {
  console.log('Debug: Error chain for investigation:');
  let current = err;
  while (current) {
    console.log(`  - ${current.message}`);
    if (current.stack) {
      const location = current.stack.split('\n')[1]?.trim();
      if (location) console.log(`    at ${location}`);
    }
    current = current.cause;
  }
}

try {
  handleUserRequest(456);
} catch (err) {
  handleWithRecovery(err);
  logForDebugging(err);
}

// The cause property lets you hide sensitive internals from callers while
// keeping the full context available for debugging. Wrap errors at each
// boundary layer with appropriate context for that layer.
