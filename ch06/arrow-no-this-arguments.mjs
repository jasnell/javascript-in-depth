// Arrows lack [[Construct]], their own this, their own arguments, and a prototype.

const Arrow = () => {};
try {
  new Arrow(); // arrows have no [[Construct]] slot
} catch (err) {
  console.log(err.constructor.name + ': ' + err.message);
}

console.log('prototype' in Arrow); // false, no prototype property allocated

// No own `arguments`: reach outer arguments instead of shadowing them.
function outer() {
  const arrow = () => arguments.length; // resolves outer function's arguments
  return arrow();
}
console.log(outer(1, 2, 3)); // 3

// Arrow captures `this` from creation scope; a regular callback does not.
class Counter {
  count = 0;
  regular() {
    return function () { return this; }; // this decided at call time
  }
  arrow() {
    return () => this; // this captured as the Counter instance
  }
}
const c = new Counter();
console.log(c.regular().call(undefined)); // undefined (strict-mode module)
console.log(c.arrow()() === c);            // true
