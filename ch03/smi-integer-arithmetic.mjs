// The | 0 bitwise trick truncates to a 32-bit integer, keeping values on V8's SMI path.

// Fast: multiply first, then | 0 coerces the quotient to an integer in the SMI range.
function calculatePercentFast(value, total) {
  return ((value * 100) / total) | 0; // integer result, no fractional HeapNumber
}

// Slow: dividing first and scaling by a float keeps the value as a HeapNumber throughout.
function calculatePercentSlow(value, total) {
  return (value / total) * 100.0;
}

console.log(calculatePercentFast(37, 200)); // 18 (truncated)
console.log(calculatePercentSlow(37, 200)); // 18.5

// | 0 only works within 32-bit range; larger values wrap around, so use it deliberately.
console.log((2147483647 + 1) | 0); // -2147483648, wrapped
