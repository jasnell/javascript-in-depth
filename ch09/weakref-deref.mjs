// run: node --expose-gc weakref-deref.mjs
// A WeakRef derefs to the object while it is reachable and to undefined after the collector reclaims it.

let target = { data: 'important' };
const weak = new WeakRef(target);

console.log('before drop:', weak.deref()); // { data: 'important' }

target = null; // remove the only strong reference

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

globalThis.gc();
await wait(10);
globalThis.gc();
await wait(10);

console.log('after GC:', weak.deref()); // undefined (eventually; timing is not guaranteed)
