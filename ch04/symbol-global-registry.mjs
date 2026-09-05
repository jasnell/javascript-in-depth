// Shows that Symbol.for() shares one symbol per key through the global registry, unlike plain Symbol().

// Plain symbols are always unique, even with the same description.
const local1 = Symbol('app.id');
const local2 = Symbol('app.id');
console.log(local1 === local2); // false

// Symbol.for looks the key up in the process-wide registry and reuses it.
const global1 = Symbol.for('app.id');
const global2 = Symbol.for('app.id');
console.log(global1 === global2); // true

// Registry symbols are not the same as plain symbols with the same description.
console.log(global1 === local1); // false

// Symbol.keyFor recovers the registry key (undefined for non-registry symbols).
console.log(Symbol.keyFor(global1)); // 'app.id'
console.log(Symbol.keyFor(local1));  // undefined
