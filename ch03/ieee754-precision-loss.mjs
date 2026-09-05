// Binary64 cannot represent some decimals or every integer above 2^53 exactly.

// Decimal fractions become infinite repeating patterns in binary, so they round.
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.3); // 0.3
console.log(0.1 + 0.2 === 0.3); // false

// The gap: how far off the sum actually is from 0.3.
console.log(0.1 + 0.2 - 0.3); // 5.551115123125783e-17

// Beyond 2^53 the representable integers are spaced 2 apart, so odd values vanish.
console.log(9007199254740992); // 2^53, safe
console.log(9007199254740993); // 2^53 + 1, rounds down to ...992
console.log(9007199254740994); // 2^53 + 2, safe again
console.log(9007199254740992 === 9007199254740993); // true, both are the same value
