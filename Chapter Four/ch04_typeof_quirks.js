// Chapter 4: Primitives - typeof Quirks
// See: "The typeof operator" and "Type checking"
//
// typeof is JavaScript's primary type-checking operator, but it has several
// well-known quirks rooted in the language's history. This shows how to
// work around them.
//
// Run with: node ch04_typeof_quirks.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- The typeof Results ---\n');

// typeof returns one of these 8 strings:
const cases = [
  undefined,
  true,
  42,
  42n,
  'hello',
  Symbol('test'),
  function() {},
  {},
];

for (const val of cases) {
  const display = typeof val === 'bigint' ? `${val}n` :
                  typeof val === 'symbol' ? 'Symbol("test")' :
                  typeof val === 'function' ? 'function() {}' :
                  JSON.stringify(val);
  log(`typeof ${display}`, typeof val);
}

console.log('\n--- The Famous null Bug ---\n');

// typeof null === 'object' is a bug from JavaScript's first implementation
log('typeof null', typeof null);  // 'object', not 'null'

// This is because in the original implementation, values were tagged:
// - Objects had a 0 type tag
// - null was the NULL pointer (0x00)
// - The typeof check only looked at the type tag

// How to properly check for null:
function isNull(value) {
  return value === null;
}

log('null === null', null === null);  // true
log('isNull(null)', isNull(null));

console.log('\n--- Arrays Are Objects ---\n');

// typeof doesn't distinguish arrays from objects
log('typeof []', typeof []);          // 'object'
log('typeof {}', typeof {});          // 'object'
log('typeof new Date()', typeof new Date());  // 'object'

// How to properly check for arrays:
log('Array.isArray([])', Array.isArray([]));
log('Array.isArray({})', Array.isArray({}));

console.log('\n--- Functions Are Special ---\n');

// Functions are callable objects, but typeof gives them special treatment
log('typeof function(){}', typeof function(){});  // 'function'
log('typeof (() => {})', typeof (() => {}));      // 'function'
log('typeof class {}', typeof class {});          // 'function' (classes are functions)

// But functions are still objects:
const fn = function() {};
fn.myProp = 'value';
log('fn.myProp', fn.myProp);
log('fn instanceof Object', fn instanceof Object);

console.log('\n--- typeof and Undeclared Variables ---\n');

// typeof doesn't throw for undeclared variables (one of its useful quirks)
log('typeof undeclaredVar', typeof undeclaredVar);  // 'undefined', no error

// This is useful for feature detection:
if (typeof SomeFeature !== 'undefined') {
  // Safe to use SomeFeature
}

// But be careful: this also works for declared-but-undefined:
let declaredButUndefined;
log('typeof declaredButUndefined', typeof declaredButUndefined);  // 'undefined'

console.log('\n--- Wrapper Objects vs Primitives ---\n');

// typeof differs for primitives and their wrapper objects
log('typeof "hello"', typeof 'hello');              // 'string'
log('typeof new String("hello")', typeof new String('hello'));  // 'object'

log('typeof 42', typeof 42);                        // 'number'
log('typeof new Number(42)', typeof new Number(42));  // 'object'

console.log('\n--- Comprehensive Type Checking ---\n');

// A robust type checker that handles all edge cases
function getType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  const type = typeof value;
  if (type !== 'object') return type;

  // For objects, use Object.prototype.toString for specificity
  const tag = Object.prototype.toString.call(value);
  return tag.slice(8, -1).toLowerCase();  // Extract "Array" from "[object Array]"
}

const testValues = [
  null, undefined, true, 42, 'str', Symbol(), () => {},
  [], {}, new Date(), /regex/, new Map(), new Set(),
  new Error(), Promise.resolve()
];

console.log('getType() results:');
for (const val of testValues) {
  const display = val === null ? 'null' :
                  val === undefined ? 'undefined' :
                  val.toString?.().slice(0, 20) || String(val);
  log(`  ${display}`, getType(val));
}

console.log('\n--- typeof in Strict Mode ---\n');

// Note: typeof behavior is the same in strict and non-strict mode
// The undeclared variable exception still applies

'use strict';
log('typeof stillUndeclared', typeof stillUndeclared);  // 'undefined'

console.log('\n--- Summary of Quirks ---\n');

console.log('1. typeof null === "object" (historical bug)');
console.log('2. typeof [] === "object" (arrays are objects)');
console.log('3. typeof function === "function" (special case)');
console.log('4. typeof undeclared === "undefined" (no error thrown)');
console.log('5. typeof wrapperObject === "object" (not the primitive type)');
