// Demonstrates IEEE 754 double-precision rounding: 0.1 + 0.2 is not exactly 0.3.
// run: node number-precision.mjs

console.log(0.1 + 0.2);              // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);     // false
