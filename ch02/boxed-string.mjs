// Concept: string primitive vs Boxed String (new String) - why to avoid the boxed form
const primitive = 'hello';
const boxed = new String('hello');

console.log(typeof primitive); // "string"
console.log(typeof boxed);     // "object"

console.log(primitive === 'hello'); // true
console.log(boxed === 'hello');     // false (object identity, not value)
console.log(boxed == 'hello');      // true  (coerced back to a primitive)
console.log(boxed.valueOf() === 'hello'); // true

// Methods work on primitives via transient auto-boxing; the boxed object is just overhead.
console.log(primitive.toUpperCase()); // HELLO
