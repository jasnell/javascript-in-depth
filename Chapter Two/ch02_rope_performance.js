// Chapter 2: Strings - Rope vs Flat String Performance
// See: "V8's string representations" and "String concatenation"
//
// V8 uses a rope-like structure (ConsStrings) for concatenation, deferring
// the expensive flattening operation. This demonstrates when flattening
// happens and its performance impact.
//
// Run with: node --allow-natives-syntax ch02_rope_performance.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Rope Structure (Deferred Concatenation) ---\n');

// Build a rope through repeated concatenation
let rope = 'start';
for (let i = 0; i < 5; i++) {
  rope = rope + '-part' + i;
}

log('Rope value', rope);

console.log('\nRope structure (ConsString tree):');
%DebugPrint(rope);

console.log('\n--- Operations That Trigger Flattening ---\n');

// These operations require character-level access, forcing flattening:

// 1. Indexing into the string
const firstChar = rope[0];
log('After indexing, char', firstChar);

console.log('\nAfter character access (may be flattened):');
%DebugPrint(rope);

// 2. Building a fresh rope
let rope2 = 'a';
for (let i = 0; i < 10; i++) {
  rope2 = rope2 + 'b';
}

console.log('\nFresh rope before any access:');
%DebugPrint(rope2);

// slice() on a rope may flatten it
const sliced = rope2.slice(0, 5);

console.log('\nAfter slice():');
%DebugPrint(rope2);

console.log('\n--- Performance Comparison ---\n');

// Building a rope is O(1) per concatenation
// Flattening is O(n) where n is total length

function buildRope(size) {
  let result = '';
  for (let i = 0; i < size; i++) {
    result = result + 'x';
  }
  return result;
}

function buildWithArray(size) {
  const parts = [];
  for (let i = 0; i < size; i++) {
    parts.push('x');
  }
  return parts.join('');
}

const SIZE = 10000;

console.log(`Building ${SIZE} character string...\n`);

const start1 = performance.now();
const ropeResult = buildRope(SIZE);
const end1 = performance.now();
log('Rope build time', `${(end1 - start1).toFixed(3)}ms`);

const start2 = performance.now();
const arrayResult = buildWithArray(SIZE);
const end2 = performance.now();
log('Array.join time', `${(end2 - start2).toFixed(3)}ms`);

console.log('\n--- When Ropes Become Expensive ---\n');

// Deep rope trees can have overhead on access
function buildDeepRope(depth) {
  let s = 'x';
  for (let i = 0; i < depth; i++) {
    s = s + 'y';  // Each creates a new ConsString node
  }
  return s;
}

const deepRope = buildDeepRope(100);

// First character access must traverse the tree
const start3 = performance.now();
for (let i = 0; i < 10000; i++) {
  deepRope[50];  // Access middle character
}
const end3 = performance.now();

// After flattening, access is O(1)
const flat = deepRope + '';  // Force flatten
const start4 = performance.now();
for (let i = 0; i < 10000; i++) {
  flat[50];
}
const end4 = performance.now();

log('Rope access time (10k iterations)', `${(end3 - start3).toFixed(3)}ms`);
log('Flat access time (10k iterations)', `${(end4 - start4).toFixed(3)}ms`);

console.log('\n--- Practical Guidelines ---\n');

console.log('For building strings in loops:');
console.log('  - Few iterations: += is fine (rope overhead is minimal)');
console.log('  - Many iterations: Array.join() avoids deep rope trees');
console.log('  - Template literals are often optimized differently');
console.log('\nRopes are flattened automatically when needed - you rarely');
console.log('need to optimize this manually unless profiling shows issues.');
