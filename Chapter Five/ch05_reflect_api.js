// Chapter 5: Objects & Prototypes - The Reflect API
// See: "Reflect" and "Meta-programming"
//
// The Reflect API provides methods for interceptable JavaScript operations.
// Each Reflect method corresponds to a Proxy trap, making them work together.
// Reflect methods return success/failure instead of throwing, making them
// easier to use for meta-programming.
//
// Run with: node ch05_reflect_api.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Reflect.get and Reflect.set ---\n');

const obj = { x: 10, y: 20 };

// Like obj.x but callable as a function
log('Reflect.get(obj, "x")', Reflect.get(obj, 'x'));

// Returns boolean success, doesn't throw
log('Reflect.set(obj, "z", 30)', Reflect.set(obj, 'z', 30));
log('obj.z after set', obj.z);

// With a receiver for getters/setters
const withGetter = {
  _value: 100,
  get value() {
    return this._value;
  }
};

const receiver = { _value: 999 };
log('\nGetter on original', Reflect.get(withGetter, 'value'));
log('Getter with receiver', Reflect.get(withGetter, 'value', receiver));

console.log('\n--- Reflect.has (like "in" operator) ---\n');

const proto = { inherited: true };
const child = Object.create(proto);
child.own = true;

log('Reflect.has(child, "own")', Reflect.has(child, 'own'));
log('Reflect.has(child, "inherited")', Reflect.has(child, 'inherited'));
log('Reflect.has(child, "missing")', Reflect.has(child, 'missing'));

console.log('\n--- Reflect.deleteProperty ---\n');

const toDelete = { a: 1, b: 2 };
Object.defineProperty(toDelete, 'c', { value: 3, configurable: false });

log('Delete "a" (configurable)', Reflect.deleteProperty(toDelete, 'a'));
log('Delete "c" (non-configurable)', Reflect.deleteProperty(toDelete, 'c'));
log('Delete "missing"', Reflect.deleteProperty(toDelete, 'missing'));
log('Object after deletes', toDelete);

console.log('\n--- Reflect.defineProperty ---\n');

const target = {};

// Returns boolean instead of throwing or returning the object
const success1 = Reflect.defineProperty(target, 'x', {
  value: 42,
  writable: true,
  configurable: true
});
log('Define "x" succeeded', success1);

// Try to redefine a non-configurable property
Reflect.defineProperty(target, 'y', { value: 1, configurable: false });
const success2 = Reflect.defineProperty(target, 'y', { value: 2 });
log('Redefine non-configurable "y"', success2);

console.log('\n--- Reflect.getOwnPropertyDescriptor ---\n');

const described = { regular: 1 };
Object.defineProperty(described, 'special', {
  value: 2,
  enumerable: false,
  writable: false
});

log('regular', Reflect.getOwnPropertyDescriptor(described, 'regular'));
log('special', Reflect.getOwnPropertyDescriptor(described, 'special'));
log('missing', Reflect.getOwnPropertyDescriptor(described, 'missing'));

console.log('\n--- Reflect.ownKeys ---\n');

const sym = Symbol('mySymbol');
const mixed = {
  string: 1,
  [sym]: 2
};
Object.defineProperty(mixed, 'nonEnum', { value: 3, enumerable: false });

// ownKeys returns ALL own keys: strings, symbols, enumerable and non-enumerable
log('Reflect.ownKeys', Reflect.ownKeys(mixed));
log('Object.keys (enumerable only)', Object.keys(mixed));
log('Object.getOwnPropertyNames', Object.getOwnPropertyNames(mixed));
log('Object.getOwnPropertySymbols', Object.getOwnPropertySymbols(mixed));

console.log('\n--- Reflect.getPrototypeOf / setPrototypeOf ---\n');

const baseProto = { base: true };
const derived = Object.create(baseProto);

log('Get prototype', Reflect.getPrototypeOf(derived) === baseProto);

const newProto = { newBase: true };
log('Set prototype succeeded', Reflect.setPrototypeOf(derived, newProto));
log('Verify new prototype', Reflect.getPrototypeOf(derived) === newProto);

// Non-extensible objects can't have prototype changed
const frozen = Object.freeze({ x: 1 });
log('Set prototype on frozen', Reflect.setPrototypeOf(frozen, {}));

console.log('\n--- Reflect.preventExtensions / isExtensible ---\n');

const extensible = { x: 1 };
log('Initially extensible', Reflect.isExtensible(extensible));

Reflect.preventExtensions(extensible);
log('After preventExtensions', Reflect.isExtensible(extensible));

// Can still modify existing properties
extensible.x = 2;
log('Modified existing property', extensible.x);

// But can't add new ones
log('Add new property', Reflect.set(extensible, 'y', 3));
log('Object after failed add', extensible);

console.log('\n--- Reflect.apply ---\n');

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'Alice' };
log('Reflect.apply', Reflect.apply(greet, person, ['Hello', '!']));

// Safer than Function.prototype.apply.call
// (which could be overridden)
const safeApply = Reflect.apply;
log('Stored reference works', safeApply(greet, person, ['Hi', '?']));

console.log('\n--- Reflect.construct ---\n');

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Like new Point(10, 20)
const p1 = Reflect.construct(Point, [10, 20]);
log('Constructed Point', p1);
log('Is instance of Point', p1 instanceof Point);

// Can specify a different new.target
class SubPoint extends Point {}
const p2 = Reflect.construct(Point, [5, 5], SubPoint);
log('With different new.target', p2);
log('Is instance of SubPoint', p2 instanceof SubPoint);

console.log('\n--- Using Reflect with Proxy ---\n');

// Reflect methods are designed to work with Proxy traps
const logged = new Proxy({ value: 42 }, {
  get(target, prop, receiver) {
    console.log(`  [GET] ${String(prop)}`);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(`  [SET] ${String(prop)} = ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
});

console.log('Accessing proxy:');
log('Read value', logged.value);
logged.value = 100;
log('After write', logged.value);

console.log('\n--- Reflect vs Object Methods ---\n');

console.log('Key differences:');
console.log('  - Reflect methods return success boolean (not throw/return object)');
console.log('  - Reflect.set/get handle receivers properly');
console.log('  - Reflect methods match Proxy trap signatures exactly');
console.log('  - Object methods sometimes coerce, Reflect throws on non-objects');

// Example: Object.keys vs Reflect.ownKeys
log('\nObject.keys coerces strings', Object.keys('hi'));
try {
  Reflect.ownKeys('hi');
} catch (e) {
  log('Reflect.ownKeys throws', e.message);
}

console.log('\n--- Practical: Safe Property Access ---\n');

function safeGet(obj, path) {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current == null) return undefined;
    if (!Reflect.has(current, part)) return undefined;
    current = Reflect.get(current, part);
  }

  return current;
}

const nested = { a: { b: { c: 42 } } };
log('safeGet("a.b.c")', safeGet(nested, 'a.b.c'));
log('safeGet("a.b.missing")', safeGet(nested, 'a.b.missing'));
log('safeGet("a.missing.c")', safeGet(nested, 'a.missing.c'));
