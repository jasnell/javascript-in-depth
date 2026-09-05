// Keeping a running total as an SMI (integer cents) is faster than accumulating floats.

// Slow: total starts as an SMI but becomes a HeapNumber on the first decimal add.
function calculateTotalSlow(prices) {
  let total = 0; // starts as SMI
  for (let i = 0; i < prices.length; i++) {
    const withTax = prices[i] * 1.0825; // forces HeapNumber
    total += withTax; // total is now a HeapNumber
  }
  return total;
}

// Fast: work in integer cents so total stays an SMI, converting to a decimal only at the end.
function calculateTotalFast(pricesInCents) {
  let total = 0; // SMI
  for (let i = 0; i < pricesInCents.length; i++) {
    const withTax = Math.round((pricesInCents[i] * 10825) / 10000);
    total += withTax; // remains SMI while the sum stays in range
  }
  return total / 100; // converts to a HeapNumber only here
}

const prices = Array(1_000_000).fill(19.99);
const pricesInCents = Array(1_000_000).fill(1999);

console.time('HeapNumber');
console.log(calculateTotalSlow(prices));
console.timeEnd('HeapNumber');

console.time('SMI');
console.log(calculateTotalFast(pricesInCents));
console.timeEnd('SMI');
// The fast variant is often at least twice as quick, but timings vary by machine.
