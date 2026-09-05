// Converting BigInt to a fixed-width integer needs an explicit range check.

// Manual guard: reject anything outside the signed 64-bit range before handing it off.
function toInt64Safe(value) {
  const MIN = -(2n ** 63n);
  const MAX = 2n ** 63n - 1n;
  if (value < MIN || value > MAX) {
    throw new RangeError(`Value ${value} out of range`);
  }
  return value;
}

console.log(toInt64Safe(123n)); // 123n
try {
  toInt64Safe(2n ** 64n); // exceeds int64 max
} catch (err) {
  console.log(err.message); // Value 18446744073709551616 out of range
}

// BigInt.asIntN / asUintN wrap into a fixed width, matching two's complement overflow.
console.log(BigInt.asIntN(64, 2n ** 63n)); // -9223372036854775808n, wraps to negative
console.log(BigInt.asUintN(64, -1n)); // 18446744073709551615n, uint64 max

// Number has no unsigned concept, so the largest uint64 is ambiguous when narrowed.
const maxUint64 = 2n ** 64n - 1n;
console.log(maxUint64); // 18446744073709551615n
