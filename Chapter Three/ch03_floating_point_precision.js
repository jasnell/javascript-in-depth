// Chapter 3: Numbers - Floating-Point Precision
// See: "Why 0.1 + 0.2 !== 0.3" and "Number.EPSILON for safe floating-point comparisons"
//
// JavaScript uses IEEE 754 Binary64 format for all numbers. Decimal fractions
// like 0.1 cannot be exactly represented in binary, leading to small errors
// that accumulate in calculations.

console.log('--- The Classic Floating-Point Surprise ---\n');

console.log('0.1 + 0.2 =', 0.1 + 0.2);           // 0.30000000000000004
console.log('0.3 =', 0.3);                        // 0.3
console.log('0.1 + 0.2 === 0.3:', 0.1 + 0.2 === 0.3);  // false

// This happens because 0.1 and 0.2 cannot be exactly represented in binary.
// They become infinite repeating fractions, similar to how 1/3 = 0.333...
// in decimal.

console.log('\n--- Number.EPSILON for Safe Comparisons ---\n');

// Number.EPSILON is the smallest difference between two representable numbers
// Value: 2^-52 ≈ 2.220446049250313e-16
console.log('Number.EPSILON =', Number.EPSILON);

// Simple approach: check if the difference is smaller than EPSILON
function almostEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

console.log('almostEqual(0.1 + 0.2, 0.3):', almostEqual(0.1 + 0.2, 0.3));  // true

// But this breaks for larger numbers where the absolute error grows
console.log('almostEqual(1000.1 + 1000.2, 2000.3):',
  almostEqual(1000.1 + 1000.2, 2000.3));  // false

console.log('\n--- Scaled EPSILON for Larger Numbers ---\n');

// Better approach: scale EPSILON based on the magnitude of the numbers.
// This is the "equalish" function from the chapter.
function equalish(a, b) {
  const diff = Math.abs(a - b);
  const epsilon = Number.EPSILON * Math.max(Math.abs(a), Math.abs(b));
  return diff <= epsilon;
}

console.log('equalish(0.1 + 0.2, 0.3):', equalish(0.1 + 0.2, 0.3));  // true
console.log('equalish(1000.1 + 1000.2, 2000.3):',
  equalish(1000.1 + 1000.2, 2000.3));  // true

console.log('\n--- Financial Calculation Example ---\n');

// Invoice calculation showing precision issues
const subtotal = 19.99;
const taxRate = 0.0825;  // 8.25% tax
const tax = subtotal * taxRate;

console.log('Subtotal: $' + subtotal);
console.log('Tax (8.25%): $' + tax);  // 1.6491749999999998
console.log('Rounded for display: $' + tax.toFixed(2));

// For financial calculations, consider working in integer cents to avoid
// these issues entirely, or use a decimal library when precision matters.
