// Chapter 2: Strings - Unicode Normalization
// See: "String comparison and Unicode normalization"
//
// Demonstrates how visually identical strings can differ at the code unit level,
// and why normalizing strings before comparison is essential.

// Two ways to represent "café" - they look the same but differ internally
const cafeComposed = 'caf\u00E9';        // é as single codepoint U+00E9
const cafeDecomposed = 'cafe\u0301';     // e + combining acute accent U+0301

console.log('Composed:  ', cafeComposed);
console.log('Decomposed:', cafeDecomposed);
console.log('Look identical?', cafeComposed, '===', cafeDecomposed);
console.log('Are equal?', cafeComposed === cafeDecomposed);  // false!
console.log('Composed length:  ', cafeComposed.length);      // 4
console.log('Decomposed length:', cafeDecomposed.length);    // 5

// The normalize() method resolves this difference
console.log('\n--- Normalization Forms ---');
console.log('NFC (Canonical Composition):');
console.log('  cafeComposed.normalize("NFC") ===', cafeComposed.normalize('NFC'));
console.log('  cafeDecomposed.normalize("NFC") ===', cafeDecomposed.normalize('NFC'));
console.log('  Equal after NFC?',
  cafeComposed.normalize('NFC') === cafeDecomposed.normalize('NFC'));  // true

// This matters for real applications. Consider username registration:
console.log('\n--- Username Registration Example ---');

const existingUsers = ['josé', 'müller', 'café_owner'];

// This version has a bug - it doesn't normalize before comparison
function registerUserBroken(username) {
  if (existingUsers.includes(username)) {
    return 'Username already taken';
  }
  existingUsers.push(username);
  return 'Registration successful';
}

// This version normalizes first, preventing duplicate registrations
function registerUserFixed(username) {
  const normalized = username.normalize('NFC');
  if (existingUsers.some(u => u.normalize('NFC') === normalized)) {
    return 'Username already taken';
  }
  existingUsers.push(normalized);
  return 'Registration successful';
}

// "josé" with é as single codepoint
const jose1 = 'jos\u00E9';
// "josé" with e + combining accent
const jose2 = 'jose\u0301';

console.log('Broken registration:');
console.log('  jose1:', registerUserBroken(jose1));  // Already taken
console.log('  jose2:', registerUserBroken(jose2));  // Successful - allows duplicate!

console.log('\nFixed registration (on fresh data):');
const existingUsers2 = ['josé'];
function registerFixed2(username) {
  const normalized = username.normalize('NFC');
  if (existingUsers2.some(u => u.normalize('NFC') === normalized)) {
    return 'Username already taken';
  }
  existingUsers2.push(normalized);
  return 'Registration successful';
}
console.log('  jose1:', registerFixed2(jose1));  // Already taken
console.log('  jose2:', registerFixed2(jose2));  // Also already taken - correct!

// Always normalize strings before comparison or storage. NFC works for most
// cases. Use NFKC for security-critical comparisons since it catches more
// visually similar variants.
