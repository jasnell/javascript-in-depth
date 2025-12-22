// Chapter 5: Objects - Property Descriptors
// See: "Property descriptors: controlling property behavior"
//
// Every property has hidden attributes that control whether it can be changed,
// deleted, or enumerated. Understanding these explains why assignments sometimes
// silently fail or properties disappear from loops.

console.log('--- Inspecting Property Descriptors ---\n');

// Properties from object literals have all attributes set to true
const drawer = { contents: 'tax documents' };
const desc = Object.getOwnPropertyDescriptor(drawer, 'contents');

console.log('Literal property descriptor:');
console.log('  value:', desc.value);
console.log('  writable:', desc.writable);       // true
console.log('  enumerable:', desc.enumerable);   // true
console.log('  configurable:', desc.configurable); // true

console.log('\n--- [[Writable]]: Can the Value Change? ---\n');

Object.defineProperty(drawer, 'serialNumber', {
  value: 'SN-12345',
  writable: false,      // Cannot be changed
  enumerable: true,
  configurable: true,
});

drawer.serialNumber = 'SN-99999';  // Silently fails (throws in strict mode)
console.log('After assignment, serialNumber:', drawer.serialNumber);  // Still 'SN-12345'

console.log('\n--- [[Enumerable]]: Does It Appear in Loops? ---\n');

Object.defineProperty(drawer, 'internalId', {
  value: 42,
  writable: true,
  enumerable: false,    // Hidden from iteration
  configurable: true,
});

console.log('Object.keys(drawer):', Object.keys(drawer));
// ['contents', 'serialNumber'] - internalId is hidden

console.log('drawer.internalId:', drawer.internalId);  // Still directly accessible

console.log('\n--- [[Configurable]]: Can It Be Deleted or Redefined? ---\n');

Object.defineProperty(drawer, 'permanent', {
  value: 'cannot delete',
  writable: true,
  enumerable: true,
  configurable: false,  // Descriptor is locked
});

const deleted = delete drawer.permanent;
console.log('delete drawer.permanent returned:', deleted);  // false
console.log('drawer.permanent:', drawer.permanent);  // Still there

try {
  Object.defineProperty(drawer, 'permanent', { writable: false });
} catch (e) {
  console.log('Redefining threw:', e.message);
}

console.log('\n--- Accessor Property Descriptors ---\n');

const dynamicDrawer = {
  _contents: [],
  get contents() { return `${this._contents.length} items`; },
  set contents(item) { this._contents.push(item); },
};

const accessorDesc = Object.getOwnPropertyDescriptor(dynamicDrawer, 'contents');
console.log('Accessor descriptor:');
console.log('  get:', typeof accessorDesc.get);   // 'function'
console.log('  set:', typeof accessorDesc.set);   // 'function'
console.log('  value:', accessorDesc.value);      // undefined (not present)

// Accessor properties have get/set instead of value/writable.
// Literal properties default all attributes to true, while
// Object.defineProperty() defaults them to false.
