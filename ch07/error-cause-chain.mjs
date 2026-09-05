// Wrapping errors with { cause } and walking the resulting chain.

const thirdParty = {
  authorizePayment() {
    // Internal failure with sensitive detail we must not leak upward.
    throw new Error('gateway rejected token sk_live_abc123');
  },
};

function processPayment(...args) {
  try {
    return thirdParty.authorizePayment(...args);
  } catch (paymentError) {
    // Clean public message, full context preserved via cause.
    throw new Error('Failed to authorize payment', { cause: paymentError });
  }
}

try {
  processPayment('order-42');
} catch (err) {
  // Walk from the boundary error down through each underlying cause.
  let current = err;
  let depth = 0;
  while (current) {
    console.log(`${'  '.repeat(depth)}${current.message}`);
    current = current.cause; // undefined ends the chain
    depth++;
  }
}
