// Chapter 4: Primitives - Falsy Values and Truthy Gotchas
// See: "Booleans and truthiness/falsiness" and "The 8 falsy values"
//
// JavaScript has exactly eight falsy values. Everything else is truthy,
// including some values that surprise developers coming from other languages.

console.log('--- The 8 Falsy Values ---\n');

// These are the ONLY values that evaluate to false in a boolean context
const falsyValues = [
  undefined,
  null,
  false,
  0,
  -0,
  0n,        // BigInt zero
  NaN,
  '',        // Empty string
];

for (const val of falsyValues) {
  console.log(`  ${String(val).padEnd(12)} is falsy:`, !val);
}

console.log('\n--- Surprising Truthy Values ---\n');

// Everything else is truthy, which catches many developers off guard
const truthySurprises = [
  '0',       // String containing zero
  'false',   // String containing "false"
  [],        // Empty array
  {},        // Empty object
  function() {}, // Empty function
];

for (const val of truthySurprises) {
  console.log(`  ${String(val).padEnd(15)} is truthy:`, !!val);
}

console.log('\n--- The Discount Code Bug ---\n');

// A common mistake: using truthiness to check for "missing" values
function applyDiscountBroken(code) {
  if (!code) {
    return 'No discount';
  }
  return `Discount: ${code}`;
}

console.log("applyDiscountBroken('SAVE10'):", applyDiscountBroken('SAVE10'));
console.log("applyDiscountBroken(''):", applyDiscountBroken(''));      // Bug if '' is valid
console.log("applyDiscountBroken(0):", applyDiscountBroken(0));        // Bug if 0 is valid
console.log("applyDiscountBroken('0'):", applyDiscountBroken('0'));    // Works (string is truthy)

// Better: check specifically for null/undefined
function applyDiscountFixed(code) {
  if (code == null) {  // Catches both null and undefined
    return 'No discount';
  }
  return `Discount: ${code}`;
}

console.log("\napplyDiscountFixed('SAVE10'):", applyDiscountFixed('SAVE10'));
console.log("applyDiscountFixed(''):", applyDiscountFixed(''));        // Now works
console.log("applyDiscountFixed(0):", applyDiscountFixed(0));          // Now works
console.log("applyDiscountFixed(null):", applyDiscountFixed(null));    // No discount

console.log('\n--- The Empty Array Paradox ---\n');

// Arrays are always truthy in boolean context...
if ([]) {
  console.log('[] is truthy in conditions');
}

// ...but [] == false is true due to type coercion
console.log('[] == false:', [] == false);  // true!

// The coercion chain:
// 1. false becomes 0
// 2. [] becomes '' (empty string via Array.toString)
// 3. '' becomes 0
// 4. 0 == 0 is true

// This is why strict equality (===) is preferred. It avoids these
// surprising conversion chains entirely.
