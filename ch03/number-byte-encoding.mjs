// A Number's 64 bits split into sign, 11 exponent bits, and 52 significand bits.

// DataView lets us read the raw IEEE-754 bytes; false selects big-endian order.
function toBits(n) {
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, n, false);
  const bytes = [];
  for (let i = 0; i < 8; i++) {
    bytes.push(dv.getUint8(i).toString(2).padStart(8, '0'));
  }
  return bytes.join(' ');
}

// getBigUint64 gives the full 64-bit pattern so we can slice out each field.
function decode(n) {
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, n, false);
  const bits = dv.getBigUint64(0, false);
  const sign = (bits >> 63n) & 1n;
  const rawExponent = (bits >> 52n) & 0x7ffn; // 11 bits
  const significand = bits & 0xfffffffffffffn; // 52 bits
  return {
    sign: Number(sign),
    rawExponent: Number(rawExponent),
    unbiasedExponent: Number(rawExponent) - 1023, // bias is 1023
    significand: significand.toString(2).padStart(52, '0'),
  };
}

console.log(toBits(123.45));
// 01000000 01011110 11011100 11001100 11001100 11001100 11001100 11001101
console.log(decode(123.45));
// sign 0, rawExponent 1029, unbiasedExponent 6, so 1.92890625 * 2^6 = 123.45
