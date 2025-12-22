// Chapter 3: Numbers - Special Values
// See: "Special numeric values" and "IEEE 754 edge cases"
//
// JavaScript has several special numeric values with counterintuitive
// behaviors: negative zero, NaN, and Infinity. Understanding these
// is essential for robust numeric code.
//
// Run with: node ch03_special_values.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Negative Zero ---\n');

// JavaScript has both positive and negative zero
const posZero = 0;
const negZero = -0;

log('0 === -0', posZero === negZero);  // true - they're "equal"
log('Object.is(0, -0)', Object.is(posZero, negZero));  // false - but not identical

// How to detect negative zero
function isNegativeZero(n) {
  return n === 0 && 1 / n === -Infinity;
}

log('isNegativeZero(0)', isNegativeZero(0));
log('isNegativeZero(-0)', isNegativeZero(-0));

// Where negative zero comes from
console.log('\n-0 sources:');
log('  -1 * 0', -1 * 0);
log('  0 / -1', 0 / -1);
log('  Math.round(-0.1)', Math.round(-0.1));
log('  -Math.abs(0)', -Math.abs(0));

// But subtraction doesn't produce -0
log('  0 - 0', Object.is(0 - 0, -0) ? '-0' : '0');

console.log('\n--- Stringification Hides -0 ---\n');

// String conversion hides negative zero
log('String(-0)', String(-0));
log('(-0).toString()', (-0).toString());
log('JSON.stringify(-0)', JSON.stringify(-0));
log('"" + (-0)', '' + (-0));

// But Object.is and 1/x reveal it
log('Object.is(JSON.parse("-0"), -0)', Object.is(JSON.parse('0'), -0));

// Array preserves it internally but stringifies to "0"
const arr = [-0];
log('[−0].toString()', arr.toString());
log('Object.is(arr[0], -0)', Object.is(arr[0], -0));

console.log('\n--- NaN: Not a Number ---\n');

// NaN is the only value not equal to itself
const nan = NaN;
log('NaN === NaN', nan === nan);  // false!
log('Object.is(NaN, NaN)', Object.is(nan, nan));  // true

// Detecting NaN
log('Number.isNaN(NaN)', Number.isNaN(NaN));
log('Number.isNaN("NaN")', Number.isNaN('NaN'));  // false - string, not NaN

// Global isNaN coerces first (confusing legacy behavior)
log('isNaN("hello")', isNaN('hello'));  // true - because Number("hello") is NaN
log('Number.isNaN("hello")', Number.isNaN('hello'));  // false - not actually NaN

console.log('\n--- NaN Sources ---\n');

log('0 / 0', 0 / 0);
log('Infinity - Infinity', Infinity - Infinity);
log('Infinity / Infinity', Infinity / Infinity);
log('Math.sqrt(-1)', Math.sqrt(-1));
log('Math.log(-1)', Math.log(-1));
log('parseInt("hello")', parseInt('hello'));
log('Number(undefined)', Number(undefined));

// NaN propagates through calculations
log('\nNaN + 5', NaN + 5);
log('NaN * 0', NaN * 0);
log('Math.max(1, NaN, 3)', Math.max(1, NaN, 3));

console.log('\n--- Infinity ---\n');

log('Number.POSITIVE_INFINITY', Number.POSITIVE_INFINITY);
log('Number.NEGATIVE_INFINITY', Number.NEGATIVE_INFINITY);
log('Infinity === Number.POSITIVE_INFINITY', Infinity === Number.POSITIVE_INFINITY);

// Infinity from overflow and division
log('\n1 / 0', 1 / 0);
log('-1 / 0', -1 / 0);
log('1e308 * 10', 1e308 * 10);  // Overflow to Infinity

// Infinity arithmetic
log('\nInfinity + 1', Infinity + 1);
log('Infinity + Infinity', Infinity + Infinity);
log('Infinity * -1', Infinity * -1);
log('Infinity * 0', Infinity * 0);  // NaN
log('1 / Infinity', 1 / Infinity);  // 0

console.log('\n--- Comparing Special Values ---\n');

// Sorting with special values
const values = [5, -0, 0, NaN, Infinity, -Infinity, 3];
log('Original', values);
log('Sorted', [...values].sort((a, b) => a - b));

// NaN breaks sorting because comparisons with NaN return false
log('\nNaN < 5', NaN < 5);
log('NaN > 5', NaN > 5);
log('NaN >= NaN', NaN >= NaN);

console.log('\n--- Object.is vs === ---\n');

// Object.is is like === but handles edge cases differently
const cases = [
  [0, -0],
  [NaN, NaN],
  [null, null],
  [undefined, undefined],
  [Infinity, Infinity],
];

console.log('Value A      Value B      ===    Object.is');
console.log('─'.repeat(48));
for (const [a, b] of cases) {
  const strA = Object.is(a, -0) ? '-0' : String(a);
  const strB = Object.is(b, -0) ? '-0' : String(b);
  console.log(
    `${strA.padEnd(12)} ${strB.padEnd(12)} ${String(a === b).padEnd(6)} ${Object.is(a, b)}`
  );
}

console.log('\n--- Type Checking Special Values ---\n');

log('typeof NaN', typeof NaN);  // "number"
log('typeof Infinity', typeof Infinity);  // "number"
log('Number.isFinite(Infinity)', Number.isFinite(Infinity));
log('Number.isFinite(NaN)', Number.isFinite(NaN));
log('Number.isFinite(42)', Number.isFinite(42));

// isFinite coerces, Number.isFinite doesn't
log('\nisFinite("42")', isFinite('42'));  // true - coerced
log('Number.isFinite("42")', Number.isFinite('42'));  // false - not a number

console.log('\n--- Practical Implications ---\n');

console.log('When working with special values:');
console.log('  - Use Object.is() to distinguish 0 from -0');
console.log('  - Use Number.isNaN() not isNaN() for NaN checks');
console.log('  - Use Number.isFinite() for safe numeric validation');
console.log('  - NaN in arrays/objects can cause subtle bugs');
console.log('  - JSON cannot represent NaN, Infinity, or -0 faithfully');

// JSON limitations
console.log('\nJSON limitations:');
log('  JSON.stringify(NaN)', JSON.stringify(NaN));
log('  JSON.stringify(Infinity)', JSON.stringify(Infinity));
log('  JSON.stringify(-0)', JSON.stringify(-0));
