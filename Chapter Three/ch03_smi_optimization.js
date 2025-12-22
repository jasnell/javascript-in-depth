// Chapter 3: Numbers - V8's SMI (Small Integer) Optimization
// See: "V8's SMI (Small Integer) optimization" and the calculateTotalSlow/Fast examples
//
// Run with: node --allow-natives-syntax ch03_smi_optimization.js
//
// V8 stores small integers directly in the pointer itself, avoiding heap
// allocation entirely. This makes integer arithmetic significantly faster
// than floating-point operations that require HeapNumber objects.
//
// =============================================================================
// READING V8's %DebugPrint OUTPUT FOR NUMBERS:
// =============================================================================
//
// When you see output like:
//   DebugPrint: Smi: 0x2a (42)
//
// This means the number is stored as a "Small Integer" (Smi). The hex value
// (0x2a = 42) is stored directly in the pointer - no heap allocation needed.
//
// When you see output like:
//   DebugPrint: 0x12345678 <HeapNumber 3.14>
//
// This means the number required heap allocation. The hex address is where
// the HeapNumber object lives in memory. HeapNumbers are used for:
//   - Floating-point numbers (3.14, 0.5)
//   - Integers outside SMI range (> 2^31-1 or < -2^31)
//   - Special values like -0
//
// Smi = fast (no allocation), HeapNumber = slower (heap allocation required)
// =============================================================================

console.log('--- V8 Number Representation ---\n');

// V8 uses two internal representations:
// - SMI (Small Integer): stored directly in the pointer, no allocation
// - HeapNumber: allocated on the heap for floats and large integers

// SMI range on 64-bit systems: -2^31 to 2^31-1
const SMI_MAX = 2 ** 31 - 1;
console.log('SMI max value:', SMI_MAX);

console.log('\n--- Inspecting Number Representations ---\n');

// Small integer - stored as SMI, no heap allocation needed
const smi = 42;
console.log('Small integer (42):');
%DebugPrint(smi);

// Floating point - must use HeapNumber
const float = 3.14;
console.log('\nFloating point (3.14):');
%DebugPrint(float);

// Large integer beyond SMI range - also uses HeapNumber
const bigInt = 2 ** 32;
console.log('\nLarge integer (2^32):');
%DebugPrint(bigInt);

// Negative zero is a special case that requires HeapNumber
const negZero = -0;
console.log('\nNegative zero (-0):');
%DebugPrint(negZero);

console.log('\n--- SMI to HeapNumber Transition ---\n');

// Watch a number transition from SMI to HeapNumber
let num = 100;
console.log('Starting as SMI (100):');
%DebugPrint(num);

num = num + 0.5;  // Adding a fraction forces HeapNumber
console.log('\nAfter adding 0.5 (100.5):');
%DebugPrint(num);

console.log('\n--- Array Element Storage ---\n');

// Arrays of SMIs get more efficient internal storage
// Look for "elements: 0x... <FixedArray>" in the output, and note the "elements kind"
//
// ELEMENTS KINDS TO LOOK FOR:
//   PACKED_SMI_ELEMENTS     - All elements are small integers (fastest)
//   PACKED_DOUBLE_ELEMENTS  - All elements are numbers (floats or large ints)
//   PACKED_ELEMENTS         - Mixed types or objects
//   HOLEY_*                 - Array has gaps/holes (sparse)
//
// Once an array transitions to a more general kind, it never goes back.

const smiArray = [1, 2, 3, 4, 5];
console.log('Array of SMIs (look for PACKED_SMI_ELEMENTS):');
%DebugPrint(smiArray);

// One float changes the entire array's element storage type
const mixedArray = [1, 2, 3.14, 4, 5];
console.log('\nArray with one float (look for PACKED_DOUBLE_ELEMENTS):');
%DebugPrint(mixedArray);

console.log('\n--- Performance Pattern ---\n');

// The chapter shows calculateTotalFast vs calculateTotalSlow.
// The fast version keeps values as SMI throughout the loop.

function calculateTotalFast(pricesInCents) {
  let total = 0;  // SMI
  for (const price of pricesInCents) {
    total += price;  // Stays as SMI
  }
  return total / 100;  // Convert only at the end
}

function calculateTotalSlow(prices) {
  let total = 0;  // Starts as SMI
  for (const price of prices) {
    total += price * 1.0825;  // Forces HeapNumber immediately
  }
  return total;
}

const cents = [1999, 2499, 999];
console.log('Fast (integer cents):', calculateTotalFast(cents));
console.log('Slow (float dollars):', calculateTotalSlow(cents.map(c => c / 100)));

// In performance-critical code, keeping values as integers when possible
// avoids the overhead of HeapNumber allocation. But only optimize after
// measuring - for most code, the difference is negligible.
