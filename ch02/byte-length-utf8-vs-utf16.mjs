// Concept: the same text takes different byte counts in UTF-8 vs UTF-16 (Buffer.byteLength)
const s = 'héllo😀'; // ASCII + a Latin-1 accent + an astral emoji

console.log('.length (UTF-16 code units):', s.length);           // 7
console.log('utf8  bytes:', Buffer.byteLength(s, 'utf8'));        // 1+2+1+1+1+4 = 10
console.log('utf16le bytes:', Buffer.byteLength(s, 'utf16le'));   // 7 code units * 2 = 14

// ASCII-only text is 1 byte/char in UTF-8 but always 2 bytes/char in UTF-16.
console.log('hello utf8:', Buffer.byteLength('hello', 'utf8'));       // 5
console.log('hello utf16le:', Buffer.byteLength('hello', 'utf16le')); // 10
