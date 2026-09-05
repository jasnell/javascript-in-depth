// Listing 2.4: ByteStrings via the Buffer API (fixed: assign buf before using it)
// The book's original referenced `buf` before it was declared (ReferenceError).
const buf = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x00], 'ascii');

console.log(buf);                    // <Buffer 68 65 6c 6c 6f 00>
console.log(buf.toString('utf16le')); // "敨汬o" (bytes reinterpreted 2-per-char)
console.log(
  Buffer.from(buf.toString('utf16le'), 'utf16le').toString('ascii'),
); // "hello\x00" (round-trips back to the original bytes)
