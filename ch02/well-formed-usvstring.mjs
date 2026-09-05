// Concept: DOMString vs USVString - lone surrogates, toWellFormed(), and URL parsing
const lone = '\ud800'; // an unpaired high surrogate (a valid DOMString, invalid UTF-16 text)

console.log(lone.isWellFormed());        // false
console.log(lone.toWellFormed());        // "�" (replacement character)
console.log(lone.toWellFormed() === '�'); // true

// The same 0xD800 code unit, three readings:
console.log(Buffer.from([0xd8, 0x00]));  // ByteString: two raw bytes <Buffer d8 00>
console.log(lone.charCodeAt(0) === 0xd800); // DOMString: an unpaired high surrogate
// USVString: replaced with U+FFFD (what toWellFormed produces, above)

// URL parsing converts the invalid DOMString to a USVString automatically.
const url = new URL('http://example.org/\ud800');
console.log(url.href); // http://example.org/%EF%BF%BD  (UTF-8 of U+FFFD, percent-encoded)
