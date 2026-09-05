// Shows that every Symbol() is unique even with identical descriptions, and that symbol keys avoid property collisions.

const sym1 = Symbol('mySymbol');
const sym2 = Symbol('mySymbol');
const sym3 = Symbol('different');

console.log(sym1 === sym2);        // false: distinct symbols despite same description
console.log(sym1.description);     // 'mySymbol'
console.log(sym2.description);     // 'mySymbol'
console.log(sym3.description);     // 'different'

// The description is debug-only text; it does not participate in identity.
console.log(sym1 === Symbol('mySymbol')); // false

// Using a symbol as a property key guarantees no collision with string keys.
const META = Symbol('libraryMetadata');
const user = { id: 'user-42' };      // user's own string key
user[META] = { attachedBy: 'lib' };  // library metadata, cannot clash

console.log(user.id);                            // 'user-42' (untouched)
console.log(user[META]);                         // { attachedBy: 'lib' }
console.log(Object.keys(user));                  // ['id'] (symbol key is hidden)
console.log(Object.getOwnPropertySymbols(user)); // [ Symbol(libraryMetadata) ]
