// Chapter 4: Primitives - Boxing and Unboxing
// See: "Wrapper objects" and "Primitives vs objects"
//
// Primitives are not objects, yet you can call methods on them. JavaScript
// temporarily "boxes" primitives into wrapper objects, then discards them.
// This automatic boxing has some surprising implications.
//
// Run with: node ch04_boxing.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Primitives Have No Properties ---\n');

// Primitives aren't objects, but we can use them like objects
const str = 'hello';
log('str.length', str.length);
log('str.toUpperCase()', str.toUpperCase());

// What's really happening:
// 1. JavaScript boxes the primitive: new String('hello')
// 2. Accesses the property on the wrapper object
// 3. Discards the wrapper immediately

console.log('\n--- The Disappearing Property ---\n');

// This is the gotcha: properties set on primitives vanish
const primitive = 'test';
primitive.myProp = 'value';  // No error in non-strict mode!
log('primitive.myProp', primitive.myProp);  // undefined!

// Why? Each property access creates a NEW wrapper, then discards it
// primitive.myProp = 'value' boxes to new String('test'), sets property, discards
// primitive.myProp boxes to new String('test') again - property is gone

console.log('\n--- Explicit Wrapper Objects ---\n');

// You can create wrapper objects explicitly (but shouldn't)
const strWrapper = new String('hello');
const numWrapper = new Number(42);
const boolWrapper = new Boolean(true);

log('typeof "hello"', typeof 'hello');          // 'string'
log('typeof strWrapper', typeof strWrapper);    // 'object'

log('\nstrWrapper === "hello"', strWrapper === 'hello');  // false (different types)
log('strWrapper == "hello"', strWrapper == 'hello');      // true (coercion)

// Wrapper objects can hold properties (they're objects)
strWrapper.myProp = 'value';
log('\nstrWrapper.myProp', strWrapper.myProp);  // Works! It's an object

console.log('\n--- The Boolean Wrapper Trap ---\n');

// Boolean wrappers are always truthy (they're objects!)
const falseWrapper = new Boolean(false);

log('Boolean(false)', Boolean(false));    // false
log('Boolean(falseWrapper)', Boolean(falseWrapper));  // true! It's an object

if (falseWrapper) {
  console.log('falseWrapper is truthy! (It\'s an object, not false)');
}

// This is why you should never use Boolean wrappers
log('\nfalseWrapper.valueOf()', falseWrapper.valueOf());  // false

console.log('\n--- Boxing With Methods ---\n');

// Some methods return primitives, some return objects
const num = 42;

log('typeof num.toFixed(2)', typeof num.toFixed(2));  // 'string' (primitive)
log('num.toFixed(2)', num.toFixed(2));

// Object methods on primitives return objects
const strObj = Object(str);
log('typeof Object("hello")', typeof strObj);  // 'object'

console.log('\n--- Unboxing (ToPrimitive) ---\n');

// Objects are unboxed via valueOf() or toString()
const wrapper = new Number(42);

log('wrapper + 0', wrapper + 0);  // Calls valueOf() -> 42
log('wrapper.valueOf()', wrapper.valueOf());

// Custom valueOf changes unboxing behavior
const custom = {
  value: 100,
  valueOf() {
    return this.value;
  }
};

log('custom + 1', custom + 1);  // 101

console.log('\n--- Comparing Primitives and Wrappers ---\n');

const prim1 = 'hello';
const prim2 = 'hello';
const wrap1 = new String('hello');
const wrap2 = new String('hello');

log('prim1 === prim2', prim1 === prim2);  // true (same value)
log('wrap1 === wrap2', wrap1 === wrap2);  // false (different objects)
log('wrap1 === wrap1', wrap1 === wrap1);  // true (same reference)

console.log('\n--- Performance Implications ---\n');

// Boxing creates temporary objects - usually optimized away, but measurable

const iterations = 10000000;

const start1 = performance.now();
let sum1 = 0;
for (let i = 0; i < iterations; i++) {
  sum1 += 'hello'.length;  // Boxing happens here
}
const time1 = performance.now() - start1;

const start2 = performance.now();
let sum2 = 0;
const cached = 'hello'.length;  // Cache the value
for (let i = 0; i < iterations; i++) {
  sum2 += cached;  // No boxing needed
}
const time2 = performance.now() - start2;

log('With boxing', `${time1.toFixed(2)}ms`);
log('Without boxing', `${time2.toFixed(2)}ms`);

console.log('\n(Modern engines often optimize away temporary wrappers)');
