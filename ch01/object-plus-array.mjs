// Demonstrates how parsing context (expression vs statement) changes the meaning of {} + [].
// run: node object-plus-array.mjs

// In argument position {} is an object literal, so this is object + array coerced to strings.
console.log({} + []); // "[object Object]"

// eval parses at statement level: {} is an empty block, then +[] is unary plus on an array.
console.log(eval('{} + []')); // 0
