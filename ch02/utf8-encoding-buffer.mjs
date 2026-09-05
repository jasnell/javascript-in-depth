// Concept: JS strings are UTF-16 internally but Buffer converts to/from UTF-8 by default
// Three-byte UTF-8 encoding of U+21C7 (Leftwards Paired Arrows).
const arrows = Buffer.from('⇇');
console.log(arrows);                 // <Buffer e2 87 87>
console.log(arrows.toString('hex')); // e28787

// U+00FF is 0x00ff in UTF-16 but the two-byte sequence 0xc3bf in UTF-8.
const b = Buffer.from('ÿ');
console.log(b.toString('hex')); // c3bf
console.log(b.toString());      // ÿ  (round-trips UTF-8 -> UTF-16)

// The single character ÿ occupies 2 UTF-8 bytes but 1 UTF-16 code unit.
console.log('ÿ'.length);                     // 1
console.log(Buffer.byteLength('ÿ', 'utf8')); // 2
