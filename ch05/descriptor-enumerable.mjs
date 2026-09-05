// [[Enumerable]] controls whether a property shows up in iteration.

const drawer = { contents: 'tax documents' };

Object.defineProperty(drawer, 'internalId', {
  value: 12345,
  writable: false,
  enumerable: false, // hidden from enumeration
});

// Non-enumerable properties are skipped by Object.keys and for...in.
console.log(Object.keys(drawer)); // ['contents']
for (const key in drawer) {
  console.log(`for...in sees: ${key}`); // only 'contents'
}

// The property still exists and reads directly.
console.log(drawer.internalId); // 12345
console.log('internalId' in drawer); // true
