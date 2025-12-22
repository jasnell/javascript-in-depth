// Chapter 5: Objects - Property Access Megamorphism
// See: "Inline caches" and "Optimization"
//
// V8 uses inline caches (ICs) to speed up property access. When a property
// access sees only 1-4 different object shapes, it stays in fast "polymorphic"
// mode. More shapes cause "megamorphic" mode, which is much slower.
//
// Run with: node --allow-natives-syntax ch05_megamorphism.js
//
// =============================================================================
// UNDERSTANDING INLINE CACHE STATES:
// =============================================================================
//
// Each property access site (e.g., obj.x) has its own inline cache (IC).
// The IC tracks which object shapes it has seen:
//
//   Uninitialized  - Site hasn't been executed yet
//   Monomorphic    - Only 1 shape seen (fastest: direct offset)
//   Polymorphic    - 2-4 shapes seen (still fast: linear search)
//   Megamorphic    - 5+ shapes seen (slow: full dictionary lookup)
//
// Use --trace-ic to see IC state transitions:
//   node --allow-natives-syntax --trace-ic ch05_megamorphism.js 2>&1 | grep LoadIC
//
// Output shows transitions like:
//   [LoadIC in getX]: (0->1) at ... <-- Becoming monomorphic
//   [LoadIC in getX]: (1->P) at ... <-- Becoming polymorphic
//   [LoadIC in getX]: (P->N) at ... <-- Going megamorphic (N = generic)
//
// %HaveSameMap(a, b) returns true if objects share the same hidden class.
// Objects with the same map can be handled by the same IC entry.
// =============================================================================

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Inline Cache States ---\n');

console.log('Inline caches track object shapes at each property access site:');
console.log('');
console.log('  Uninitialized -> Monomorphic -> Polymorphic -> Megamorphic');
console.log('  (never called)   (1 shape)     (2-4 shapes)   (5+ shapes)');
console.log('');
console.log('Monomorphic: Fastest - direct memory offset lookup');
console.log('Polymorphic: Fast - linear search through known shapes');
console.log('Megamorphic: Slow - full hash table lookup');

console.log('\n--- Monomorphic Access ---\n');

function getX(obj) {
  return obj.x;
}

// Same shape every time = monomorphic
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const points = [];
for (let i = 0; i < 1000; i++) {
  points.push(new Point(i, i * 2));
}

// Warm up - establishes monomorphic IC
for (const p of points) {
  getX(p);
}

console.log('All Points have same shape:');
log('%HaveSameMap(points[0], points[500])', %HaveSameMap(points[0], points[500]));

const start1 = performance.now();
let sum1 = 0;
for (let i = 0; i < 100; i++) {
  for (const p of points) {
    sum1 += getX(p);
  }
}
const time1 = performance.now() - start1;
log('Monomorphic access time', `${time1.toFixed(3)}ms`);

console.log('\n--- Polymorphic Access ---\n');

function getXPoly(obj) {
  return obj.x;
}

// 3 different shapes
class Point2D { constructor(x, y) { this.x = x; this.y = y; } }
class Point3D { constructor(x, y, z) { this.x = x; this.y = y; this.z = z; } }
class NamedPoint { constructor(name, x, y) { this.name = name; this.x = x; this.y = y; } }

const mixedPoints = [];
for (let i = 0; i < 1000; i++) {
  switch (i % 3) {
    case 0: mixedPoints.push(new Point2D(i, i)); break;
    case 1: mixedPoints.push(new Point3D(i, i, i)); break;
    case 2: mixedPoints.push(new NamedPoint('p', i, i)); break;
  }
}

// Warm up
for (const p of mixedPoints) {
  getXPoly(p);
}

const start2 = performance.now();
let sum2 = 0;
for (let i = 0; i < 100; i++) {
  for (const p of mixedPoints) {
    sum2 += getXPoly(p);
  }
}
const time2 = performance.now() - start2;
log('Polymorphic (3 shapes) access time', `${time2.toFixed(3)}ms`);

console.log('\n--- Megamorphic Access ---\n');

function getXMega(obj) {
  return obj.x;
}

// Create many different shapes
const manyShapes = [];
for (let i = 0; i < 1000; i++) {
  const obj = { x: i };
  // Add unique property to each to create different shapes
  if (i < 10) {
    obj['unique' + i] = i;
  }
  manyShapes.push(obj);
}

// Warm up - forces megamorphic
for (const obj of manyShapes) {
  getXMega(obj);
}

const start3 = performance.now();
let sum3 = 0;
for (let i = 0; i < 100; i++) {
  for (const obj of manyShapes) {
    sum3 += getXMega(obj);
  }
}
const time3 = performance.now() - start3;
log('Megamorphic access time', `${time3.toFixed(3)}ms`);

// Caveat: These microbenchmarks may not show expected results consistently.
// V8's optimizer can sometimes eliminate the overhead in synthetic tests,
// and JIT warmup effects can mask or invert differences. The IC state
// transitions are real, but measuring their impact reliably requires
// profiling actual application code or using V8's --trace-ic flag.

console.log('\n--- Visualizing the Problem ---\n');

// Each function call site has its own IC
function process(items) {
  let total = 0;
  for (const item of items) {
    // This property access has one IC
    // If 'items' contains objects with many shapes, it goes megamorphic
    total += item.value;
  }
  return total;
}

// Good: all same shape
const uniform = Array(100).fill(null).map((_, i) => ({ value: i }));
log('Uniform shapes', process(uniform));

// Bad: many different shapes from different sources
const mixed = [
  { value: 1 },
  { value: 2, extra: true },
  { value: 3, name: 'x' },
  { value: 4, a: 1, b: 2 },
  { value: 5, type: 'special' }
];
log('Mixed shapes', process(mixed));

console.log('\n--- Preventing Megamorphism ---\n');

console.log('Strategies:');
console.log('  1. Use consistent object shapes (same constructor)');
console.log('  2. Initialize all properties in constructor');
console.log('  3. Add properties in same order');
console.log('  4. Consider separate functions for different types');
console.log('  5. Use TypeScript/Flow to enforce shape consistency');

console.log('\n--- Example: Normalizing Shapes ---\n');

// Before: objects from different sources have different shapes
const source1 = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
const source2 = [{ y: 5, x: 6 }];  // Different order!

// After: normalize to consistent shape
function normalizePoint(p) {
  return { x: p.x, y: p.y };  // Always same order
}

const normalized = [...source1, ...source2].map(normalizePoint);
log('Normalized points share shape', %HaveSameMap(normalized[0], normalized[2]));
