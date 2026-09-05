// Native error constructors and instanceof-based classification.

// Each native type differs only in its name; all extend Error.
const samples = [
  new Error('base error'),
  new TypeError('operation on incompatible type'),
  new RangeError('numeric value out of range'),
  new ReferenceError('variable does not exist'),
  new SyntaxError('violates syntax rules'),
  new URIError('malformed URI'),
];

for (const err of samples) {
  // Every native error is also an Error, but has its own name.
  console.log(`${err.name}: instanceof Error = ${err instanceof Error}`);
}

// instanceof lets you branch on category, even though language-rule
// distinctions (TypeError vs RangeError) rarely guide recovery.
function classify(err) {
  if (err instanceof TypeError) return 'type violation';
  if (err instanceof RangeError) return 'range violation';
  if (err instanceof Error) return 'generic error';
  return 'thrown non-error value'; // throw can send any value
}

console.log(classify(new TypeError('x')));
console.log(classify(new RangeError('x')));
console.log(classify('just a string'));
