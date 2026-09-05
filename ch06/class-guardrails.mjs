// Classes enforce new, keep methods non-enumerable, split fields vs accessors, and hide #fields.

class Widget {}
try {
  Widget(); // classes require new
} catch (err) {
  console.log(err.constructor.name + ': ' + err.message);
}

// Class methods are non-enumerable; hand-written prototype methods are not.
class Modern { method() {} }
function Classic() {}
Classic.prototype.method = function () {};
console.log(Object.keys(Modern.prototype));  // []
console.log(Object.keys(Classic.prototype)); // [ 'method' ]

// A field is an own property per instance; an accessor lives on the prototype.
class Example {
  field = 'value';
  get computed() { return this.field.toUpperCase(); }
  set computed(val) { this.field = val.toLowerCase(); }
}
const e = new Example();
console.log(Object.getOwnPropertyDescriptor(e, 'field'));
console.log(Object.getOwnPropertyDescriptor(e, 'computed')); // undefined
console.log(Object.getOwnPropertyDescriptor(Example.prototype, 'computed'));

// Private fields are genuinely inaccessible from outside the class body.
class Vault {
  #secret = 'hidden';
  reveal() { return this.#secret; }
}
console.log(new Vault().reveal()); // hidden
