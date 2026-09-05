// Arrays are objects with integer-indexed properties, a live length, and a prototype.

const drawers = ['invoices', 'receipts', 'contracts'];
console.log(drawers[0]); // 'invoices'
console.log(drawers.length); // 3 (maintained automatically)

// Indexed properties behave like ordinary properties and can even be inherited.
const array1 = new Array(1); // length 1
array1[0] = 'hello';

const array2 = new Array(2); // length 2
array2[1] = 'there';

Object.setPrototypeOf(array2, array1); // array1 becomes array2's prototype
console.log(array2[0]); // 'hello' (inherited index 0 from array1)
console.log(array2[1]); // 'there' (own)

// length reflects only the array's own indexed elements.
console.log(array2.length); // 2

// Array methods come from the shared Array.prototype.
console.log(Object.getPrototypeOf([]) === Array.prototype); // true
console.log(typeof [].push, typeof [].map); // 'function' 'function'
