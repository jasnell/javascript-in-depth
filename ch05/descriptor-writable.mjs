// [[Writable]] controls whether a data property's value can be reassigned.

const drawer = { contents: 'tax documents' };

// Object.defineProperty gives fine-grained control over attributes.
Object.defineProperty(drawer, 'internalId', {
  value: 12345,
  writable: false, // valid object literal (the manuscript had a stray semicolon here)
});

drawer.contents = 'invoices'; // writable data property: change succeeds

// ES modules always run in strict mode, so a write to a non-writable
// property throws rather than failing silently (sloppy mode).
try {
  drawer.internalId = 54321;
} catch (err) {
  console.log(`strict-mode write rejected: ${err.constructor.name}`); // TypeError
}

console.log(drawer.contents); // 'invoices' (changed)
console.log(drawer.internalId); // 12345 (unchanged)
