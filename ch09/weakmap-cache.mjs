// run: node --expose-gc weakmap-cache.mjs
// A WeakMap holds its keys weakly, so an entry vanishes once the key is unreachable; a Map keeps the key alive.

const strongCache = new Map();
const weakCache = new WeakMap();

let keyA = { name: 'A' };
let keyB = { name: 'B' };

strongCache.set(keyA, 'value-A');
weakCache.set(keyB, 'value-B');

const watchA = new WeakRef(keyA);
const watchB = new WeakRef(keyB);

keyA = null; // drop our strong references; only the caches still refer to the keys
keyB = null;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

globalThis.gc();
await wait(10);
globalThis.gc();
await wait(10);

console.log('Map key still alive (Map retains):', watchA.deref() !== undefined);
console.log('WeakMap key collected:', watchB.deref() === undefined);
