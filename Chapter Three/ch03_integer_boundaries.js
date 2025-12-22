// Chapter 3: Numbers - Integer Optimization Boundaries
// See: "SMI optimization" and "Safe integers"
//
// V8 optimizes integers differently based on their range. Understanding these
// boundaries explains why certain integer operations are faster than others
// and when you should switch to BigInt.
//
// Run with: node --allow-natives-syntax ch03_integer_boundaries.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- JavaScript Integer Boundaries ---\n');

// Different boundaries matter for different reasons:

log('MAX_SAFE_INTEGER', Number.MAX_SAFE_INTEGER);
log('  (2^53 - 1)', 2**53 - 1);
log('MIN_SAFE_INTEGER', Number.MIN_SAFE_INTEGER);

log('\nV8 SMI range (32-bit systems):', '[-2^30, 2^30 - 1]');
log('  Approximately', [-(2**30), 2**30 - 1]);

log('\nV8 SMI range (64-bit systems):', '[-2^31, 2^31 - 1]');
log('  Approximately', [-(2**31), 2**31 - 1]);

console.log('\n--- SMI vs HeapNumber Boundary ---\n');

// SMI (Small Integer) is stored directly in the pointer
// HeapNumber is a heap-allocated object

const smiValue = 42;
const heapNumberValue = 2 ** 31;  // Just outside SMI range on 64-bit

console.log('SMI (fits in pointer):');
%DebugPrint(smiValue);

console.log('\nHeapNumber (heap allocated):');
%DebugPrint(heapNumberValue);

console.log('\n--- Safe Integer Boundary ---\n');

// Beyond 2^53 - 1, integers lose precision
const maxSafe = Number.MAX_SAFE_INTEGER;
const beyondSafe = maxSafe + 1;
const wayBeyond = maxSafe + 2;

log('MAX_SAFE_INTEGER', maxSafe);
log('MAX_SAFE_INTEGER + 1', beyondSafe);
log('MAX_SAFE_INTEGER + 2', wayBeyond);
log('Are they equal?', beyondSafe === wayBeyond);  // true! Lost precision

console.log('\n--- Checking Integer Safety ---\n');

function analyzeInteger(n) {
  const isSafe = Number.isSafeInteger(n);
  const isInteger = Number.isInteger(n);
  const is32Bit = n >= -(2**31) && n <= 2**31 - 1;

  return {
    value: n,
    isInteger,
    isSafeInteger: isSafe,
    fitsIn32Bit: is32Bit,
    recommendation: !isSafe ? 'Use BigInt' :
                    !is32Bit ? 'May use HeapNumber' :
                    'Optimal (SMI range)'
  };
}

const testValues = [
  42,
  2**30,
  2**31,
  2**32,
  2**53 - 1,
  2**53,
  2**53 + 1
];

console.log('Integer analysis:');
for (const v of testValues) {
  const analysis = analyzeInteger(v);
  log(`\n${v.toExponential(2)}`, '');
  log('  Safe integer', analysis.isSafeInteger);
  log('  Fits 32-bit', analysis.fitsIn32Bit);
  log('  Recommendation', analysis.recommendation);
}

console.log('\n--- Bitwise Operation Boundary ---\n');

// Bitwise operations convert to 32-bit signed integers
const large = 2 ** 32 + 5;
log('Original value', large);
log('After |0 (to int32)', large | 0);  // Truncated!

const negative = -1;
log('\n-1 as int32', negative);
log('-1 >>> 0 (to uint32)', negative >>> 0);  // Becomes MAX_UINT32

console.log('\n--- Array Index Boundary ---\n');

// Array indices must be uint32
const arr = [];
arr[0] = 'a';
arr[2**32 - 2] = 'last valid index';  // Max array index
// arr[2**32 - 1] = 'x';  // This would be a property, not an index!

log('Max array index', 2**32 - 2);
log('Array max length', 2**32 - 1);

console.log('\n--- Performance Across Boundaries ---\n');

function sumInRange(start, count) {
  let sum = 0;
  for (let i = 0; i < count; i++) {
    sum += start + i;
  }
  return sum;
}

const iterations = 1000000;

// All SMI range
const start1 = performance.now();
sumInRange(0, iterations);
const time1 = performance.now() - start1;

// Crosses into HeapNumber
const start2 = performance.now();
sumInRange(2**31 - iterations/2, iterations);
const time2 = performance.now() - start2;

log('Sum in SMI range', `${time1.toFixed(2)}ms`);
log('Sum crossing SMI boundary', `${time2.toFixed(2)}ms`);

console.log('\n--- When to Use BigInt ---\n');

console.log('Use BigInt when:');
console.log('  - Working with integers > 2^53');
console.log('  - Exact integer arithmetic is required');
console.log('  - Interfacing with 64-bit integer APIs');
console.log('');
console.log('Stick with Number when:');
console.log('  - Values stay within safe integer range');
console.log('  - You need to mix with floating-point math');
console.log('  - Performance is critical (BigInt is slower)');
