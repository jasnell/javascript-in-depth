// run: node --allow-natives-syntax monomorphic-vs-megamorphic.mjs
// A call site stays fast (monomorphic) when every object it sees shares one shape.

// This function has one property-access site: obj.label. Its inline cache
// records the hidden class it observes there.
function readLabel(obj) {
  return obj.label;
}

// Monomorphic: every argument has the identical shape, so the IC has one entry
// and can reuse the remembered slot on each call.
const mono = [
  { label: 'a', isLocked: false },
  { label: 'b', isLocked: true },
  { label: 'c', isLocked: false },
];
console.log('mono objects share a map:', %HaveSameMap(mono[0], mono[1])); // true
for (const o of mono) readLabel(o);

// Megamorphic: each argument has a different shape (label at a different
// offset, extra keys, different order). The IC cannot settle on one slot and
// V8 falls back to a general, slower lookup.
const mega = [
  { label: 'a' },
  { x: 1, label: 'b' },
  { label: 'c', y: 2, z: 3 },
  { p: 0, q: 0, label: 'd' },
];
console.log('mega[0] vs mega[1] share map:', %HaveSameMap(mega[0], mega[1])); // false
for (const o of mega) readLabel(o);

// Takeaway: feeding one call site many shapes degrades it from monomorphic to
// megamorphic. Consistent object shapes keep hot call sites fast.
