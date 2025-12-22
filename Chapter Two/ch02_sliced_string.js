// Chapter 2: Strings - SlicedString Internals
// See: "V8's string representations"
//
// When you call substring() or slice(), V8 doesn't always copy the characters.
// Instead it may create a SlicedString that points back to the original string.
// This is efficient for memory but can cause unexpected retention of large strings.
//
// Run with: node --allow-natives-syntax ch02_sliced_string.js
//
// =============================================================================
// READING %DebugPrint OUTPUT FOR SLICED STRINGS:
// =============================================================================
//
// For a regular string:
//   DebugPrint: 0x... <String[209]: "xxx...IMPORTANT...yyy">
//   Type will be SeqOneByteString or SeqTwoByteString
//
// For a sliced string:
//   DebugPrint: 0x... <String[9]\: #IMPORTANT>
//    - type: SLICED_ONE_BYTE_STRING_TYPE (or TWO_BYTE)
//    - parent: 0x... <String[209]: "xxx...">   <-- References original!
//    - offset: 100                              <-- Where slice starts
//
// The "parent:" field shows the original string is still in memory.
// This is the memory retention issue: the small slice keeps the large
// parent alive because it's still referenced.
//
// Compare to a flattened copy which shows no parent reference.
// =============================================================================

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- SlicedString Behavior ---\n');

// Create a large string
const largeString = 'x'.repeat(100) + 'IMPORTANT' + 'y'.repeat(100);
log('Original string length', largeString.length);

// Taking a slice doesn't copy - it creates a SlicedString pointing to the original
const slice = largeString.substring(100, 109);
log('Slice value', slice);
log('Slice length', slice.length);

// The slice still references the entire original string internally
console.log('\n--- V8 Internal Representation ---\n');

console.log('Original string:');
%DebugPrint(largeString);
console.log('\nSliced string (references parent):');
%DebugPrint(slice);

console.log('\n--- Memory Retention Gotcha ---\n');

// This pattern can cause memory leaks: keeping a small slice of a huge string
function extractToken(hugeLogLine) {
  // Imagine hugeLogLine is 10MB of log data
  // We only want the first 32-char token
  return hugeLogLine.substring(0, 32);
}

const simulatedLog = 'TOKEN123'.padEnd(1000, ' ') + 'lots of other data...';
const token = extractToken(simulatedLog);

log('Token', token.trim());
console.log('The token SlicedString still holds a reference to the entire log line!');

console.log('\n--- Forcing a Copy ---\n');

// To break the reference, force V8 to create a new flat string
function extractTokenSafe(hugeLogLine) {
  // Concatenating with empty string forces flattening into a new string
  return hugeLogLine.substring(0, 32) + '';
}

// Alternative: use split, template literals, or Buffer conversion
const safeCopy = (' ' + token).substring(1);
log('Safe copy (no parent reference)', safeCopy.trim());

console.log('\nSliced (still referencing parent):');
%DebugPrint(token);
console.log('\nFlattened copy (independent):');
%DebugPrint(safeCopy);

console.log('\n--- When SlicedStrings Are Created ---\n');

// V8 only creates SlicedStrings when the slice is "large enough"
// Small slices get copied directly for efficiency
const short = 'Hello, World!';
const shortSlice = short.substring(0, 5);
log('Short slice', shortSlice);
console.log('Short slices are typically copied, not sliced');

// SlicedStrings are created when the slice length > ~13 characters
// and the parent string is sufficiently large
const mediumSlice = largeString.substring(50, 150);
log('Medium slice length', mediumSlice.length);

console.log('\nMedium slice (likely SlicedString):');
%DebugPrint(mediumSlice);
