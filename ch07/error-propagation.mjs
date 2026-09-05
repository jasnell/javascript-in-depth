// Propagation: throw unwinds frames until the nearest catch; re-throw continues up.

function deep() {
  throw new Error('Deep error');
}

function middle() {
  try {
    deep();
  } catch (e) {
    console.log('caught in middle:', e.message);
    // Not re-thrown, so propagation stops here.
  }
}

function outer() {
  try {
    middle();
  } catch (e) {
    console.log('never reached: middle handled it');
  }
}

outer();

// Catching at a semantic boundary: re-wrap and re-throw to continue upward.
function query(fail) {
  if (fail) throw new Error('constraint violation');
}

function transactionBoundary() {
  try {
    query(false);
    query(true); // fails mid-unit-of-work
  } catch (e) {
    console.log('rollback at transaction boundary');
    // Wrap with context, then let it propagate to the next boundary up.
    throw new Error('Profile update failed', { cause: e });
  }
}

try {
  transactionBoundary();
} catch (e) {
  console.log(`${e.message} (cause: ${e.cause.message})`);
}
