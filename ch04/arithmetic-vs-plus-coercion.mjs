// Shows minus/multiply/divide always coerce to number, while + prefers string concatenation when either side is a string.

// Minus, multiply, divide: both operands become numbers.
console.log('10' - 5);        // 5
console.log('5' * '2');       // 10  (both strings coerced to numbers, then multiplied)
console.log('abc' - 1);       // NaN (cannot convert 'abc')
console.log(true / false);    // Infinity (1 / 0)

// Plus is special: if either operand is a string, it concatenates.
console.log('5' + 3);         // '53'
console.log(5 + '3');         // '53'
console.log(5 + 3);           // 8 (both numbers, arithmetic)

// The type of the result differs accordingly.
console.log(typeof ('5' * '2')); // number
console.log(typeof ('5' + 3));   // string

// Sanity check the multiplication result really is the number 10.
console.log('5' * '2' === 10);   // true
