// Contrasts || (falsy fallback) with ?? (nullish-only fallback) and the ||= &&= ??= assignment shortcuts.

// || falls back on ANY falsy value, which is wrong when 0 or '' are valid.
console.log(0 || 42);          // 42  (0 discarded, often a bug)
console.log('' || 'default');  // 'default'

// ?? only falls back on null or undefined, keeping other falsy values.
console.log(0 ?? 42);          // 0   (0 is a real value, kept)
console.log('' ?? 'default');  // ''  (empty string kept)
console.log(null ?? 'backup'); // 'backup'
console.log(undefined ?? 'backup'); // 'backup'

// Logical assignment operators assign only when the guard condition holds.
let a = '';
a ||= 'Anonymous';            // assigns because '' is falsy
console.log(a);               // 'Anonymous'

let b = 'Sam';
b &&= 'Present';              // assigns because 'Sam' is truthy
console.log(b);               // 'Present'

let c = 0;
c ??= 99;                     // does NOT assign: 0 is neither null nor undefined
console.log(c);               // 0

let d;
d ??= 99;                     // assigns because d is undefined
console.log(d);               // 99
