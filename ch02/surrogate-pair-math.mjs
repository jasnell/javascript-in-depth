// Concept: decode a UTF-16 surrogate pair into a codepoint (canonical U+10437 example, Equation 2.1)
const high = 0xd801;
const low = 0xdc37;

const highValue = (high - 0xd800) * 0x400; // 0x400
const lowValue = low - 0xdc00;             // 0x37
const codepoint = highValue + lowValue + 0x10000;

console.log('codepoint:', codepoint.toString(16)); // 10437
console.log('decimal:', codepoint);                // 66615
console.log('symbol:', String.fromCodePoint(codepoint)); // 𐐷

// The engine does the same thing: fromCharCode of the pair equals the codepoint.
console.log(String.fromCharCode(high, low) === String.fromCodePoint(codepoint)); // true
console.log('𐐷'.codePointAt(0).toString(16)); // 10437

// Surrogate ranges: high U+D800..U+DBFF, low U+DC00..U+DFFF.
console.log(high >= 0xd800 && high <= 0xdbff); // true
console.log(low >= 0xdc00 && low <= 0xdfff);   // true
