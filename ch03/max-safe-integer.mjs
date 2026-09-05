// Number.MAX_SAFE_INTEGER marks the last integer with guaranteed unique representation.

console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991 (2^53 - 1)
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991

// At and past the boundary, +1 and +2 can collide onto the same float.
const max = Number.MAX_SAFE_INTEGER;
console.log(max + 1 === max + 2); // true, both round to 9007199254740992

// Number.isSafeInteger tells you whether an integer is inside the safe range.
console.log(Number.isSafeInteger(max)); // true
console.log(Number.isSafeInteger(max + 1)); // false
console.log(Number.isSafeInteger(2 ** 53)); // false

// Number.isInteger only checks integer-ness, not safety.
console.log(Number.isInteger(2 ** 53)); // true, but not safe
