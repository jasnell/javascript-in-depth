// Descriptor defaults differ: literals default true, defineProperty defaults false.

// Object literal: writable, enumerable, configurable all default to true.
const obj1 = { prop: 'value' };
const d1 = Object.getOwnPropertyDescriptor(obj1, 'prop');
console.log(d1.writable, d1.enumerable, d1.configurable); // true true true

// Object.defineProperty: any attribute omitted defaults to false.
const obj2 = {};
Object.defineProperty(obj2, 'prop', {
  value: 'value',
});
// FIX: inspect obj2 (the object we just defined), not obj1 as the
// manuscript mistakenly did, so the "all false" annotation is accurate.
const d2 = Object.getOwnPropertyDescriptor(obj2, 'prop');
console.log(d2.writable, d2.enumerable, d2.configurable); // false false false
