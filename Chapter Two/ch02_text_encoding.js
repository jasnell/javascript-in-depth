// Chapter 2: Strings - TextEncoder and TextDecoder
// See: "String encoding" and "UTF-8 vs UTF-16"
//
// JavaScript strings are UTF-16 internally, but network protocols and files
// often use UTF-8. TextEncoder/TextDecoder bridge this gap, revealing the
// difference between these encodings.
//
// Run with: node ch02_text_encoding.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- UTF-16 (JavaScript) vs UTF-8 (Web/Files) ---\n');

const str = 'Hello';
log('String', str);
log('String length (UTF-16 code units)', str.length);

// Encode to UTF-8
const encoder = new TextEncoder();
const utf8Bytes = encoder.encode(str);

log('UTF-8 bytes', utf8Bytes);
log('UTF-8 byte length', utf8Bytes.length);

console.log('\n--- ASCII Is the Same in Both ---\n');

// For ASCII, UTF-8 and UTF-16 code units are identical
const ascii = 'ABC';
const asciiBytes = encoder.encode(ascii);

console.log('ASCII characters:');
for (let i = 0; i < ascii.length; i++) {
  log(`  '${ascii[i]}'`, `charCode=${ascii.charCodeAt(i)}, UTF-8=${asciiBytes[i]}`);
}

console.log('\n--- Multi-byte UTF-8 Sequences ---\n');

// Characters outside ASCII need multiple UTF-8 bytes
const samples = [
  { char: 'é', desc: 'Latin with accent (2 bytes)' },
  { char: '中', desc: 'CJK character (3 bytes)' },
  { char: '😀', desc: 'Emoji (4 bytes)' }
];

for (const { char, desc } of samples) {
  const bytes = encoder.encode(char);
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join(' ');
  log(`'${char}' - ${desc}`, hex);
}

console.log('\n--- Decoding UTF-8 Back to String ---\n');

const decoder = new TextDecoder('utf-8');

const originalBytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
log('Bytes', [...originalBytes].map(b => '0x' + b.toString(16)));
log('Decoded', decoder.decode(originalBytes));

// UTF-8 multi-byte sequence for '中' (U+4E2D)
const chineseBytes = new Uint8Array([0xe4, 0xb8, 0xad]);
log('Chinese bytes', [...chineseBytes].map(b => '0x' + b.toString(16)));
log('Decoded', decoder.decode(chineseBytes));

console.log('\n--- Streaming Decode ---\n');

// When data arrives in chunks, you might split a multi-byte character
const fullEmoji = encoder.encode('😀');
log('Full emoji bytes', [...fullEmoji]);

// Split in the middle of the 4-byte sequence
const chunk1 = fullEmoji.slice(0, 2);
const chunk2 = fullEmoji.slice(2);

const streamDecoder = new TextDecoder('utf-8', { stream: true });

// First chunk - incomplete character
const part1 = streamDecoder.decode(chunk1, { stream: true });
log('Chunk 1 decoded', `"${part1}" (empty - waiting for more bytes)`);

// Second chunk - completes the character
const part2 = streamDecoder.decode(chunk2);
log('Chunk 2 decoded', `"${part2}"`);

console.log('\n--- BOM (Byte Order Mark) Handling ---\n');

// UTF-8 BOM: EF BB BF
const withBOM = new Uint8Array([0xef, 0xbb, 0xbf, 0x48, 0x69]); // BOM + "Hi"

const decoderNoBOM = new TextDecoder('utf-8');
const decoderIgnoreBOM = new TextDecoder('utf-8', { ignoreBOM: false });

log('With BOM (default strips it)', `"${decoderNoBOM.decode(withBOM)}"`);
log('Raw length', decoderNoBOM.decode(withBOM).length);

console.log('\n--- Fatal Mode for Invalid Sequences ---\n');

// Invalid UTF-8 sequence
const invalid = new Uint8Array([0x48, 0x69, 0xff, 0xfe]); // "Hi" + invalid bytes

const lenientDecoder = new TextDecoder('utf-8');
const strictDecoder = new TextDecoder('utf-8', { fatal: true });

log('Lenient decode', `"${lenientDecoder.decode(invalid)}" (replaces invalid with �)`);

try {
  strictDecoder.decode(invalid);
} catch (e) {
  log('Fatal mode throws', e.message);
}

console.log('\n--- Other Encodings ---\n');

// TextDecoder supports various legacy encodings
const latin1Bytes = new Uint8Array([0xe9]); // é in ISO-8859-1
const latin1Decoder = new TextDecoder('iso-8859-1');
log('ISO-8859-1 0xe9', `"${latin1Decoder.decode(latin1Bytes)}"`);

// Note: TextEncoder only supports UTF-8
console.log('TextEncoder only supports UTF-8 (web platform constraint)');

console.log('\n--- Buffer vs TextEncoder (Node.js) ---\n');

// Node.js Buffer is similar but more flexible
const bufferUtf8 = Buffer.from('Hello 中', 'utf8');
const bufferUtf16 = Buffer.from('Hello 中', 'utf16le');

log('UTF-8 buffer', bufferUtf8);
log('UTF-16LE buffer', bufferUtf16);
log('UTF-8 length', bufferUtf8.length);
log('UTF-16LE length', bufferUtf16.length);
