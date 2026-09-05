// Object.create links objects to a shared, live prototype object.

const drawerPrototype = {
  open() {
    console.log('Opening drawer');
  },
};

const drawer1 = Object.create(drawerPrototype);
const drawer2 = Object.create(drawerPrototype);

// Neither drawer owns open(); both find it on the shared prototype.
drawer1.open();
drawer2.open();

// The prototype is a live object: modifying it is seen immediately by
// every object that inherits from it.
drawerPrototype.close = function () {
  console.log('Closing drawer');
};
drawer1.close(); // 'Closing drawer'
drawer2.close(); // 'Closing drawer'

// An object's prototype can be swapped after creation with setPrototypeOf.
const basicDrawer = { type: 'basic' };
const secureDrawer = {
  type: 'secure',
  lock() {
    console.log('locked');
  },
};

const drawer = Object.create(basicDrawer);
console.log(drawer.type); // 'basic'
Object.setPrototypeOf(drawer, secureDrawer);
console.log(drawer.type); // 'secure'
drawer.lock(); // 'locked'
