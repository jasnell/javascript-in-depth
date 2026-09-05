// Shows how built-in methods silently coerce arguments, and how integer conversions (truncate/wrap) drive String.fromCharCode and the |0 trick.

// Built-ins coerce arguments to the type they expect.
console.log(parseInt('42px'));     // 42 (parses digits until a non-digit)
console.log(Math.max('10', 5));    // 10 (string coerced to number)
console.log('hello'.charAt('2'));  // 'l' (index string coerced to number)

// The Array constructor is stricter: a Number length must equal its own
// ToUint32, so a fractional length is rejected rather than truncated.
try {
  new Array(3.7);
} catch (e) {
  console.log(e.constructor.name); // RangeError: Invalid array length
}

// String.fromCharCode runs ToUint16: it truncates fractions and wraps mod 65536.
console.log(String.fromCharCode(65));    // 'A'
console.log(String.fromCharCode(65.9));  // 'A' (truncated to 65)
console.log(String.fromCharCode('65'));  // 'A' (string coerced to 65)
console.log(String.fromCharCode(65601));  // 'A' (65601 % 65536 === 65)

// The | 0 idiom forces ToInt32, a fast truncate-to-integer.
console.log(3.9 | 0);    // 3
console.log(-3.9 | 0);   // -3 (truncates toward zero, not floor)
console.log('42' | 0);   // 42 (string coerced first)
