// run: node --allow-natives-syntax hidden-classes-shapes.mjs
// Same properties in the same order share a hidden class; reordering breaks it.

// Same keys, same insertion order -> same map (shape).
const a = { label: 'Taxes', isLocked: false };
const b = { label: 'Invoices', isLocked: true };
console.log('same order share map:', %HaveSameMap(a, b)); // true

// Same keys, different insertion order -> different maps.
const c = { isLocked: false, label: 'Invoices' };
console.log('reordered share map:', %HaveSameMap(a, c)); // false

// The order of insertion is what matters, not the final key set. Building an
// object incrementally in the reordered sequence lands on the reordered shape.
const d = {};
d.isLocked = false;
d.label = 'HR';
console.log('incremental reordered vs a:', %HaveSameMap(a, d)); // false
console.log('incremental reordered vs c:', %HaveSameMap(c, d)); // true
