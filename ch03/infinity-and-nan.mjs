// Infinity and NaN are reserved exponent-all-ones patterns, not ordinary numbers.

// Overflow and division by zero produce infinities rather than throwing.
console.log(1 / 0); // Infinity
console.log(-1 / 0); // -Infinity
console.log(Number.MAX_VALUE * 2); // Infinity
console.log(1e308 * 10); // Infinity

// The exact edges of the representable range.
console.log(Number.MAX_VALUE); // 1.7976931348623157e+308
console.log(Number.MIN_VALUE); // 5e-324, the smallest positive value above zero

// NaN comes from indeterminate results and is never equal to anything, even itself.
console.log(0 / 0); // NaN
console.log(NaN === NaN); // false
console.log(Number.isNaN(NaN)); // true, the reliable test
console.log(Object.is(NaN, NaN)); // true, treats NaN as one value

// Every NaN bit pattern collapses to the single NaN primitive in the language.
const dv = new DataView(new ArrayBuffer(8));
dv.setBigUint64(0, 0x7ff8000000000001n, false); // a NaN payload
console.log(Number.isNaN(dv.getFloat64(0, false))); // true
