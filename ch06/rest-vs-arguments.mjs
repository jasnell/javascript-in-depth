// Rest parameters are a real array with no magical binding; prefer them over arguments.

// Rest parameter: an actual Array, so array methods work directly.
function sum(...args) {
  console.log(Array.isArray(args)); // true
  return args.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3)); // 6

// arguments is only array-like: it has length but not Array methods.
function legacySum() {
  console.log(Array.isArray(arguments));         // false
  console.log(typeof arguments.reduce);          // undefined
  return Array.prototype.reduce.call(arguments, (t, n) => t + n, 0);
}
console.log(legacySum(1, 2, 3)); // 6

// In strict mode (every module is strict) arguments does not track named params.
function example(a) {
  const before = [a, arguments[0]];
  arguments[0] = 99;
  const afterArg = [a, arguments[0]]; // a stays 1, no live binding
  a = 42;
  const afterName = [a, arguments[0]]; // arguments[0] stays 99
  return { before, afterArg, afterName };
}
console.log(example(1)); // before [1,1], afterArg [1,99], afterName [42,99]

// A rest parameter must be last in the list.
const label = (prefix, ...rest) => `${prefix}: ${rest.join(',')}`;
console.log(label('items', 1, 2, 3)); // items: 1,2,3
