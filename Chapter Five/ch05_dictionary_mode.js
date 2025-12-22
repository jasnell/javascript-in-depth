// Chapter 5: Objects - Dictionary Mode
// See: "Hidden classes" and "Property storage"
//
// V8 normally uses fast "in-object" properties with hidden class optimization.
// But certain patterns force objects into slow "dictionary mode" where properties
// are stored in a hash table. This is much slower for property access.
//
// Run with: node --allow-natives-syntax ch05_dictionary_mode.js
//
// =============================================================================
// READING V8's %DebugPrint OUTPUT FOR PROPERTY STORAGE:
// =============================================================================
//
// Look at the "properties:" line in the output:
//
// FAST MODE (optimized):
//   - properties: 0x... <FixedArray[0]> {...}
//     Properties stored directly in the object ("in-object properties")
//   - The object has a proper hidden class/map for inline caching
//
// DICTIONARY MODE (slow):
//   - properties: 0x... <NameDictionary[N]>
//     Properties stored in a hash table
//   - Property access requires hash lookup instead of direct offset
//
// Also look at the "elements:" line for array-indexed properties:
//   - <FixedArray[N]> or <FixedDoubleArray[N]> = fast elements
//   - <NumberDictionary[N]> = dictionary elements (sparse array)
//
// Triggers for dictionary mode:
//   - Too many properties (typically > ~20-30 named properties)
//   - Using delete on properties
//   - Non-standard property attributes (defineProperty)
//   - Highly dynamic property names
// =============================================================================

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Fast Mode vs Dictionary Mode ---\n');

// Fast mode: properties stored in fixed slots, hidden class optimized
const fast = { a: 1, b: 2, c: 3 };
console.log('Fast mode object:');
%DebugPrint(fast);

console.log('\n--- Triggering Dictionary Mode ---\n');

// 1. Too many properties
console.log('Adding many properties:');
const manyProps = {};
for (let i = 0; i < 100; i++) {
  manyProps['prop' + i] = i;
}
console.log('Object with 100 properties:');
%DebugPrint(manyProps);

// 2. Deleting properties
console.log('\nDeleting properties triggers dictionary mode:');
const deleteTest = { a: 1, b: 2, c: 3 };
console.log('Before delete:');
%DebugPrint(deleteTest);
delete deleteTest.b;
console.log('\nAfter delete:');
%DebugPrint(deleteTest);

// 3. Adding properties with non-standard attributes
console.log('\nNon-standard property attributes:');
const descriptorTest = { a: 1 };
Object.defineProperty(descriptorTest, 'b', {
  value: 2,
  writable: false  // Non-default attribute
});
console.log('After defineProperty with writable:false:');
%DebugPrint(descriptorTest);

console.log('\n--- Dynamic Property Names ---\n');

// Computed property names can cause issues
const computed = {};
const keys = ['x', 'y', 'z'];

// This is fine - V8 can predict the pattern
for (const key of keys) {
  computed[key] = 1;
}
console.log('Predictable computed keys:');
%DebugPrint(computed);

// But truly dynamic keys force dictionary mode faster
const dynamic = {};
for (let i = 0; i < 50; i++) {
  dynamic[`key_${Math.random().toString(36).slice(2)}`] = i;
}
console.log('\nRandom keys:');
%DebugPrint(dynamic);

console.log('\n--- Performance Impact ---\n');

function accessProps(obj) {
  let sum = 0;
  for (let i = 0; i < 1000; i++) {
    sum += obj.a + obj.b + obj.c;
  }
  return sum;
}

const fastObj = { a: 1, b: 2, c: 3 };
const slowObj = { a: 1, b: 2, c: 3 };
delete slowObj.b;  // Force dictionary mode
slowObj.b = 2;     // Add it back

// Warm up
accessProps(fastObj);
accessProps(slowObj);

const iterations = 100000;

const fastTest = { a: 1, b: 2, c: 3 };
const start1 = performance.now();
for (let i = 0; i < iterations; i++) {
  fastTest.a + fastTest.b + fastTest.c;
}
const time1 = performance.now() - start1;

const slowTest = { a: 1, b: 2, c: 3 };
delete slowTest.b;
slowTest.b = 2;
const start2 = performance.now();
for (let i = 0; i < iterations; i++) {
  slowTest.a + slowTest.b + slowTest.c;
}
const time2 = performance.now() - start2;

log('Fast mode access', `${time1.toFixed(3)}ms`);
log('Dictionary mode access', `${time2.toFixed(3)}ms`);

console.log('\n--- Array-Indexed Properties ---\n');

// Numeric keys use a separate fast elements backing store
const withNumbers = {};
withNumbers[0] = 'a';
withNumbers[1] = 'b';
withNumbers.name = 'test';

console.log('Object with numeric and string keys:');
%DebugPrint(withNumbers);

// Sparse arrays trigger dictionary elements
const sparse = [];
sparse[0] = 'first';
sparse[1000000] = 'last';  // Creates huge gap

console.log('\nSparse array (dictionary elements):');
%DebugPrint(sparse);

console.log('\n--- Avoiding Dictionary Mode ---\n');

console.log('Best practices:');
console.log('  1. Avoid delete - set to undefined instead');
console.log('  2. Define all properties in constructor');
console.log('  3. Use Map for dynamic key-value storage');
console.log('  4. Keep property count reasonable');
console.log('  5. Avoid Object.defineProperty when possible');
