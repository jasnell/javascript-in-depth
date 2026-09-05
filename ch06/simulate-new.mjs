// Emulates the four steps of `new` and shows the return-value rule (step 4).

function Gadget(name) {
  this.name = name;
}
Gadget.prototype.identity = function () {
  return `Gadget: ${this.name}`;
};

// Steps 1+2 (create object, link prototype), step 3 (call with bound this),
// step 4 (keep the object unless the constructor returns an object).
function simulateNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.call(obj, ...args);
  return result instanceof Object ? result : obj;
}

const g1 = new Gadget('phone');
const g2 = simulateNew(Gadget, 'phone');
console.log(g1.identity()); // Gadget: phone
console.log(g2.identity()); // Gadget: phone
console.log(Object.getPrototypeOf(g2) === Gadget.prototype); // true

// Step 4 in detail: an object return replaces `this`; a primitive is ignored.
function ReturnsObject() {
  this.a = 1;
  return { b: 2 };
}
function ReturnsNumber() {
  this.a = 1;
  return 42;
}
console.log(new ReturnsObject()); // { b: 2 }, original this discarded
console.log(new ReturnsNumber()); // ReturnsNumber { a: 1 }, primitive ignored
