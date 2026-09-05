// The four ways `this` is bound: default, implicit, explicit, and new.

function whoAmI() {
  return this;
}

// Default binding: a plain call. ES modules run in strict mode, so `this`
// is undefined here (in sloppy mode it would be globalThis).
console.log(whoAmI()); // undefined

// Implicit binding: called as a method, `this` is the receiver object.
const drawer = {
  label: 'taxes',
  describe() {
    return this.label;
  },
};
console.log(drawer.describe()); // 'taxes'

// Detaching the method loses the implicit binding.
const detached = drawer.describe;
try {
  detached(); // this is undefined -> reading .label throws
} catch (err) {
  console.log(`detached call: ${err.constructor.name}`); // TypeError
}

// Explicit binding: call / apply / bind set `this` directly.
console.log(drawer.describe.call({ label: 'receipts' })); // 'receipts'
console.log(drawer.describe.apply({ label: 'invoices' })); // 'invoices'
const bound = drawer.describe.bind({ label: 'contracts' });
console.log(bound()); // 'contracts'

// new binding: `this` is the freshly created instance.
function Drawer(label) {
  this.label = label;
}
const made = new Drawer('legal');
console.log(made.label); // 'legal'

// What happens to a primitive passed as `this` depends on the mode.
// In strict mode (this module) it is kept as-is; in sloppy mode it is boxed
// into a wrapper object. We show both accurately rather than assuming one.
function strictThis() {
  return [this === 1, typeof this];
}
console.log(strictThis.call(1)); // [true, 'number'] -- strict mode: not boxed

// A sloppy-mode function boxes the primitive into a wrapper object. The
// Function constructor builds a function whose body is not strict.
const sloppy = Function('return [this === 1, typeof this];');
console.log(sloppy.call(1)); // [false, 'object'] -- sloppy mode: boxed Number
