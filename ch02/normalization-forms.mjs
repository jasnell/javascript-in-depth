// Concept: the four Unicode normalization forms and why unnormalized strings compare unequal
const composed = 'café';    // é as one codepoint U+00E9
const decomposed = 'café'; // e + combining acute accent U+0065 U+0301

console.log(composed === decomposed); // false (different code unit sequences)
console.log(composed.length);         // 4
console.log(decomposed.length);       // 5

// Normalizing both to the same form makes them equal.
console.log(composed.normalize('NFC') === decomposed.normalize('NFC')); // true
console.log(composed.normalize('NFD') === decomposed.normalize('NFD')); // true

// NFKC/NFKD also fold compatibility variants (note: correct name is NFKC, not "NKFC").
console.log('ﬁ'.normalize('NFKC'));      // "fi" (fi ligature -> two letters)
console.log('ﬁ'.normalize('NFKC').length); // 2
console.log('½'.normalize('NFKD'));      // "1⁄2" (½ -> 1, fraction slash, 2)
console.log('½'.normalize('NFKD').length); // 3

// normalize() defaults to NFC.
console.log(decomposed.normalize() === composed); // true
