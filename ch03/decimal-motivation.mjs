// The proposed Decimal type (base-10) is not yet in Node; this shows the problem it solves.

// Binary64 tax math drifts off the exact decimal answer.
const subtotal = 19.99;
const tax = subtotal * 0.0825; // 8.25%
console.log(tax); // 1.6491749999999998 (exact decimal value is 1.649175)

// The proposed literal syntax is not runnable today:
//   const price = 19.99m;
//   const tax = price * 0.0825m;   // 1.649175m (exact)
//   0.1m + 0.2m === 0.3m;          // true

// A practical workaround now: scale to integer cents, do integer math, then rescale.
const cents = 1999; // 19.99 as an exact integer
const taxCents = Math.round((cents * 825) / 10000); // 8.25% in basis points
console.log(taxCents / 100); // 1.65, no binary drift in the integer step
