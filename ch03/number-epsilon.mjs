// Number.EPSILON enables tolerant floating-point comparison instead of exact ===.

console.log(Number.EPSILON); // 2.220446049250313e-16 (2^-52)

// Fixed tolerance: fine for values near 1, but wrong for large magnitudes.
function almostEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
console.log(almostEqual(0.1 + 0.2, 0.3)); // true

// Scaled tolerance: epsilon grows with the size of the inputs.
function equalish(a, b) {
  const diff = Math.abs(a - b);
  const epsilon = Number.EPSILON * Math.max(Math.abs(a), Math.abs(b));
  return diff <= epsilon;
}
console.log(equalish(0.1 + 0.2, 0.3)); // true

// Why scaling matters: rounding error is relative, so it is larger for large numbers.
const big = 1e9;
console.log(almostEqual(big + 0.1 + 0.2, big + 0.3)); // false, gap exceeds fixed epsilon
console.log(equalish(big + 0.1 + 0.2, big + 0.3)); // true
