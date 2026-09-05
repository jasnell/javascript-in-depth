// BigInt uses as much memory as needed, so integers stay exact beyond 2^53 - 1.

// A plain Number silently corrupts this value; the n suffix makes it a BigInt.
const unsafe = 9007199254740993;
console.log(unsafe); // 9007199254740992 (corrupted)

const safe = 9007199254740993n;
console.log(safe); // 9007199254740993n (exact)

// Arbitrary size: a googol is 1 followed by 100 zeroes.
const googol = 10n ** 100n;
console.log(googol);

// BigInt arithmetic is integer-only; division truncates toward zero.
console.log(7n / 2n); // 3n, not 3.5
console.log(typeof 1n); // "bigint"
