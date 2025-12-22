// Chapter 5: Objects - V8 Hidden Classes (Maps)
// See: "Hidden classes and shapes" and "How V8 implements objects"
//
// Run with: node --allow-natives-syntax ch05_hidden_classes.js
//
// V8 optimizes property access by assigning objects a "hidden class" (called
// a Map internally). Objects with the same properties in the same order share
// a Map, enabling fast property lookups through inline caching.
//
// =============================================================================
// READING V8's %DebugPrint OUTPUT FOR OBJECTS:
// =============================================================================
//
// When you see output like:
//   DebugPrint: 0x1234abcd: [JS_OBJECT_TYPE]
//    - map: 0x5678efgh <Map[24](HOLEY_ELEMENTS)>
//    - prototype: 0x... <Object map = ...>
//    - elements: 0x... <FixedArray[0]>
//    - properties: 0x... <FixedArray[0]>
//    - ...
//
// KEY THINGS TO LOOK FOR:
//
// 1. "map: 0x..." - This is the hidden class address. Objects with the SAME
//    map address share the same "shape" and can be optimized together.
//
// 2. "properties:" - Shows how properties are stored:
//    - <FixedArray[0]> or "in-object" = fast mode (good)
//    - <NameDictionary[N]> = dictionary/slow mode (less optimized)
//
// 3. %HaveSameMap(obj1, obj2) returns true if both objects share the exact
//    same hidden class, meaning V8 can optimize them identically.
//
// When maps differ, V8 must generate separate optimized code paths for each
// shape, reducing the effectiveness of inline caching.
// =============================================================================

console.log('--- Consistent Shapes Share Hidden Classes ---\n');

// Objects created with the same structure share the same Map
function createOptimizedDrawer(label, contents) {
  return {
    label: label,       // Always string
    contents: contents, // Always string
    isOpen: false,      // Always boolean
    accessCount: 0,     // Always number
  };
}

const drawer1 = createOptimizedDrawer('Tax', 'tax documents');
const drawer2 = createOptimizedDrawer('Legal', 'contracts');
const drawer3 = createOptimizedDrawer('HR', 'personnel files');

console.log('drawer1:');
%DebugPrint(drawer1);

console.log('\ndrawer2:');
%DebugPrint(drawer2);

// %HaveSameMap confirms they share the same hidden class
console.log('\nDo drawer1 and drawer2 share the same map?', %HaveSameMap(drawer1, drawer2));
console.log('Do drawer2 and drawer3 share the same map?', %HaveSameMap(drawer2, drawer3));

console.log('\n--- Property Order Creates Different Maps ---\n');

// Same properties but different order = different hidden classes
const objA = { label: 'Taxes', isLocked: false };
const objB = { isLocked: false, label: 'Invoices' };

console.log('objA (label first):');
%DebugPrint(objA);

console.log('\nobjB (isLocked first):');
%DebugPrint(objB);

console.log('\nDo objA and objB share the same map?', %HaveSameMap(objA, objB));
console.log('Same properties in different order means different maps.');

console.log('\n--- Adding Properties Changes the Map ---\n');

const original = { x: 1 };
console.log('Original object:');
%DebugPrint(original);

original.y = 2;
console.log('\nAfter adding property y:');
%DebugPrint(original);

original.z = 3;
console.log('\nAfter adding property z:');
%DebugPrint(original);

console.log('\n--- Inconsistent Shapes Hurt Performance ---\n');

// Conditionally adding properties creates objects with different maps
function createProblematicDrawer(label, config = {}) {
  const drawer = { label };

  if (config.secure) {
    drawer.lockCode = config.lockCode;
  }

  if (config.automated) {
    drawer.motorSpeed = config.motorSpeed;
  }

  return drawer;
}

const basic = createProblematicDrawer('Basic');
const secure = createProblematicDrawer('Secure', { secure: true, lockCode: '1234' });
const auto = createProblematicDrawer('Auto', { automated: true, motorSpeed: 5 });

console.log('Do basic and secure share the same map?', %HaveSameMap(basic, secure));
console.log('Do secure and auto share the same map?', %HaveSameMap(secure, auto));
console.log('Different maps mean V8 cannot optimize as effectively.');

console.log('\n--- Best Practices ---\n');

console.log('1. Initialize ALL properties in constructors/factories');
console.log('2. Keep consistent property order across similar objects');
console.log('3. Avoid adding properties after object creation');
console.log('4. Avoid deleting properties (can trigger slow mode)');
console.log('5. Keep property types consistent');

// Objects with consistent shapes share hidden classes, enabling inline caching.
// When V8 sees the same Map repeatedly, it can skip the property lookup entirely.
