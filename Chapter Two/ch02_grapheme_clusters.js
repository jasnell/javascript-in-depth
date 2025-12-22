// Chapter 2: Strings - Grapheme Clusters
// See: "Unicode and UTF-16" and "What users see vs what JavaScript sees"
//
// A "character" to a user isn't always a single code point. Grapheme clusters
// combine multiple code points into one visible unit. JavaScript's string
// methods don't understand grapheme clusters, which causes surprising behavior.
//
// Run with: node ch02_grapheme_clusters.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- What Is a Grapheme Cluster? ---\n');

// Family emoji: single visual unit, but multiple code points
const family = '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}';  // 👨‍👩‍👧
log('Family emoji', family);
log('.length', family.length);  // 8! (surrogates + ZWJ characters)
log('[...spread].length', [...family].length);  // 5 code points

// Each code point:
console.log('\nCode points in family emoji:');
for (const cp of family) {
  log(`  U+${cp.codePointAt(0).toString(16).toUpperCase()}`, cp);
}

console.log('\n--- Flag Emoji (Regional Indicators) ---\n');

// Flags use pairs of regional indicator symbols
const usFlag = '\u{1F1FA}\u{1F1F8}';  // 🇺🇸
log('US flag', usFlag);
log('.length', usFlag.length);  // 4 (two surrogate pairs)
log('[...spread].length', [...usFlag].length);  // 2 code points

// Naive reversal breaks flags
const reversed = [...usFlag].reverse().join('');
log('Reversed', reversed);  // Shows different flag or broken

console.log('\n--- Combining Characters ---\n');

// é can be one code point (é) or two (e + combining accent)
const composed = '\u00E9';        // é (single code point)
const decomposed = 'e\u0301';     // e + combining acute accent

log('Composed é', composed);
log('Decomposed é', decomposed);
log('Look identical?', composed === decomposed);  // false!
log('Composed length', composed.length);  // 1
log('Decomposed length', decomposed.length);  // 2

// Normalization makes them equal
log('After NFC', composed === decomposed.normalize('NFC'));

console.log('\n--- Intl.Segmenter for Graphemes ---\n');

// The modern way to work with grapheme clusters
if (typeof Intl.Segmenter !== 'undefined') {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

  const text = '👨‍👩‍👧 Hello é 🇺🇸';
  const segments = [...segmenter.segment(text)];

  console.log('Grapheme-aware segmentation:');
  segments.forEach((seg, i) => {
    log(`  [${i}]`, `"${seg.segment}"`);
  });

  log('\nVisual character count', segments.length);
  log('JavaScript .length', text.length);

  // Proper string reversal
  function reverseGraphemes(str) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return [...segmenter.segment(str)]
      .map(s => s.segment)
      .reverse()
      .join('');
  }

  const testStr = 'Hello 👨‍👩‍👧!';
  log('\nOriginal', testStr);
  log('Grapheme-reversed', reverseGraphemes(testStr));
  log('Naive reversal', [...testStr].reverse().join(''));  // Broken
} else {
  console.log('Intl.Segmenter not available in this environment');
}

console.log('\n--- Practical Issues ---\n');

// Input validation fails without grapheme awareness
function validateMaxChars(input, max) {
  // Wrong: counts UTF-16 code units
  return input.length <= max;
}

function validateMaxGraphemes(input, max) {
  // Right: counts what users see
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  return [...segmenter.segment(input)].length <= max;
}

const userInput = '👨‍👩‍👧👨‍👩‍👧';  // Two family emojis
log('User input', userInput);
log('.length check (max 10)', validateMaxChars(userInput, 10));  // false! (length is 16)
log('Grapheme check (max 10)', validateMaxGraphemes(userInput, 10));  // true (2 graphemes)

console.log('\n--- Summary ---\n');
console.log('JavaScript strings are sequences of UTF-16 code units.');
console.log('Users see grapheme clusters, which can span multiple code units.');
console.log('Use Intl.Segmenter for correct text processing.');
