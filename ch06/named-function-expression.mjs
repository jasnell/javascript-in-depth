// A named function expression binds its name only inside its own body.

let factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // self-reference survives reassignment of `factorial`
};

const original = factorial;
factorial = null;
console.log(original(5)); // 120

// The inner name never leaked to the enclosing scope.
console.log(typeof fact === 'undefined' ? 'fact is not defined outside' : fact);
