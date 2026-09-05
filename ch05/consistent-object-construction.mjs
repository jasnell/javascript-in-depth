// run: node --allow-natives-syntax consistent-object-construction.mjs
// Constructing objects with all keys up front yields one shared shape.

// Good: every object is built with the same keys, in the same order, with the
// same value types. All instances share one hidden class.
function createOptimizedDrawer(label, contents) {
  return {
    label, // always string
    contents, // always string
    isOpen: false, // always boolean
    accessCount: 0, // always number
  };
}
const g1 = createOptimizedDrawer('Tax', 'tax documents');
const g2 = createOptimizedDrawer('Legal', 'contracts');
const g3 = createOptimizedDrawer('HR', 'personnel files');
console.log('optimized share map:', %HaveSameMap(g1, g2) && %HaveSameMap(g2, g3)); // true

// Bad: properties added conditionally and in varying order produce divergent
// shapes, so instances do NOT share a hidden class.
function createProblematicDrawer(label, contents, config = {}) {
  const drawer = { label, contents };
  if (config.secure) {
    drawer.lockCode = config.lockCode;
  }
  if (config.priorityFirst) {
    drawer.priority = 'high';
    drawer.department = config.department;
  } else {
    drawer.department = config.department;
    drawer.priority = 'high';
  }
  return drawer;
}
const b1 = createProblematicDrawer('A', 'x', { priorityFirst: true, department: 'ops' });
const b2 = createProblematicDrawer('B', 'y', { secure: true, lockCode: 9, department: 'ops' });
console.log('problematic share map:', %HaveSameMap(b1, b2)); // false
