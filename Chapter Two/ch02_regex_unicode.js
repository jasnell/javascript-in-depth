// Chapter 2: Strings - Regular Expressions and Unicode
// See: "Regular expressions with Unicode (the 'u' flag)"
//
// Without the 'u' flag, regex treats strings as sequences of UTF-16 code units.
// This breaks pattern matching for characters that use surrogate pairs.

const str = '😀ABC';  // Emoji is a surrogate pair (2 code units)

console.log('--- Without the "u" flag ---\n');

// The dot matches a single code unit, not a full character
const matchWithout1 = /^./.exec(str);
console.log('/^./.exec("😀ABC"):');
console.log('  Matched:', JSON.stringify(matchWithout1[0]));
console.log('  Length:', matchWithout1[0].length);  // Only matched half the emoji

const matchWithout2 = /^.{3}/.exec(str);
console.log('/^.{3}/.exec("😀ABC"):');
console.log('  Matched:', JSON.stringify(matchWithout2[0]));
console.log('  Treats emoji as 2 code units, so this is emoji + A');

console.log('\n--- With the "u" flag ---\n');

// The 'u' flag makes regex Unicode-aware
const matchWith1 = /^./u.exec(str);
console.log('/^./u.exec("😀ABC"):');
console.log('  Matched:', matchWith1[0]);  // Correctly matches the full emoji

const matchWith2 = /^.{3}/u.exec(str);
console.log('/^.{3}/u.exec("😀ABC"):');
console.log('  Matched:', matchWith2[0]);  // "😀AB" - emoji counts as 1 character

console.log('\n--- Unicode Property Escapes ---\n');

// The 'u' flag also enables Unicode property escapes (\p{...})
// These let you match characters by their Unicode properties

console.log('/\\p{Emoji}/u.test("Hello 😀"):',
  /\p{Emoji}/u.test('Hello 😀'));  // true

console.log('/\\p{Emoji}/u.test("Hello"):',
  /\p{Emoji}/u.test('Hello'));      // false

// Match specific scripts
console.log('/\\p{Script=Greek}/u.test("α"):',
  /\p{Script=Greek}/u.test('α'));   // true

console.log('/\\p{Script=Greek}/u.test("a"):',
  /\p{Script=Greek}/u.test('a'));   // false

// Match letters from any language
console.log('/\\p{Letter}/u.test("日"):',
  /\p{Letter}/u.test('日'));         // true

console.log('\n--- Validating International Input ---\n');

// A practical example: accepting names in any script, not just ASCII
function isValidName(inputName) {
  // \p{Letter} matches letters from any writing system
  return /^[\p{Letter}\s'-]+$/u.test(inputName);
}

const names = [
  'John Smith',
  'José García',
  '田中太郎',
  'Αλέξανδρος',
  '😀 Invalid',
];

for (const n of names) {
  console.log(`  "${n}": ${isValidName(n) ? 'valid' : 'invalid'}`);
}

// When working with international text or any strings that might contain
// characters outside the basic ASCII range, use the 'u' flag. Without it,
// regex operates on individual UTF-16 code units, which can corrupt
// surrogate pairs and produce unexpected results.
