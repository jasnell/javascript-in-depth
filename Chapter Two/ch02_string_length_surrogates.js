// Chapter 2: Strings - String Length and Surrogate Pairs
// See: "Surrogate pairs in UTF-16" and "String length with Unicode characters"
//
// JavaScript strings are sequences of UTF-16 code units, not characters.
// Characters beyond U+FFFF (like emoji) require two code units, which
// means string.length doesn't always match what you see on screen.

console.log('--- String Length Surprises ---\n');

// Simple ASCII - length matches character count
const hello = 'hello';
console.log(`"${hello}".length =`, hello.length);  // 5

// Unicode beyond U+FFFF requires surrogate pairs (2 code units each)
const emoji = '😄';
console.log(`"${emoji}".length =`, emoji.length);  // 2, not 1

// The emoji is stored as a surrogate pair
console.log('Emoji code units:', emoji.charCodeAt(0).toString(16), emoji.charCodeAt(1).toString(16));
// High surrogate: d83d, Low surrogate: de04

// Mixed content shows the discrepancy clearly
const mixed = 'Hi 😄!';
console.log(`"${mixed}".length =`, mixed.length);  // 5 (H, i, space, [d83d, de04], !)

console.log('\n--- Surrogate Pair Mechanics ---\n');

// The chapter uses U+10437 (𐐷) as the canonical example
const deseret = '𐐷';
console.log(`Character: ${deseret}`);
console.log(`Length: ${deseret.length}`);  // 2

// We can extract and examine the surrogate pair
const highSurrogate = deseret.charCodeAt(0);  // 0xD801
const lowSurrogate = deseret.charCodeAt(1);   // 0xDC37

console.log(`High surrogate: 0x${highSurrogate.toString(16).toUpperCase()}`);
console.log(`Low surrogate: 0x${lowSurrogate.toString(16).toUpperCase()}`);

// The formula to calculate the actual codepoint from surrogates:
// (high - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000
const codepoint = (highSurrogate - 0xD800) * 0x400 + (lowSurrogate - 0xDC00) + 0x10000;
console.log(`Calculated codepoint: U+${codepoint.toString(16).toUpperCase()}`);  // U+10437

// The modern alternative: codePointAt() handles this for you
console.log(`Using codePointAt(0): U+${deseret.codePointAt(0).toString(16).toUpperCase()}`);

console.log('\n--- Iterating Correctly Over Unicode ---\n');

const text = 'A😄B𐐷C';
console.log(`String: "${text}"`);
console.log(`Length property: ${text.length}`);  // 7 code units, but only 5 visual characters

// Iterating by index breaks surrogate pairs apart
console.log('\nIterating by index (incorrect):');
for (let i = 0; i < text.length; i++) {
  console.log(`  [${i}]: "${text[i]}" (charCode: 0x${text.charCodeAt(i).toString(16)})`);
}

// for...of iterates by codepoint, keeping surrogate pairs together
console.log('\nIterating with for...of (correct):');
let index = 0;
for (const char of text) {
  console.log(`  [${index}]: "${char}" (codePoint: U+${char.codePointAt(0).toString(16).toUpperCase()})`);
  index++;
}

// To get the true character count, spread into an array
const visualLength = [...text].length;
console.log(`\nVisual character count: ${visualLength}`);  // 5

// When you need the actual number of user-perceived characters, use the
// spread operator or Array.from(). The length property gives you code units,
// which is what most string operations actually work with internally.
