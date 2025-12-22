// Chapter 4: Primitives - Nullish Coalescing vs Logical OR
// See: "Boolean operators: !!, &&, ||, ??"
//
// The || operator returns the first truthy value, treating ALL falsy values
// as "missing." The ?? operator only treats null and undefined as missing,
// preserving valid falsy values like 0 and empty string.

console.log('--- The Problem with || for Defaults ---\n');

// || returns the first truthy value, which means 0, '', and false
// all trigger the fallback when they might be intentional values

console.log("0 || 42:", 0 || 42);           // 42 (but 0 might be valid!)
console.log("'' || 'default':", '' || 'default');  // 'default' (but '' might be valid!)
console.log("false || true:", false || true);      // true (but false might be intentional!)

// Real bug: user explicitly sets volume to 0, gets default instead
function setVolumeBroken(level) {
  const volume = level || 50;  // "Default to 50 if not provided"
  return `Volume: ${volume}`;
}
console.log("\nsetVolumeBroken(0):", setVolumeBroken(0));    // Volume: 50 (bug!)
console.log("setVolumeBroken(75):", setVolumeBroken(75));   // Volume: 75

console.log('\n--- Nullish Coalescing (??) ---\n');

// ?? only treats null and undefined as "missing"
// All other falsy values are preserved

console.log("0 ?? 42:", 0 ?? 42);           // 0 (preserved)
console.log("'' ?? 'default':", '' ?? 'default');  // '' (preserved)
console.log("false ?? true:", false ?? true);      // false (preserved)
console.log("null ?? 'backup':", null ?? 'backup');      // 'backup'
console.log("undefined ?? 'backup':", undefined ?? 'backup'); // 'backup'

// Fixed: respects 0 as a valid volume setting
function setVolumeFixed(level) {
  const volume = level ?? 50;
  return `Volume: ${volume}`;
}
console.log("\nsetVolumeFixed(0):", setVolumeFixed(0));    // Volume: 0 (correct!)
console.log("setVolumeFixed(75):", setVolumeFixed(75));   // Volume: 75

console.log('\n--- Logical Assignment Operators ---\n');

let a = '';
let b = '';
let c = '';

a ||= 'fallback';   // Assigns if a is falsy
b &&= 'fallback';   // Assigns if b is truthy
c ??= 'fallback';   // Assigns if c is null/undefined

console.log("'' ||= 'fallback':", a);   // 'fallback' ('' is falsy)
console.log("'' &&= 'fallback':", b);   // '' ('' is falsy, no assignment)
console.log("'' ??= 'fallback':", c);   // '' ('' is not null/undefined)

console.log('\n--- Short-Circuit Behavior ---\n');

// Both || and ?? short-circuit: the right side isn't evaluated if unnecessary
let sideEffect = false;
const getValue = () => { sideEffect = true; return 'computed'; };

console.log("'exists' ?? getValue():", 'exists' ?? getValue());
console.log('Side effect occurred?', sideEffect);  // false - getValue never called

// Use ?? when 0, '', or false are meaningful values in your application.
// Use || only when you genuinely want ALL falsy values to trigger the fallback.
