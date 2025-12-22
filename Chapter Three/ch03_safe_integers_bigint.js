// Chapter 3: Numbers - Safe Integers and BigInt
// See: "Maximum safe integer (2^53 - 1)" and "BigInt for arbitrary precision integers"
//
// JavaScript's Number type uses 53 bits for the significand, which means
// integers beyond ±2^53-1 cannot be represented exactly. BigInt provides
// arbitrary precision for cases where exact large integers matter.

console.log('--- Maximum Safe Integer ---\n');

// The largest integer that can be represented exactly
console.log('Number.MAX_SAFE_INTEGER:', Number.MAX_SAFE_INTEGER);
// 9007199254740991 = 2^53 - 1

console.log('\n--- Precision Loss Beyond Safe Integer ---\n');

// Once you exceed MAX_SAFE_INTEGER, not every consecutive integer exists
console.log('9007199254740992:', 9007199254740992);  // 2^53, still OK
console.log('9007199254740993:', 9007199254740993);  // 2^53 + 1, corrupted!
console.log('9007199254740994:', 9007199254740994);  // 2^53 + 2, OK

// The number 9007199254740993 literally cannot exist as a Number
console.log('\n9007199254740993 === 9007199254740992?',
  9007199254740993 === 9007199254740992);  // true!

console.log('\n--- BigInt Solves This ---\n');

// BigInt maintains exact precision for any integer size
const unsafeNumber = 9007199254740993;
const safeBigInt = 9007199254740993n;  // The 'n' suffix creates a BigInt

console.log('As Number:', unsafeNumber);   // 9007199254740992 (corrupted)
console.log('As BigInt:', safeBigInt);     // 9007199254740993n (exact)

// BigInt can handle arbitrarily large values
const googol = 10n ** 100n;  // 10 to the power of 100
console.log('A googol:', googol);

console.log('\n--- BigInt and Number Don\'t Mix ---\n');

// You cannot use BigInt and Number together in arithmetic
try {
  const mixed = 10n + 5;  // TypeError
} catch (e) {
  console.log('10n + 5 throws:', e.message);
}

// Explicit conversion is required
console.log('10n + BigInt(5) =', 10n + BigInt(5));  // 15n
console.log('Number(10n) + 5 =', Number(10n) + 5);  // 15

// Comparisons work without conversion (but strict equality checks types)
console.log('10n > 5:', 10n > 5);     // true
console.log('10n === 10:', 10n === 10); // false (different types)
console.log('10n == 10:', 10n == 10);   // true (loose equality coerces)

console.log('\n--- Checking Integer Range ---\n');

// For interfacing with systems that expect fixed-width integers
function toInt64Safe(bigint) {
  const MIN = -(2n ** 63n);
  const MAX = 2n ** 63n - 1n;
  if (bigint < MIN || bigint > MAX) {
    throw new RangeError(`Value ${bigint} exceeds int64 range`);
  }
  return bigint;
}

console.log('toInt64Safe(1000n):', toInt64Safe(1000n));
try {
  toInt64Safe(2n ** 64n);
} catch (e) {
  console.log('toInt64Safe(2n ** 64n) throws:', e.message);
}

// Use Number for values within ±2^53-1 when performance matters.
// Use BigInt when correctness matters more than speed, or when
// values exceed the safe integer range.
