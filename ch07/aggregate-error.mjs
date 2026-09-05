// AggregateError holds MULTIPLE errors at once, as from Promise.any.

// Promise.any resolves on the first success; if ALL reject it rejects
// with a single AggregateError whose .errors holds every failure.
const attempts = [
  Promise.reject(new Error('primary endpoint down')),
  Promise.reject(new Error('backup1 timed out')),
  Promise.reject(new Error('backup2 refused')),
];

try {
  await Promise.any(attempts);
} catch (e) {
  console.log(e instanceof AggregateError); // true
  console.log(e.errors.length);             // 3
  for (const inner of e.errors) {
    console.log('-', inner.message);
  }
}

// You can also construct one directly to report several failures together.
const collected = new AggregateError(
  [new RangeError('row 2 out of range'), new TypeError('row 5 wrong type')],
  'validation failed'
);
console.log(collected.message, '->', collected.errors.map((x) => x.name));
