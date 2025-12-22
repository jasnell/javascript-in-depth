// Chapter 2: Strings - Locale-Aware String Comparison
// See: "String comparison" and "Internationalization"
//
// JavaScript's default string comparison uses Unicode code point order,
// which doesn't match how humans expect strings to be sorted in different
// languages. Intl.Collator provides locale-aware comparison.
//
// Run with: node ch02_string_comparison.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Default String Comparison (Code Point Order) ---\n');

// Default comparison uses Unicode code points
const words = ['Zebra', 'apple', 'Änderung', 'éclair'];
log('Original', words);
log('Default sort', [...words].sort());

// The issue: 'Z' (90) < 'a' (97), so uppercase comes first
// And 'Ä' (196) and 'é' (233) sort after all ASCII
console.log('\nCode points:');
console.log('  Z:', 'Z'.codePointAt(0));
console.log('  a:', 'a'.codePointAt(0));
console.log('  Ä:', 'Ä'.codePointAt(0));
console.log('  é:', 'é'.codePointAt(0));

console.log('\n--- Locale-Aware Comparison with Intl.Collator ---\n');

const englishCollator = new Intl.Collator('en');
log('English sort', [...words].sort(englishCollator.compare));

const germanCollator = new Intl.Collator('de');
log('German sort', [...words].sort(germanCollator.compare));

console.log('\n--- The Swedish Alphabet Example ---\n');

// In Swedish, 'ä' comes AFTER 'z', not near 'a'
const swedishWords = ['ärlig', 'zebra', 'äpple', 'zoo'];

const enSort = [...swedishWords].sort(new Intl.Collator('en').compare);
const svSort = [...swedishWords].sort(new Intl.Collator('sv').compare);

log('English sort', enSort);
log('Swedish sort', svSort);

// Direct comparison
const enCmp = 'ä'.localeCompare('z', 'en');
const svCmp = 'ä'.localeCompare('z', 'sv');
log('\n"ä" vs "z" in English', enCmp < 0 ? 'ä < z' : 'ä > z');
log('"ä" vs "z" in Swedish', svCmp < 0 ? 'ä < z' : 'ä > z');

console.log('\n--- Case Sensitivity Options ---\n');

const mixed = ['Apple', 'apple', 'APPLE', 'äpple'];

// Case-sensitive (default)
const caseSensitive = new Intl.Collator('en', { sensitivity: 'case' });
log('Case-sensitive', [...mixed].sort(caseSensitive.compare));

// Base letters only (ignores case and accents)
const baseOnly = new Intl.Collator('en', { sensitivity: 'base' });
log('Base only', [...mixed].sort(baseOnly.compare));

// Case-insensitive search
const caseInsensitive = new Intl.Collator('en', { sensitivity: 'accent' });
log('a vs A (base)', baseOnly.compare('a', 'A'));  // 0 = equal
log('a vs á (base)', baseOnly.compare('a', 'á'));  // 0 = equal
log('a vs á (accent)', caseInsensitive.compare('a', 'á'));  // not equal

console.log('\n--- Numeric Sorting ---\n');

// Default: lexicographic (10 comes before 2)
const versions = ['v1', 'v10', 'v2', 'v20', 'v3'];
log('Default sort', [...versions].sort());

// Numeric: treats number sequences as numbers
const numericCollator = new Intl.Collator('en', { numeric: true });
log('Numeric sort', [...versions].sort(numericCollator.compare));

// File names with numbers
const files = ['file1.txt', 'file10.txt', 'file2.txt', 'file20.txt'];
log('\nFile sort (default)', [...files].sort());
log('File sort (numeric)', [...files].sort(numericCollator.compare));

console.log('\n--- Ignoring Punctuation ---\n');

const withPunctuation = ["can't", 'cant', 'can', "can't"];
const ignorePunct = new Intl.Collator('en', { ignorePunctuation: true });

log('Default', [...withPunctuation].sort());
log('Ignore punctuation', [...withPunctuation].sort(ignorePunct.compare));

console.log('\n--- Collator Reuse ---\n');

// Creating a new Collator for each comparison is expensive
// Reusing a Collator is the recommended pattern

const collator = new Intl.Collator('en', { sensitivity: 'base' });

// Good: reuse the collator
const names = ['Zoë', 'Zoe', 'zoë', 'ZOE'];
log('Sorted with reused collator', names.sort(collator.compare));

// The compare function is bound - can be passed directly
const compareEn = new Intl.Collator('en').compare;
log('Bound compare function', ['b', 'a', 'c'].sort(compareEn));

console.log('\n--- Practical Example: Search Matching ---\n');

function fuzzyMatch(query, candidates, locale = 'en') {
  const collator = new Intl.Collator(locale, {
    sensitivity: 'base',  // Ignore case and accents
    usage: 'search'
  });

  return candidates.filter(c => {
    // Check if query appears in candidate (simplified)
    const lowerC = c.toLowerCase();
    const lowerQ = query.toLowerCase();
    return lowerC.includes(lowerQ) ||
           collator.compare(c.slice(0, query.length), query) === 0;
  });
}

const products = ['Café Latte', 'Cappuccino', 'Caffè Mocha', 'Tea'];
log('Search "cafe"', fuzzyMatch('cafe', products));
log('Search "Caffe"', fuzzyMatch('Caffe', products));
