// A hand-written model of how JavaScript walks the prototype chain for a read.

function prototypeChainLookup(object, name) {
  let current = object; // start at the object itself
  while (current !== null) {
    const descriptor = Object.getOwnPropertyDescriptor(current, name);
    if (descriptor != null) {
      if (typeof descriptor.get === 'function') {
        return descriptor.get.call(object); // accessor: call with original receiver
      }
      return descriptor.value; // data property
    }
    current = Object.getPrototypeOf(current); // climb one link
  }
  return undefined; // reached the end (null) without finding it
}

const drawerPrototype = {
  _label: 'default',
  get label() {
    return this._label;
  },
};
const drawer = Object.create(drawerPrototype);
drawer.serial = 'SN-1';

console.log(prototypeChainLookup(drawer, 'serial')); // 'SN-1' (own data property)
console.log(prototypeChainLookup(drawer, 'label')); // 'default' (getter on prototype, this === drawer)
console.log(prototypeChainLookup(drawer, 'missing')); // undefined

// Matches the built-in lookup.
console.log(drawer.label); // 'default'
