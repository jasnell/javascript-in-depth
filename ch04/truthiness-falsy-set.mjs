// Prints the truthiness of assorted values so the complete falsy set is visible; note '0' is TRUTHY.

// The complete falsy set: everything else in JavaScript is truthy.
const falsy = [false, 0, -0, 0n, -0n, NaN, '', null, undefined];

// Values that trip people up: these all look empty or zero-ish but are TRUTHY.
const surprisinglyTruthy = ['0', 'false', [], {}, ' '];

const label = (v) => (typeof v === 'string' ? JSON.stringify(v) : String(v));

console.log('--- falsy values (all print false) ---');
for (const v of falsy) console.log(`${label(v)} -> ${Boolean(v)}`);

console.log('--- surprisingly truthy (all print true) ---');
for (const v of surprisinglyTruthy) console.log(`${label(v)} -> ${Boolean(v)}`);

// The classic bug: the string '0' is truthy, so !'0' is false.
// A discount code of '0' must NOT be treated as "no discount".
console.log(`Boolean('0') === ${Boolean('0')}`);  // true
console.log(`Boolean(0)   === ${Boolean(0)}`);    // false
