// [[Configurable]] controls whether a property can be deleted or redefined.

const drawer = {};

Object.defineProperty(drawer, 'serialNumber', {
  value: 'SN-12345',
  writable: false, // value cannot change
  enumerable: true, // shows up in lists
  configurable: false, // descriptor is locked
});

// In strict mode, delete on a non-configurable property throws.
try {
  delete drawer.serialNumber;
} catch (err) {
  console.log(`delete rejected: ${err.constructor.name}`); // TypeError
}
console.log(drawer.serialNumber); // 'SN-12345' (still present)

// Redefining a non-configurable property's attributes also throws.
// (The manuscript wrote `writable: true;` with a stray semicolon inside
// the object literal; a valid literal uses a comma or nothing.)
try {
  Object.defineProperty(drawer, 'serialNumber', {
    writable: true,
  });
} catch (err) {
  console.log(`redefine rejected: ${err.constructor.name}`); // TypeError
}
