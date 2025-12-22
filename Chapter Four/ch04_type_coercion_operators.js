// Chapter 4: Primitives - Type Coercion with Operators
// See: "When JavaScript coerces types" - Arithmetic and Comparison operators
//
// Different operators follow different coercion rules. The plus operator
// prefers strings, while minus, multiply, and divide always convert to numbers.
// Understanding these differences prevents common bugs.

console.log('--- Arithmetic: - * / Always Convert to Number ---\n');

console.log("'10' - 5 =", '10' - 5);        // 5
console.log("'5' * '2' =", '5' * '2');      // 10
console.log("'abc' - 1 =", 'abc' - 1);      // NaN (can't convert 'abc')
console.log("true / false =", true / false); // Infinity (1 / 0)

console.log('\n--- The Plus Operator Prefers Strings ---\n');

// This is where many bugs come from
console.log("'5' + 3 =", '5' + 3);          // '53' (string concatenation)
console.log("5 + '3' =", 5 + '3');          // '53' (string concatenation)
console.log("5 + 3 =", 5 + 3);              // 8 (numeric addition)

// This difference causes real problems:
console.log("\n'10' + 5 - 5 =", '10' + 5 - 5);   // 100, not 10!
// Explanation: '10' + 5 = '105', then '105' - 5 = 100

console.log('\n--- Comparison Operators ---\n');

// Loose equality (==) coerces types aggressively
console.log("5 == '5':", 5 == '5');              // true
console.log("0 == false:", 0 == false);          // true
console.log("null == undefined:", null == undefined);  // true
console.log("'' == 0:", '' == 0);                // true

// Strict equality (===) never coerces - different types are never equal
console.log("\n5 === '5':", 5 === '5');          // false
console.log("0 === false:", 0 === false);        // false

console.log('\n--- Relational Operators: String vs Number ---\n');

// When both operands are strings, comparison is alphabetical
console.log("'10' < '9':", '10' < '9');          // true! ('1' comes before '9')

// When one operand is a number, the string converts
console.log("'10' < 9:", '10' < 9);              // false (10 < 9 is false)

// This breaks sorting if you're not careful
console.log("\n['10', '2', '1'].sort():", ['10', '2', '1'].sort());
// Result: ['1', '10', '2'] - alphabetical, not numerical

// Fix: provide a numeric comparator
console.log("Sorted numerically:", ['10', '2', '1'].sort((a, b) => a - b));

console.log('\n--- Array Coercion Chain ---\n');

// From the chapter: why does [1] become a number but [1,2] becomes NaN?
console.log('Number([1]) =', Number([1]));       // 1
console.log('Number([1,2]) =', Number([1,2]));   // NaN

// Arrays can't convert directly to numbers, so JavaScript first converts
// to string, then to number:
console.log('String([1]) =', String([1]));       // '1' -> parses to 1
console.log('String([1,2]) =', String([1,2]));   // '1,2' -> can't parse, NaN

// This chain of conversions is where performance costs come from.
// The chapter emphasizes converting data once at boundaries, not repeatedly.
