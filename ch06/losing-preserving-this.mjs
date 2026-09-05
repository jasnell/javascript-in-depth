// Destructuring a method drops its this; bind or call restores it.

const cabinet = {
  label: 'Main cabinet',
  identify() {
    return this?.label;
  }
};

// The reference no longer remembers the object it came from.
const { identify } = cabinet;
console.log(identify()); // undefined, default binding applies

// Preserve the relationship explicitly.
console.log(identify.call(cabinet)); // Main cabinet

const identifyBound = identify.bind(cabinet);
console.log(identifyBound()); // Main cabinet, even when passed around
const later = identifyBound;
console.log(later()); // Main cabinet
