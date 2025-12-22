// Chapter 3: Numbers - Denormalized (Subnormal) Numbers
// See: "IEEE 754" and "Floating-point edge cases"
//
// IEEE 754 has special "denormalized" numbers that provide gradual underflow
// near zero. These numbers have reduced precision but prevent sudden jumps
// to zero. They can also cause performance issues on some hardware.
//
// Run with: node ch03_denormalized_numbers.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Normal vs Denormalized Numbers ---\n');

// Number.MIN_VALUE is the smallest positive subnormal (denormalized) number
log('Number.MIN_VALUE', Number.MIN_VALUE);
log('In scientific', Number.MIN_VALUE.toExponential());

// MIN_VALUE is already the smallest - dividing by 2 underflows to 0
const halfMin = Number.MIN_VALUE / 2;
log('MIN_VALUE / 2', halfMin);
log('Underflows to zero?', halfMin === 0);  // true - no smaller positive exists

// But we can see denormals by starting just above MIN_VALUE
const denorm = Number.MIN_VALUE * 4;
log('MIN_VALUE * 4', denorm);
log('Still subnormal?', denorm < 2.2250738585072014e-308);  // true

console.log('\n--- How Denormalized Numbers Work ---\n');

// Normal: 1.xxxxx × 2^exp (implicit leading 1)
// Denormal: 0.xxxxx × 2^-1022 (explicit leading 0, minimum exponent)

console.log('IEEE 754 double-precision:');
console.log('  Normal: (-1)^s × 1.mantissa × 2^(exp-1023)');
console.log('  Denormal: (-1)^s × 0.mantissa × 2^(-1022)');
console.log('');
console.log('Denormals have:');
console.log('  - Exponent field = 0 (special case)');
console.log('  - No implicit leading 1');
console.log('  - Reduced precision (fewer significant bits)');

console.log('\n--- Gradual Underflow ---\n');

// Without denormals, numbers would jump directly to zero
let x = Number.MIN_VALUE * 16;
console.log('Dividing toward zero:');

for (let i = 0; i < 8; i++) {
  log(`  Step ${i}`, x.toExponential(3));
  x = x / 2;
}

console.log('\nWithout denormals, this would become 0 much sooner.');

console.log('\n--- Checking for Denormalized Numbers ---\n');

function isDenormalized(n) {
  if (n === 0 || !Number.isFinite(n)) return false;
  return Math.abs(n) < 2.2250738585072014e-308;  // MIN_NORMAL
}

log('MIN_VALUE is denorm', isDenormalized(Number.MIN_VALUE));
log('MIN_VALUE * 2 is denorm', isDenormalized(Number.MIN_VALUE * 2));
log('1e-300 is denorm', isDenormalized(1e-300));
log('1e-308 is denorm', isDenormalized(1e-308));
log('1e-310 is denorm', isDenormalized(1e-310));

console.log('\n--- Precision Loss in Denormals ---\n');

// Denormals have fewer significant bits
const normal = 1.0;
const denormal = Number.MIN_VALUE;

// Both should equal themselves when halved and doubled
log('Normal: x === x/2 * 2', normal === (normal / 2) * 2);
log('Denormal: x === x/2 * 2', denormal === (denormal / 2) * 2);

// Show precision differences
console.log('\nSmallest increments:');
log('Normal spacing at 1.0', Math.abs(1.0 - (1.0 + Number.EPSILON)));

// Near denormal range, spacing is absolute, not relative
const small = 1e-308;
const nextSmall = small + Number.MIN_VALUE;
log('Spacing near 1e-308', Math.abs(nextSmall - small));

console.log('\n--- Performance Implications ---\n');

// Some CPUs handle denormals much slower than normals
// (Denormal-As-Zero and Flush-To-Zero modes exist in some contexts)

const COUNT = 1000000;

// Normal number arithmetic
let normalSum = 0;
const start1 = performance.now();
for (let i = 0; i < COUNT; i++) {
  normalSum += 1e-100;
}
const time1 = performance.now() - start1;

// Denormal number arithmetic (may be slower on some systems)
let denormSum = 0;
const denormValue = Number.MIN_VALUE;
const start2 = performance.now();
for (let i = 0; i < COUNT; i++) {
  denormSum += denormValue;
}
const time2 = performance.now() - start2;

log('Normal arithmetic time', `${time1.toFixed(2)}ms`);
log('Denormal arithmetic time', `${time2.toFixed(2)}ms`);

console.log('\n(Performance difference depends on CPU and optimization tier)');

console.log('\n--- When Denormals Matter ---\n');

console.log('Denormals are important for:');
console.log('  - Numerical stability in scientific computing');
console.log('  - Preventing (x - y) === 0 when x !== y');
console.log('  - Gradual underflow vs. abrupt underflow');
console.log('');
console.log('For most JavaScript code, you\'ll never encounter them.');
console.log('They exist at the extreme lower bound of representable numbers.');
