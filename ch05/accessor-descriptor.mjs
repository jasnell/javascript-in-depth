// Accessor properties have get/set in their descriptor instead of value/writable.

const drawer = {
  _contents: 'tax documents',
  get contents() {
    return this._contents.toUpperCase();
  },
  set contents(value) {
    this._contents = `${value}`;
  },
};

const descriptor = Object.getOwnPropertyDescriptor(drawer, 'contents');
console.log(typeof descriptor.get);   // 'function'
console.log(typeof descriptor.set);   // 'function'
console.log(descriptor.value);        // undefined (accessors have no value)
console.log(descriptor.writable);     // undefined (accessors have no writable)
console.log(descriptor.enumerable);   // true (literal default)
console.log(descriptor.configurable); // true (literal default)

// The same accessor can be defined through Object.defineProperty.
const drawer2 = { _contents: 'tax documents' };
Object.defineProperty(drawer2, 'contents', {
  get() {
    return this._contents.toUpperCase();
  },
  set(value) {
    this._contents = `${value}`;
  },
  enumerable: true,
  configurable: true,
});
console.log(drawer2.contents); // 'TAX DOCUMENTS'
