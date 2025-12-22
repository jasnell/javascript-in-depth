// Chapter 4: Primitives - Symbols
// See: "Symbols guarantee unique property keys"
//
// Symbols are a primitive type that creates guaranteed-unique values.
// They're primarily used as property keys that can never collide with
// string properties, even if they have the same description.

console.log('--- Symbols Are Always Unique ---\n');

// Even with the same description, symbols are never equal
const sym1 = Symbol('mySymbol');
const sym2 = Symbol('mySymbol');

console.log('sym1 description:', sym1.description);  // 'mySymbol'
console.log('sym2 description:', sym2.description);  // 'mySymbol'
console.log('sym1 === sym2:', sym1 === sym2);        // false

console.log('\n--- Symbol Properties on Objects ---\n');

const drawer = {
  label: 'Tax Documents',
  [sym1]: 'hidden metadata',
};

// Symbol properties don't appear in normal enumeration
console.log('Object.keys(drawer):', Object.keys(drawer));  // ['label']
console.log('drawer[sym1]:', drawer[sym1]);  // 'hidden metadata'

// But you can find them if you know where to look
console.log('Object.getOwnPropertySymbols:', Object.getOwnPropertySymbols(drawer));

console.log('\n--- Global Symbol Registry ---\n');

// Regular symbols are always unique, even with the same description
const local1 = Symbol('app.id');
const local2 = Symbol('app.id');
console.log('local1 === local2:', local1 === local2);  // false

// Symbol.for() uses a global registry - same key returns the same symbol
const global1 = Symbol.for('app.id');
const global2 = Symbol.for('app.id');
console.log('global1 === global2:', global1 === global2);  // true

// You can retrieve the key from a registered symbol
console.log('Symbol.keyFor(global1):', Symbol.keyFor(global1));  // 'app.id'
console.log('Symbol.keyFor(local1):', Symbol.keyFor(local1));    // undefined

console.log('\n--- Why Use Symbols? ---\n');

// 1. Library authors can add properties without colliding with user code
const libraryData = Symbol('library.internal');

function addLibraryMetadata(obj) {
  obj[libraryData] = { version: '1.0', timestamp: Date.now() };
  return obj;
}

const userObj = { name: 'Alice', id: 123 };
addLibraryMetadata(userObj);

console.log('User sees:', Object.keys(userObj));  // ['name', 'id']
console.log('Library can access:', userObj[libraryData]);

// 2. Symbol properties can't be accidentally accessed without the symbol
// userObj['library.internal'] would be undefined
// userObj.libraryData would also be undefined

// Symbols guarantee collision-free property keys. They don't appear in
// normal enumeration, and you need the actual symbol reference to access
// them. This makes them ideal for library internals and metadata.
