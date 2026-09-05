// Concept: .length counts UTF-16 code units; iteration/spread counts codepoints
const emoji = '😀'; // one codepoint U+1F600, encoded as a surrogate pair

console.log('length (code units):', emoji.length);        // 2
console.log('spread (code points):', [...emoji].length);  // 1

// The pair splits into two lone surrogates when indexed by code unit.
console.log(emoji.charCodeAt(0).toString(16)); // d83d (high surrogate)
console.log(emoji.charCodeAt(1).toString(16)); // de00 (low surrogate)

// codePointAt reassembles the full codepoint.
console.log(emoji.codePointAt(0).toString(16)); // 1f600

const mixed = 'a😀b';
console.log(mixed.length);       // 4 code units
console.log([...mixed].length);  // 3 code points
