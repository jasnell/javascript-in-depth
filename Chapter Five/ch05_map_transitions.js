// Chapter 5: Objects - Map Transition Chains
// See: "Hidden classes" and "Property storage"
//
// V8 tracks object "shapes" using Maps (hidden classes). When you add properties
// in the same order, objects share Maps. Adding properties in different orders
// creates different transition chains, increasing memory and reducing optimization.
//
// Run with: node --allow-natives-syntax ch05_map_transitions.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Map Transitions ---\n');

// Each property addition creates a new Map linked to the previous one
const obj = {};
console.log('Empty object:');
%DebugPrint(obj);

obj.x = 1;
console.log('\nAfter adding .x:');
%DebugPrint(obj);

obj.y = 2;
console.log('\nAfter adding .y:');
%DebugPrint(obj);

console.log('\n--- Same Order = Same Map ---\n');

function Point(x, y) {
  this.x = x;
  this.y = y;
}

const p1 = new Point(1, 2);
const p2 = new Point(3, 4);
const p3 = new Point(5, 6);

console.log('Three Points created with same property order:');
log('p1 and p2 share Map', %HaveSameMap(p1, p2));
log('p2 and p3 share Map', %HaveSameMap(p2, p3));

console.log('\n--- Different Order = Different Maps ---\n');

const objA = {};
objA.first = 1;
objA.second = 2;

const objB = {};
objB.second = 2;  // Different order!
objB.first = 1;

log('Same properties, different order');
log('objA and objB share Map', %HaveSameMap(objA, objB));

console.log('\n%DebugPrint shows different Map addresses:');
console.log('objA:');
%DebugPrint(objA);
console.log('\nobjB:');
%DebugPrint(objB);

console.log('\n--- The Transition Tree ---\n');

// V8 builds a tree of transitions from a root map
// Each unique property addition order creates a branch

console.log('Transition tree visualization:');
console.log('');
console.log('  {} (root)');
console.log('  ├── {x} ── {x,y} ── {x,y,z}');
console.log('  ├── {y} ── {y,x}');
console.log('  └── {a} ── {a,b}');
console.log('');
console.log('Objects with same path share the same Map.');

console.log('\n--- Why This Matters ---\n');

// V8 uses inline caches (ICs) to speed up property access
// Monomorphic (one shape) = fastest, direct offset lookup
// Polymorphic (2-4 shapes) = fast, linear search
// Megamorphic (5+ shapes) = slow, hash table lookup

// With consistent shapes, all Points share one Map
const consistentPoints = [];
for (let i = 0; i < 100; i++) {
  consistentPoints.push(new Point(i, i * 2));
}

// Check they all share the same Map
let allSame = true;
for (let i = 1; i < consistentPoints.length; i++) {
  if (!%HaveSameMap(consistentPoints[0], consistentPoints[i])) {
    allSame = false;
    break;
  }
}
log('All consistent points share Map', allSame);

// With mixed property order, we get multiple Maps
const mixedPoints = [];
for (let i = 0; i < 100; i++) {
  const p = {};
  if (i % 2 === 0) {
    p.x = i; p.y = i * 2;
  } else {
    p.y = i * 2; p.x = i;  // Different orderO
  }
  mixedPoints.push(p);
}

// These have different Maps based on property order
log('Mixed points[0] and [1] share Map', %HaveSameMap(mixedPoints[0], mixedPoints[1]));
log('Mixed points[0] and [2] share Map', %HaveSameMap(mixedPoints[0], mixedPoints[2]));

console.log('\nPerformance impact:');
console.log('  - Consistent shapes: IC stays monomorphic (fastest)');
console.log('  - Mixed shapes: IC becomes polymorphic or megamorphic');
console.log('  - Effect is most noticeable in hot loops with many objects');

// Note: Microbenchmarks for shape/IC behavior are notoriously unreliable.
// V8's optimizing compiler is smart enough to eliminate many contrived
// test cases, and the JIT warmup behavior can mask or invert expected
// results. The %HaveSameMap checks above demonstrate the underlying
// mechanism directly. For real performance impact, profile actual
// application code rather than relying on synthetic benchmarks.

console.log('\n--- Checking Map Stability ---\n');

// Adding properties after construction can cause map transitions
class StablePoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // All properties defined in constructor = stable shape
  }
}

class UnstablePoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  addZ(z) {
    this.z = z;  // Adds property later = causes transition
  }
}

const stable1 = new StablePoint(1, 2);
const stable2 = new StablePoint(3, 4);
log('Stable points share Map', %HaveSameMap(stable1, stable2));

const unstable1 = new UnstablePoint(1, 2);
const unstable2 = new UnstablePoint(3, 4);
unstable1.addZ(5);  // Only one gets .z

log('After adding .z to one', %HaveSameMap(unstable1, unstable2));
