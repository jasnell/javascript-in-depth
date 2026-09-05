// A closure as a data structure: each factory call gets its own private Context.

function makeCounter(start = 0) {
  let count = start; // lives in the Context captured by the returned closures
  return {
    increment() { return ++count; },
    decrement() { return --count; },
    value() { return count; }
  };
}

const a = makeCounter();
const b = makeCounter(10);

console.log(a.increment()); // 1
console.log(a.increment()); // 2
console.log(b.decrement()); // 9
console.log(a.value());     // 2, independent of b
console.log(b.value());     // 9

// The count is unreachable except through the returned methods.
console.log(Object.keys(a)); // [ 'increment', 'decrement', 'value' ]
