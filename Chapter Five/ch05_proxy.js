// Chapter 5: Objects - Proxy Objects
// See: "Proxy objects for intercepting operations"
//
// Proxies let you intercept and customize fundamental object operations
// like property access, assignment, and enumeration. They're the mechanism
// behind many framework features like Vue 3's reactivity system.

console.log('--- Basic Proxy: Logging Property Access ---\n');

const drawer = {
  label: 'Tax Documents',
  contents: ['form-1040.pdf', 'receipts.pdf'],
};

const loggedDrawer = new Proxy(drawer, {
  get(target, property, receiver) {
    console.log(`  [GET] ${String(property)}`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`  [SET] ${String(property)} = ${value}`);
    return Reflect.set(target, property, value, receiver);
  },
});

console.log('Reading label:', loggedDrawer.label);
loggedDrawer.label = 'Updated Label';

console.log('\n--- Validation Proxy ---\n');

const validatedDrawer = new Proxy({ label: '', isLocked: false }, {
  set(target, property, value) {
    if (property === 'label') {
      if (typeof value !== 'string') {
        throw new TypeError('label must be a string');
      }
      if (value.length > 50) {
        throw new RangeError('label must be 50 characters or less');
      }
    }
    if (property === 'isLocked') {
      if (typeof value !== 'boolean') {
        throw new TypeError('isLocked must be a boolean');
      }
    }
    target[property] = value;
    return true;
  },
});

validatedDrawer.label = 'Valid Label';
console.log('Set valid label:', validatedDrawer.label);

try {
  validatedDrawer.label = 123;
} catch (e) {
  console.log('Invalid label type:', e.message);
}

try {
  validatedDrawer.label = 'x'.repeat(100);
} catch (e) {
  console.log('Label too long:', e.message);
}

console.log('\n--- Default Values Proxy ---\n');

const defaults = { color: 'gray', size: 'medium' };

const withDefaults = new Proxy({}, {
  get(target, property) {
    if (property in target) {
      return target[property];
    }
    return defaults[property] ?? undefined;
  },
});

console.log('withDefaults.color:', withDefaults.color);  // 'gray' (default)
withDefaults.color = 'blue';
console.log('withDefaults.color:', withDefaults.color);  // 'blue' (set value)
console.log('withDefaults.size:', withDefaults.size);    // 'medium' (default)

console.log('\n--- Common Proxy Traps ---');
console.log('  get: intercept property reads');
console.log('  set: intercept property writes');
console.log('  has: intercept the "in" operator');
console.log('  deleteProperty: intercept delete');
console.log('  apply: intercept function calls');
console.log('  construct: intercept the new operator');

// Proxies are powerful but have performance overhead. Use them for
// cross-cutting concerns like validation and logging, not for simple
// property access that could be done directly.
