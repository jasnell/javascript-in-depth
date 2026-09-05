// SuppressedError wraps an error thrown while another was already propagating.
// Its .error is the SUPPRESSING (later) error; .suppressed is the ORIGINAL.
//
// Requires Node 24+ (explicit resource management: the `using` declaration and
// the SuppressedError global). On Node 22 both are absent.

class DatabaseConnection {
  [Symbol.dispose]() {
    // Disposal runs as the block unwinds, and here it fails too.
    throw new Error('Failed to close connection');
  }
}

function run() {
  // `using` schedules disposal at scope exit. The body throws first; then
  // disposal throws while that original error is still propagating, and the
  // runtime combines them into a SuppressedError.
  using connection = new DatabaseConnection();
  void connection;
  throw new Error('Things went badly');
}

try {
  run();
} catch (err) {
  console.log(err instanceof SuppressedError);         // true
  console.log('error:', err.error.message);            // Failed to close connection (suppressing)
  console.log('suppressed:', err.suppressed.message);  // Things went badly (original)
}

// Manual construction shows the argument order directly: (suppressing, suppressed, message).
const manual = new SuppressedError(
  new Error('rollback failed'), // the newer error that wins
  new Error('update failed'),   // the original it suppressed
  'transaction aborted'
);
console.log(manual.message, '|', manual.error.message, '|', manual.suppressed.message);
