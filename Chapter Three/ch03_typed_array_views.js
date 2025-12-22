// Chapter 3: Numbers - Typed Array Views
// See: "ArrayBuffer and typed arrays"
//
// Typed arrays provide different "views" onto the same underlying binary data.
// This reveals how the same bytes can represent completely different numbers
// depending on how you interpret them.
//
// Run with: node ch03_typed_array_views.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Same Bytes, Different Views ---\n');

// Create a buffer with 8 bytes
const buffer = new ArrayBuffer(8);

// Create different views of the same memory
const uint8 = new Uint8Array(buffer);
const uint16 = new Uint16Array(buffer);
const uint32 = new Uint32Array(buffer);
const float64 = new Float64Array(buffer);

// Write a value through one view
float64[0] = Math.PI;

console.log('Wrote Math.PI through Float64 view:\n');
log('As Float64', float64[0]);
log('As Uint32 (2 elements)', [...uint32]);
log('As Uint16 (4 elements)', [...uint16]);
log('As Uint8 (8 bytes)', [...uint8]);

console.log('\n--- Interpreting Float64 Bits ---\n');

// IEEE 754 double-precision layout:
// - Bit 63: sign (0 = positive, 1 = negative)
// - Bits 62-52: exponent (11 bits, biased by 1023)
// - Bits 51-0: mantissa (52 bits, implicit leading 1)

function inspectFloat64(value) {
  const buffer = new ArrayBuffer(8);
  const float = new Float64Array(buffer);
  const bytes = new Uint8Array(buffer);

  float[0] = value;

  // Show raw bytes (little-endian on most systems)
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join(' ');
  log('Bytes (little-endian)', hex);

  // Read as 64-bit integer (little-endian on this system)
  const view = new DataView(buffer);
  const bits = view.getBigUint64(0, true);  // little-endian to match storage
  const bitStr = bits.toString(2).padStart(64, '0');

  log('Sign bit', bitStr[0]);
  log('Exponent', bitStr.slice(1, 12) + ` (${parseInt(bitStr.slice(1, 12), 2) - 1023})`);
  log('Mantissa', bitStr.slice(12));
}

console.log('Inspecting 1.0:');
inspectFloat64(1.0);

console.log('\nInspecting -1.0:');
inspectFloat64(-1.0);

console.log('\nInspecting 0.5:');
inspectFloat64(0.5);

console.log('\n--- Little-Endian vs Big-Endian ---\n');

// Most modern systems are little-endian
const endianBuffer = new ArrayBuffer(4);
const endianU32 = new Uint32Array(endianBuffer);
const endianU8 = new Uint8Array(endianBuffer);

endianU32[0] = 0x12345678;

console.log('Wrote 0x12345678 as Uint32');
log('Bytes in memory', [...endianU8].map(b => '0x' + b.toString(16).padStart(2, '0')));

if (endianU8[0] === 0x78) {
  console.log('System is little-endian (least significant byte first)');
} else {
  console.log('System is big-endian (most significant byte first)');
}

console.log('\n--- DataView for Endian Control ---\n');

// DataView lets you explicitly control endianness
const dv = new DataView(new ArrayBuffer(4));

dv.setUint32(0, 0x12345678, true);   // little-endian
log('Little-endian bytes', [...new Uint8Array(dv.buffer)].map(b => '0x' + b.toString(16)));

dv.setUint32(0, 0x12345678, false);  // big-endian
log('Big-endian bytes', [...new Uint8Array(dv.buffer)].map(b => '0x' + b.toString(16)));

console.log('\n--- Practical Use: Reading Binary Formats ---\n');

// Simulating reading a binary file header
const header = new ArrayBuffer(12);
const headerView = new DataView(header);

// Write a mock header: magic number + version + size
headerView.setUint32(0, 0x89504E47, false);  // PNG magic, big-endian
headerView.setUint16(4, 1, true);            // version 1, little-endian
headerView.setUint32(6, 1024, true);         // size 1024, little-endian

// Read it back
const magic = headerView.getUint32(0, false).toString(16).toUpperCase();
const version = headerView.getUint16(4, true);
const size = headerView.getUint32(6, true);

log('Magic number', `0x${magic}`);
log('Version', version);
log('Size', size);

console.log('\n--- Type Conversion Boundaries ---\n');

// Writing outside the type's range wraps or truncates
const int8 = new Int8Array(1);
int8[0] = 128;  // Max Int8 is 127
log('128 as Int8', int8[0]);  // -128 (wrapped)

int8[0] = 200;
log('200 as Int8', int8[0]);  // -56 (wrapped)

const uint8Clamped = new Uint8ClampedArray(1);
uint8Clamped[0] = 300;  // Max is 255
log('300 as Uint8Clamped', uint8Clamped[0]);  // 255 (clamped, not wrapped)
