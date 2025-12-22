// Chapter 2: Strings - ConsStrings and String Concatenation
// See: "V8's string implementation" and the discussion of ConsStrings
//
// Run with: node --allow-natives-syntax ch02_string_concatenation.js
//
// When you concatenate strings, V8 doesn't always copy immediately. Instead,
// it creates a ConsString that holds references to both parts and defers the
// actual copying until the string needs to be "flattened."
//
// =============================================================================
// READING V8's %DebugPrint OUTPUT FOR STRINGS:
// =============================================================================
//
// Look for the string type in angle brackets:
//
//   <String[5]: "Hello">
//     - SeqOneByteString: Simple ASCII string stored contiguously
//     - SeqTwoByteString: UTF-16 string (contains non-ASCII)
//
//   <ConsString[11]: "Hello World">
//     - Concatenated string stored as a tree of references
//     - Shows "first:" and "second:" pointing to the component strings
//     - Not yet copied into a single buffer
//
//   <SlicedString[5]>
//     - A substring that references a portion of a parent string
//     - Shows "parent:" pointing to the original string
//
//   <ThinString[...]>
//     - Wrapper that points to the actual string after internalization
//
// After certain operations (like indexing), V8 may "flatten" a ConsString
// into a SeqString. Run the demo to see this transition.
// =============================================================================

console.log('--- Strings Are Immutable ---\n');

// Every string operation creates a new string object
let str = 'Hello';
const original = str;
str += ' World';

console.log('original:', original);  // 'Hello' - unchanged
console.log('str:', str);            // 'Hello World' - new string

console.log('\n--- V8 ConsString Optimization ---\n');

// Concatenation creates a ConsString internally
const part1 = 'Hello';
const part2 = ' World';
const combined = part1 + part2;

console.log('part1 internal representation:');
%DebugPrint(part1);

console.log('\npart2 internal representation:');
%DebugPrint(part2);

// Notice: combined shows as ConsString with first/second pointing to parts
console.log('\ncombined (ConsString) internal representation:');
%DebugPrint(combined);

console.log('\n--- ConsString Flattening ---\n');

// Certain operations force the ConsString to flatten into a single buffer.
// Accessing characters by index is one way this can happen.
const indexed = combined[0];
console.log('After indexing, combined may be flattened:');
%DebugPrint(combined);

console.log('\n--- Building Longer Chains ---\n');

// Multiple concatenations create chains of ConsStrings
let chain = 'a';
chain += 'b';
chain += 'c';
chain += 'd';

console.log('Chain of concatenations:');
%DebugPrint(chain);

console.log('\n--- When Concatenation Becomes Costly ---\n');

// Simple concatenation in loops is well-optimized by modern V8.
// The real problem is recursive or deeply nested concatenation that
// creates trees of ConsStrings which eventually must all be flattened.

function buildStringRecursive(depth) {
  if (depth === 0) return 'x';
  return buildStringRecursive(depth - 1) + buildStringRecursive(depth - 1);
}

// Using a small depth so this doesn't hang
const tree = buildStringRecursive(4);
console.log('Recursive string tree (depth 4):');
console.log('Result:', tree);
console.log('Length:', tree.length);
%DebugPrint(tree);

console.log('\n--- Template Literals ---\n');

// Template literals work similarly to concatenation
const userName = 'Alice';
const greeting = `Hello, ${userName}!`;

console.log('Template literal result:');
%DebugPrint(greeting);

// V8's ConsString optimization defers the actual byte copying until
// the string is accessed in ways that require a flat representation.
// For simple loops, V8 handles += efficiently. Problems mainly arise
// with recursive concatenation that creates deep ConsString trees.
