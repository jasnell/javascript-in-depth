// run: node --trace-deopt monomorphic-vs-deopt.mjs
// Optimize on one shape, then break it: a shape/type change forces deoptimization.

function showFlavor(cookie) {
  return cookie.flavor;
}

// Monomorphic: every call passes the same { flavor } shape. Warm it up so V8
// commits to that shape.
for (let n = 0; n < 2_000_000; n++) {
  showFlavor({ flavor: 'chocolate chip' });
}

// Polymorphic: a second shape appears (property is `taste`, not `flavor`).
showFlavor({ taste: 'lemon' });

// Megamorphic: now many shapes, so V8 abandons the specialized code and
// falls back to a generic, slower property lookup.
for (let i = 0; i < 100; i++) {
  showFlavor({ ['prop' + i]: i });
}

// Separate demonstration: an optimized numeric add deoptimizes on a string call.
function add(a, b) {
  return a + b;
}
for (let n = 0; n < 2_000_000; n++) {
  add(1, 2);
}
console.log(add('a', 'b')); // ab, triggers a deopt (insufficient type feedback)
