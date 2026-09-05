// The Function constructor builds code from strings and always runs in global scope.

const add = new Function('a', 'b', 'return a + b');
console.log(add(2, 3)); // 5

// It cannot see local variables from where it was created.
function createAdder(x) {
  return new Function('y', 'return x + y'); // x is not captured
}
try {
  createAdder(5)(3);
} catch (err) {
  console.log(err.constructor.name + ': ' + err.message); // ReferenceError: x is not defined
}

// Curiosity: Function.prototype is the one built-in prototype that is callable.
console.log(Function.prototype()); // undefined, no error
try {
  Object.prototype(); // not callable
} catch (err) {
  console.log(err.constructor.name); // TypeError
}
