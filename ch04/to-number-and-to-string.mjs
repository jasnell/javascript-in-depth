// Demonstrates the ToNumber and ToString conversions, including the array-goes-through-string chain that explains Number([1,2]) === NaN.

// ToNumber: predictable cases.
console.log(Number(false));   // 0
console.log(Number(true));    // 1
console.log(Number(null));    // 0
console.log(Number('42'));    // 42
console.log(Number('3.14'));  // 3.14

// ToNumber: the surprising cases.
console.log(Number(undefined)); // NaN
console.log(Number(''));        // 0
console.log(Number('   '));     // 0 (whitespace only)
console.log(Number('hello'));   // NaN
console.log(Number('0x12'));    // 18 (hex is parsed, a form-validation trap)

// ToString: arrays join with commas, and null/undefined elements render empty.
console.log(String(undefined));  // 'undefined'
console.log(String(null));       // 'null'
console.log(String([]));         // '' (empty string)
console.log(String([1, 2, 3]));  // '1,2,3'
console.log(String([null]));     // '' (null element becomes empty)

// Why Number([1]) works but Number([1,2]) is NaN:
// an array cannot convert to a number directly, so it goes array -> string -> number.
console.log(String([1]));        // '1'      -> Number('1')   -> 1
console.log(String([1, 2]));     // '1,2'    -> Number('1,2') -> NaN (comma is not numeric)
console.log(Number([1]));        // 1
console.log(Number([1, 2]));     // NaN
