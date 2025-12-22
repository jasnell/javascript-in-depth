// Chapter 6: Functions - The new Keyword
// See: "What new actually does" and "The four steps of new"
//
// The new operator performs four specific steps. Understanding these
// explains constructor behavior, prototype linkage, and what happens
// when a constructor returns a value.

console.log('--- What new Actually Does ---\n');

function Gadget(name) {
  this.name = name;
}
Gadget.prototype.identify = function() {
  return `Gadget: ${this.name}`;
};

// The new operator performs these four steps:
function simulateNew(Constructor, ...args) {
  // Step 1: Create a new ordinary object
  // Step 2: Link its [[Prototype]] to Constructor.prototype
  const obj = Object.create(Constructor.prototype);

  // Step 3: Call the constructor with 'this' bound to the new object
  const result = Constructor.call(obj, ...args);

  // Step 4: If the constructor returns an object, use it; otherwise use obj
  return result instanceof Object ? result : obj;
}

const g1 = new Gadget('phone');
const g2 = simulateNew(Gadget, 'tablet');

console.log('Using new:', g1.identify());
console.log('Using simulateNew:', g2.identify());
console.log('Same prototype?', Object.getPrototypeOf(g1) === Object.getPrototypeOf(g2));

console.log('\n--- Step 4: Constructor Return Values ---\n');

// If the constructor returns an object, it replaces the created object
function ReturnsObject() {
  this.a = 1;
  return { b: 2 };  // This object is returned instead
}

// If the constructor returns a primitive, it's ignored
function ReturnsPrimitive() {
  this.a = 1;
  return 42;  // Ignored - the created object is returned
}

console.log('new ReturnsObject():', new ReturnsObject());  // { b: 2 }
console.log('new ReturnsPrimitive():', new ReturnsPrimitive());  // { a: 1 }

console.log('\n--- Detecting new with new.target ---\n');

// new.target tells you if the function was called with new
function FlexibleConstructor(name) {
  if (!new.target) {
    console.log('Called without new, redirecting...');
    return new FlexibleConstructor(name);
  }
  this.name = name;
}

const f1 = new FlexibleConstructor('with new');
const f2 = FlexibleConstructor('without new');  // Still works

console.log('f1:', f1);
console.log('f2:', f2);

console.log('\n--- Classes Enforce new ---\n');

// Classes always require new - you can't call them as regular functions
class StrictWidget {
  constructor(name) {
    this.name = name;
  }
}

try {
  StrictWidget('no new');
} catch (e) {
  console.log('StrictWidget() throws:', e.message);
}

console.log('new StrictWidget():', new StrictWidget('with new'));

// The new keyword: create object, link prototype, call constructor,
// return the result (or the created object if constructor returns primitive).
