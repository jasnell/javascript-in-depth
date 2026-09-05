// Mixing BigInt and Number in arithmetic throws; comparisons across types are allowed.

// Arithmetic across the two types is forbidden to prevent silent precision loss.
try {
  const mixed = 10n + 5; // TypeError
  console.log(mixed);
} catch (err) {
  console.log(err.constructor.name); // "TypeError"
}

// Convert explicitly to choose which side pays the cost.
const result = 10n + BigInt(5); // 15n, stays exact
console.log(result);
const approximate = Number(10n) + 5; // 15, becomes a Number
console.log(approximate);

// Comparisons work without conversion because they only yield true or false.
console.log(10n > 5); // true
console.log(10n === 10); // false, strict equality also checks type
console.log(10n == 10); // true, loose equality compares mathematical value
