// run: node weakset-seen.mjs
// WeakSet answers "have I processed this object before?" without keeping the object alive.

const processed = new WeakSet();

function processOnce(item) {
  if (processed.has(item)) return false; // already handled
  processed.add(item);
  return true; // first time: do the work
}

const a = { id: 1 };
const b = { id: 2 };

console.log(processOnce(a)); // true
console.log(processOnce(a)); // false
console.log(processOnce(b)); // true
console.log(processOnce(b)); // false
