// Chapter 2: Strings - String Interning
// See: "V8's string representations" and "String comparison"
//
// V8 interns certain strings, meaning identical string values may share
// the same memory location. This affects identity comparisons and memory usage.
// Property names and small literal strings are typically interned.
//
// Run with: node --allow-natives-syntax ch02_string_interning.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- String Interning Basics ---\n');

// String literals with the same value are often interned
const a = 'hello';
const b = 'hello';

log('a === b (same literal)', a === b);  // true - value equality

// But are they the SAME object in memory? We can check with %DebugPrint
console.log('\nString a:');
%DebugPrint(a);
console.log('\nString b:');
%DebugPrint(b);
console.log('(Check if addresses match - they should for interned strings)');

console.log('\n--- Dynamically Created Strings ---\n');

// Dynamically created strings may not be interned initially
const dynamic = ['hel', 'lo'].join('');
log('dynamic value', dynamic);
log('a === dynamic', a === dynamic);  // true - value equality works

console.log('\nDynamic string (possibly different address):');
%DebugPrint(dynamic);

console.log('\n--- Property Access and Interning ---\n');

// Property names trigger interning because V8 uses them for hidden class lookups
const obj = {};
const propName = 'my' + 'Prop';  // dynamically created

obj[propName] = 42;
log('obj.myProp', obj.myProp);

// After being used as a property key, the string gets internalized
console.log('\nAfter property access, propName is internalized:');
%DebugPrint(propName);

console.log('\n--- Internalized String Lookup ---\n');

// V8 maintains a string table for internalized strings
// This makes property lookups fast - just compare pointers

const obj2 = { firstName: 'Alice', lastName: 'Smith' };

// First access interns 'firstName'
console.log('First access:', obj2.firstName);

// Subsequent accesses use the interned string for fast lookup
console.log('Second access:', obj2.firstName);

console.log('\n--- Number Strings ---\n');

// Small integer strings are pre-interned
const numStr1 = '42';
const numStr2 = String(42);

log('numStr1 === numStr2', numStr1 === numStr2);

console.log('\nNumber as string literal:');
%DebugPrint(numStr1);
console.log('\nNumber converted to string:');
%DebugPrint(numStr2);

console.log('\n--- Large Strings Are Not Interned ---\n');

// Large strings are not interned - too expensive to check
const large1 = 'x'.repeat(1000);
const large2 = 'x'.repeat(1000);

log('large1 === large2', large1 === large2);  // true, but full comparison

console.log('\nLarge strings have different addresses:');
console.log('Large1:');
%DebugPrint(large1);
console.log('\nLarge2:');
%DebugPrint(large2);

console.log('\n--- Practical Implications ---\n');

console.log('1. Property names are fast because they\'re interned');
console.log('2. Identical small strings may share memory');
console.log('3. Large string comparisons check character-by-character');
console.log('4. Using strings as Map keys benefits from interning');
