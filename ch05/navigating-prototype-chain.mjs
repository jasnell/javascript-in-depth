// getPrototypeOf, `in`, and Object.hasOwn inspect the chain differently.

const drawerPrototype = { open() {} };
const drawer = Object.create(drawerPrototype);

// getPrototypeOf returns the [[Prototype]] link.
console.log(Object.getPrototypeOf(drawer) === drawerPrototype); // true
console.log(Object.getPrototypeOf(drawerPrototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype) === null); // true (chain end)

// `in` checks the whole chain.
console.log('open' in drawer); // true (inherited)
console.log('toString' in drawer); // true (from Object.prototype)
console.log('label' in drawer); // false

// Object.hasOwn checks only the object itself.
console.log(Object.hasOwn(drawer, 'open')); // false (open is on the prototype)
drawer.label = 'Tax documents';
console.log(Object.hasOwn(drawer, 'label')); // true (own property)
