// Detecting construction with new.target and the two constructor-guard patterns.

function Example() {
  console.log(new.target);
}
Example();      // undefined, called without new
new Example();  // [Function: Example], called with new

// Class-style guard: reject calls made without new.
function LegacyWidget(name) {
  if (!new.target) {
    throw new TypeError('LegacyWidget must be called with new');
  }
  this.name = name;
}
try {
  LegacyWidget('a');
} catch (err) {
  console.log(err.message); // LegacyWidget must be called with new
}
console.log(new LegacyWidget('ok').name); // ok

// Node-style guard: usable with or without new. The instanceof check names the
// actual constructor (NodeWidget), not some unrelated type.
function NodeWidget(name) {
  if (!(this instanceof NodeWidget)) {
    return new NodeWidget(name);
  }
  this.name = name;
}
console.log(NodeWidget('a').name);     // a, redirected through new
console.log(new NodeWidget('b').name); // b
