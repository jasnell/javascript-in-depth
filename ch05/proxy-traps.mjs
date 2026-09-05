// A Proxy intercepts fundamental operations through handler traps.

const originalDrawer = {
  contents: 'tax documents',
  isLocked: false,
};

const dynamicDrawer = new Proxy(originalDrawer, {
  get(target, property, receiver) {
    console.log(`Accessing property: ${String(property)}`);
    if (property === 'securityLevel') {
      // A virtual property computed on demand; it exists only in the trap.
      return target.contents === 'classified' ? 'high' : 'normal';
    }
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`Setting ${String(property)} = ${value}`);
    if (property === 'contents' && typeof value !== 'string') {
      throw new Error('Contents must be a string'); // validation that cannot be bypassed
    }
    return Reflect.set(target, property, value, receiver);
  },
});

console.log(dynamicDrawer.contents); // logs access, then 'tax documents'
console.log(dynamicDrawer.securityLevel); // 'normal' (virtual)
dynamicDrawer.contents = 'classified'; // logged and validated
console.log(dynamicDrawer.securityLevel); // 'high'

try {
  dynamicDrawer.contents = 42; // rejected by the set trap
} catch (err) {
  console.log(err.message); // 'Contents must be a string'
}
