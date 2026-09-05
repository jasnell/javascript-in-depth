// Functions are objects: they hold properties and have a prototype for `new`.

function Drawer(label) {
  this.label = label;
}

// You can attach properties to a function just like any other object.
Drawer.category = 'furniture';
Drawer.count = 0;
console.log(Drawer.category); // 'furniture'
console.log(typeof Drawer.prototype); // 'object' (used when called with new)

// A constructor function plus its prototype reproduces what `class` sugars over.
Drawer.prototype.open = function () {
  return `Opening ${this.label}`;
};

const d = new Drawer('Tax documents');
console.log(d.open()); // 'Opening Tax documents'

// new Drawer(...) is roughly: create an object with Drawer.prototype, then
// call Drawer with `this` bound to it.
const manual = Object.create(Drawer.prototype);
Drawer.call(manual, 'Legal');
console.log(manual.open()); // 'Opening Legal'
console.log(manual instanceof Drawer); // true
