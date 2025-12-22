// Chapter 4: Primitives - The Coercion Algorithm
// See: "Type coercion" and "ToPrimitive"
//
// JavaScript's type coercion follows specific algorithms defined in the spec.
// Understanding ToPrimitive, ToNumber, and ToString explains most "weird" behavior.
//
// Run with: node ch04_coercion_algorithm.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- ToPrimitive Algorithm ---\n');

// When an object needs to become a primitive, ToPrimitive is called
// with a "hint": 'number', 'string', or 'default'

// The hint determines which methods are tried first:
//   'number'  -> valueOf(), then toString()
//   'string'  -> toString(), then valueOf()
//   'default' -> valueOf(), then toString() (usually)

const obj = {
  valueOf() {
    console.log('  valueOf() called');
    return 42;
  },
  toString() {
    console.log('  toString() called');
    return 'forty-two';
  }
};

console.log('Numeric context (+obj):');
log('Result', +obj);  // Prefers valueOf()

console.log('\nString context (String(obj)):');
log('Result', String(obj));  // Prefers toString()

console.log('\nDefault context (obj + ""):');
log('Result', obj + '');  // Prefers valueOf(), then converts to string

console.log('\n--- The + Operator\'s Rules ---\n');

// + is unique: it uses 'default' hint, then decides based on result types

// If either operand is a string after ToPrimitive, string concatenation
// Otherwise, numeric addition

log('1 + 2', 1 + 2);           // Both numbers -> 3
log('"1" + 2', '1' + 2);       // String + number -> "12"
log('1 + "2"', 1 + '2');       // Number + string -> "12"
log('1 + 2 + "3"', 1 + 2 + '3');  // (1+2)+"3" -> "33"
log('"1" + 2 + 3', '1' + 2 + 3);  // ("1"+2)+3 -> "123"

console.log('\n--- ToNumber Algorithm ---\n');

// ToNumber converts values to numbers

const toNumberCases = [
  undefined,     // NaN
  null,          // 0
  true,          // 1
  false,         // 0
  '',            // 0
  '   ',         // 0 (whitespace is 0)
  '42',          // 42
  '42px',        // NaN (not fully numeric)
  '0x10',        // 16 (hex)
  [],            // 0 ([] -> '' -> 0)
  [1],           // 1 ([1] -> '1' -> 1)
  [1, 2],        // NaN ([1,2] -> '1,2' -> NaN)
  {},            // NaN ({} -> '[object Object]' -> NaN)
];

console.log('Number() conversions:');
for (const val of toNumberCases) {
  const str = JSON.stringify(val) ?? String(val);
  log(`  Number(${str.padEnd(20)})`, Number(val));
}

console.log('\n--- ToString Algorithm ---\n');

// ToString converts values to strings

const toStringCases = [
  undefined,   // 'undefined'
  null,        // 'null'
  true,        // 'true'
  false,       // 'false'
  0,           // '0'
  -0,          // '0' (sign is lost!)
  NaN,         // 'NaN'
  Infinity,    // 'Infinity'
  [],          // ''
  [1, 2, 3],   // '1,2,3'
  {},          // '[object Object]'
];

console.log('String() conversions:');
for (const val of toStringCases) {
  log(`  String(${JSON.stringify(val)?.padEnd(15) ?? String(val).padEnd(15)})`, String(val));
}

console.log('\n--- Comparison Coercion ---\n');

// == performs type coercion, === does not

console.log('Abstract equality (==) coercion:');
log('null == undefined', null == undefined);  // true (special case)
log('1 == "1"', 1 == '1');                    // true (string -> number)
log('true == 1', true == 1);                  // true (bool -> number)
log('"" == false', '' == false);              // true (both -> 0)
log('"0" == false', '0' == false);            // true (both -> 0)
log('"" == "0"', '' == '0');                  // false (both strings, not equal)

console.log('\n--- Object Comparison Gotcha ---\n');

// Objects are converted to primitives for comparison
log('[] == 0', [] == 0);        // true: [] -> '' -> 0
log('[] == false', [] == false);// true: [] -> '' -> 0; false -> 0
log('[] == ""', [] == '');      // true: [] -> ''
log('[] == ![]', [] == ![]);    // true! ![] is false, [] -> '' -> 0

console.log('\n--- Custom Coercion Hooks ---\n');

// Symbol.toPrimitive overrides valueOf and toString
const smart = {
  [Symbol.toPrimitive](hint) {
    console.log(`  toPrimitive called with hint: ${hint}`);
    if (hint === 'number') return 100;
    if (hint === 'string') return 'hundred';
    return 100;  // default
  }
};

console.log('With Symbol.toPrimitive:');
log('+smart', +smart);
log('String(smart)', String(smart));
log('smart + ""', smart + '');

console.log('\n--- The Coercion Decision Tree ---\n');

console.log('For binary + operator:');
console.log('  1. Convert both operands to primitives (hint: "default")');
console.log('  2. If either primitive is a string, convert both to strings');
console.log('  3. Otherwise, convert both to numbers and add');
console.log('');
console.log('For comparison operators (<, >, <=, >=):');
console.log('  1. Convert to primitives (hint: "number")');
console.log('  2. If both are strings, compare lexicographically');
console.log('  3. Otherwise, convert both to numbers and compare');
