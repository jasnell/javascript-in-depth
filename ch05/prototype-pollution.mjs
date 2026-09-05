// Prototype pollution: a write to Object.prototype leaks into unrelated objects.

function configureDrawerUnsafe(options) {
  // Reads fall through to the prototype chain when the own property is absent.
  return {
    label: options.label || 'Unnamed',
    locked: !!options.locked,
    accessLevel: options.accessLevel || 'normal',
  };
}

// An attacker pollutes the shared prototype.
Object.prototype.accessLevel = 'admin';

const polluted = configureDrawerUnsafe({ label: 'Tax documents' });
console.log(polluted.accessLevel); // 'admin' -- leaked from Object.prototype

// Defense 1: check own properties, ignoring the chain.
// Defense 2: give the options object a null prototype so there is no chain.
function configureDrawerSafe(options) {
  return {
    label: Object.hasOwn(options, 'label') ? options.label : 'Unnamed',
    locked: Object.hasOwn(options, 'locked') ? options.locked : false,
    accessLevel: Object.hasOwn(options, 'accessLevel')
      ? options.accessLevel
      : 'normal',
  };
}

const safe1 = configureDrawerSafe({ label: 'Tax documents' });
console.log(safe1.accessLevel); // 'normal' -- own-property check ignores the pollution

const safe2 = configureDrawerSafe({ __proto__: null, label: 'Tax documents' });
console.log(safe2.accessLevel); // 'normal' -- no prototype chain to pollute

delete Object.prototype.accessLevel; // clean up the demo pollution
