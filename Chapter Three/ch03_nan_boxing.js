// Chapter 3: Numbers - NaN Boxing (Engine Internals)
// See: "How engines represent values" and "IEEE 754"
//
// JavaScript engines use a technique called "NaN boxing" or "pointer tagging"
// to efficiently represent multiple types in 64 bits. This demo explores the
// IEEE 754 quirk that makes this possible.
//
// Run with: node ch03_nan_boxing.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- The NaN Space in IEEE 754 ---\n');

// IEEE 754 defines NaN as: exponent = all 1s, mantissa != 0
// There are 2^52 - 1 possible NaN bit patterns, but they all "equal" NaN

function toBits(float) {
  const buf = new ArrayBuffer(8);
  new Float64Array(buf)[0] = float;
  return new DataView(buf).getBigUint64(0, false);
}

function toHex(bits) {
  return '0x' + bits.toString(16).padStart(16, '0');
}

// JavaScript only uses one NaN value
const nan1 = NaN;
const nan2 = 0 / 0;
const nan3 = Math.sqrt(-1);
const nan4 = parseFloat('not a number');

console.log('All NaN values in JavaScript:');
log('NaN', toHex(toBits(nan1)));
log('0/0', toHex(toBits(nan2)));
log('sqrt(-1)', toHex(toBits(nan3)));
log('parseFloat("x")', toHex(toBits(nan4)));

console.log('\n--- How NaN Boxing Works ---\n');

// Engines can hide non-number values inside unused NaN bit patterns
// A typical scheme uses the quiet NaN bits plus a type tag

console.log('IEEE 754 double-precision structure:');
console.log('  [S][EEEEEEEEEEE][MMMM...52 bits...MMMM]');
console.log('  S = sign, E = exponent, M = mantissa');
console.log('');
console.log('NaN: exponent = all 1s, mantissa != 0');
console.log('Quiet NaN: bit 51 = 1 (to avoid signaling)');
console.log('');
console.log('That leaves 51 bits to encode:');
console.log('  - A type tag (3-4 bits)');
console.log('  - A pointer or small value (47-48 bits)');

console.log('\n--- Simulating NaN Boxing ---\n');

// This demonstrates the concept - real engines do this in C++

const TYPE_INT = 0n;
const TYPE_OBJECT = 1n;
const TYPE_STRING = 2n;
const TYPE_BOOL = 3n;

// Quiet NaN base: exponent all 1s, bit 51 set
const QNAN_BASE = 0x7FF8000000000000n;
const TYPE_SHIFT = 48n;
const PAYLOAD_MASK = 0x0000FFFFFFFFFFFFn;

function encodeValue(type, payload) {
  return QNAN_BASE | (type << TYPE_SHIFT) | (BigInt(payload) & PAYLOAD_MASK);
}

function decodeValue(encoded) {
  const type = (encoded >> TYPE_SHIFT) & 0x7n;
  const payload = encoded & PAYLOAD_MASK;
  return { type: Number(type), payload: Number(payload) };
}

// Simulate encoding different types
console.log('Encoded values (as hex):');

const encodedInt = encodeValue(TYPE_INT, 42);
log('Integer 42', toHex(encodedInt));

const encodedBool = encodeValue(TYPE_BOOL, 1);
log('Boolean true', toHex(encodedBool));

const fakePtr = 0x12345678;  // Simulated object pointer
const encodedObj = encodeValue(TYPE_OBJECT, fakePtr);
log('Object ptr', toHex(encodedObj));

console.log('\nDecoded values:');
const types = ['INT', 'OBJECT', 'STRING', 'BOOL'];
for (const encoded of [encodedInt, encodedBool, encodedObj]) {
  const { type, payload } = decodeValue(encoded);
  log(`Type ${types[type]}`, `payload: ${payload}`);
}

console.log('\n--- Why NaN Boxing Matters ---\n');

console.log('Benefits for engine performance:');
console.log('1. All values fit in 64 bits (one register)');
console.log('2. Number operations work directly on bits');
console.log('3. Type checking is fast (just mask and compare)');
console.log('4. No separate type field needed');

console.log('\nThe downside:');
console.log('Pointers are limited to 48 bits (256 TB address space)');
console.log('Small integers sometimes need special handling');

console.log('\n--- V8\'s Actual Approach ---\n');

console.log('V8 uses pointer tagging instead of NaN boxing:');
console.log('- SMI (Small Integer): value << 1 | 0 (last bit = 0)');
console.log('- HeapObject pointer: ptr | 1 (last bit = 1)');
console.log('');
console.log('This works because heap objects are aligned to even addresses,');
console.log('so the last bit is always available for tagging.');
