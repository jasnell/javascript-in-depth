// Concept: strings are immutable - index assignment silently fails in sloppy mode
// CommonJS (.cjs) runs sloppy, matching the book. In an ESM module (strict) this throws instead.
// Fixed: the book's loop declared `let I` but incremented `i` (mismatched casing).
const str = 'hello';
str[0] = 'H';     // no effect (sloppy mode); would throw TypeError under 'use strict'
console.log(str); // still 'hello'

// Every += produces a brand-new intermediate string rather than mutating in place.
let result = '';
for (let i = 0; i < 10000; i++) {
  result += 'a'; // creates 10,000 intermediate strings
}
console.log(result.length); // 10000
