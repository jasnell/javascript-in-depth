// A method found on a prototype runs with `this` bound to the calling object.

const drawerPrototype = {
  open() {
    console.log(`Opening the ${this.label} drawer`);
    this.isOpen = true; // writes land on the instance, not the prototype
  },
};

const drawer1 = Object.create(drawerPrototype);
drawer1.label = 'tax documents';

const drawer2 = Object.create(drawerPrototype);
drawer2.label = 'receipts';

drawer1.open(); // 'Opening the tax documents drawer'
drawer2.open(); // 'Opening the receipts drawer'

// One shared method, per-instance state via `this`.
console.log(drawer1.isOpen, drawer2.isOpen); // true true
console.log(Object.hasOwn(drawerPrototype, 'isOpen')); // false
