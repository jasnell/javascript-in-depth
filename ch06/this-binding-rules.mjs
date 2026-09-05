// The four this-binding rules for regular functions, in precedence order.

// new binding: this is the freshly created object.
function Box(v) { this.v = v; }
console.log(new Box(1).v); // 1

// Explicit binding: call/apply set this directly.
function identify() {
  return this.label;
}
console.log(identify.call({ label: 'Tax documents' }));  // Tax documents
console.log(identify.apply({ label: 'Receipts' }, []));  // Receipts

// Implicit binding: the object before the dot becomes this. The method name
// defined on the object and the name used to call it match.
const cabinet = {
  label: 'Main cabinet',
  identify() {
    return this.label;
  }
};
console.log(cabinet.identify()); // Main cabinet

// Default binding: no call-site object. In a strict-mode module this is undefined.
console.log(typeof this === 'undefined' ? 'default this is undefined' : this);
