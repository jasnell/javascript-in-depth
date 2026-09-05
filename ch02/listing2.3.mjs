// Listing 2.3: regex on surrogate pairs, with and without the 'u' flag
const str = '😀ABC'; // emoji is a surrogate pair (2 UTF-16 code units)

// Default: regex works on code units, so '.' matches half the emoji.
console.log(/^./.exec(str)[0].length);   // 1 (a lone surrogate, corrupt)
console.log(/^.{3}/.exec(str)[0]);       // "😀A" (emoji counted as 2 units)

// With 'u': Unicode-aware, '.' matches a whole codepoint.
console.log(/^./u.exec(str)[0]);         // "😀"
console.log(/^.{3}/u.exec(str)[0]);      // "😀AB"

// Character-class ranges over astral codepoints require 'u'.
try {
  new RegExp('[😀-😎]'); // throws: Invalid regular expression
} catch (err) {
  console.log('no u flag:', err.constructor.name);
}
console.log(/[😀-😎]/u.test('😀'));       // true

// Unicode property escapes require 'u'.
console.log(/\p{Emoji}/u.test('😀'));         // true
console.log(/\p{Script=Greek}/u.test('α'));   // true
