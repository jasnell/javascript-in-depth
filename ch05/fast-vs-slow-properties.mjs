// run: node --allow-natives-syntax fast-vs-slow-properties.mjs
// Deleting a property can force an object out of fast mode into dictionary mode.

const drawer = { label: 'Taxes', isLocked: false, priority: 'high' };

// A normal, consistently shaped object uses fast properties.
console.log('fast before delete:', %HasFastProperties(drawer)); // true

// Deleting a non-last property makes the object dynamic; V8 switches it to a
// hash-table ("slow"/dictionary) representation.
delete drawer.isLocked;
console.log('fast after delete:', %HasFastProperties(drawer)); // false

// The object still works correctly; only its internal storage changed.
console.log(drawer.label, drawer.priority); // 'Taxes' 'high'

// Contrast: an object we never delete from stays fast.
const stable = { label: 'Legal', isLocked: true };
console.log('stable stays fast:', %HasFastProperties(stable)); // true
