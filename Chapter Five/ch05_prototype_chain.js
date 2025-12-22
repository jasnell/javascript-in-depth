// Chapter 5: Objects - Prototype Chain and Property Shadowing
// See: "Prototypical inheritance" and "The property lookup algorithm"
//
// Objects can inherit from other objects through the [[Prototype]] chain.
// Reading a property traverses the chain, but writing creates a new property
// directly on the object, shadowing the inherited one.

console.log('--- Shared Prototypes ---\n');

const drawerPrototype = {
  open() { console.log('Opening drawer'); },
  label: 'default',
};

// Both drawers share the same prototype object
const drawer1 = Object.create(drawerPrototype);
const drawer2 = Object.create(drawerPrototype);

drawer1.open();  // Found on prototype
drawer2.open();  // Same method, same prototype object

console.log('drawer1.label:', drawer1.label);  // 'default' (from prototype)
console.log('drawer2.label:', drawer2.label);  // 'default' (from prototype)

console.log('\n--- Property Shadowing ---\n');

// Writing creates a NEW property on the object itself, not on the prototype
drawer1.label = 'Tax Documents';

console.log('drawer1.label:', drawer1.label);  // 'Tax Documents' (own property)
console.log('drawer2.label:', drawer2.label);  // 'default' (still from prototype)
console.log('drawerPrototype.label:', drawerPrototype.label);  // Unchanged

// Object.hasOwn checks if the property is on the object itself
console.log('\ndrawer1 hasOwn "label":', Object.hasOwn(drawer1, 'label'));  // true
console.log('drawer2 hasOwn "label":', Object.hasOwn(drawer2, 'label'));  // false

console.log('\n--- The Prototype Chain ---\n');

// Chain: drawer1 -> drawerPrototype -> Object.prototype -> null
console.log('drawer1 prototype:', Object.getPrototypeOf(drawer1) === drawerPrototype);
console.log('drawerPrototype prototype:', Object.getPrototypeOf(drawerPrototype) === Object.prototype);
console.log('Object.prototype prototype:', Object.getPrototypeOf(Object.prototype));  // null

// drawer1 can use toString() from Object.prototype
console.log('drawer1.toString():', drawer1.toString());

console.log('\n--- Dynamic Prototype Modification ---\n');

// Changes to the prototype immediately affect all inheriting objects
drawerPrototype.close = function() { console.log('Closing drawer'); };

drawer1.close();  // Works immediately
drawer2.close();  // Both objects see the new method

console.log('\n--- Accessor Properties and this ---\n');

const accessorPrototype = {
  _value: 'prototype value',
  get value() { return this._value; },
  set value(v) { this._value = v; },
};

const obj = Object.create(accessorPrototype);
console.log('obj.value:', obj.value);  // 'prototype value'

// Writing through an accessor runs the setter with this = obj
obj.value = 'new value';

console.log('obj.value:', obj.value);  // 'new value'
console.log('obj._value:', obj._value);  // 'new value' (created on obj)
console.log('accessorPrototype._value:', accessorPrototype._value);  // Unchanged

// Reads traverse the chain. Writes to data properties create own properties.
// Writes to accessor properties call the setter with 'this' bound to the object.
