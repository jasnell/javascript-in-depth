// Chapter 5: Objects - Prototype Pollution
// See: "Prototype chain" and "Security considerations"
//
// Prototype pollution is a vulnerability where attackers modify Object.prototype
// or other built-in prototypes. Any code that relies on prototype chain lookup
// can be affected. This is a real security concern in Node.js applications.
//
// Run with: node ch05_prototype_pollution.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- How Prototype Pollution Works ---\n');

// Normal objects inherit from Object.prototype
const obj = {};
log('obj.hasOwnProperty exists', typeof obj.hasOwnProperty);

// If we pollute Object.prototype, ALL objects are affected
Object.prototype.polluted = 'gotcha';

const newObj = {};
const anotherObj = { name: 'test' };
const arr = [1, 2, 3];

log('newObj.polluted', newObj.polluted);
log('anotherObj.polluted', anotherObj.polluted);
log('arr.polluted', arr.polluted);

// Clean up
delete Object.prototype.polluted;

console.log('\n--- The __proto__ Attack Vector ---\n');

// Many applications merge user input into objects
function unsafeMerge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = target[key] || {};
      unsafeMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Attacker sends this payload (simulated from JSON)
const maliciousPayload = JSON.parse(
  '{"__proto__": {"isAdmin": true}}'
);

// This pollutes Object.prototype!
const config = {};
unsafeMerge(config, maliciousPayload);

const user = { name: 'Alice' };
log('user.isAdmin (should be undefined)', user.isAdmin);
// Now every object has isAdmin: true!

// Clean up
delete Object.prototype.isAdmin;

console.log('\n--- Real-World Exploitation ---\n');

// Scenario: access control bypass
Object.prototype.role = 'admin';  // Pollution

function checkAccess(user) {
  // Developer expects role to be explicitly set
  if (user.role === 'admin') {
    return 'ACCESS GRANTED';
  }
  return 'ACCESS DENIED';
}

const normalUser = { name: 'Bob' };  // No role property
log('checkAccess(normalUser)', checkAccess(normalUser));
// Returns 'ACCESS GRANTED' due to pollution!

delete Object.prototype.role;

console.log('\n--- Safe Merge Function ---\n');

function safeMerge(target, source) {
  for (const key of Object.keys(source)) {
    // Block prototype pollution vectors
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = target[key] || {};
      safeMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

const safeConfig = {};
safeMerge(safeConfig, maliciousPayload);

const testUser = { name: 'Test' };
log('testUser.isAdmin after safe merge', testUser.isAdmin);  // undefined

console.log('\n--- Using Object.create(null) ---\n');

// Objects with no prototype can't be polluted via prototype chain
const nullProto = Object.create(null);
nullProto.name = 'safe';

Object.prototype.evil = 'polluted';

log('Regular object sees pollution', {}.evil);
log('Null prototype object', nullProto.evil);  // undefined

delete Object.prototype.evil;

console.log('\n--- Checking hasOwnProperty Safely ---\n');

// hasOwnProperty can be overwritten!
Object.prototype.hasOwnProperty = () => true;  // Pollution

const testObj = {};
log('testObj.hasOwnProperty("fake")', testObj.hasOwnProperty('fake'));  // true!

// Safe way: use Object.prototype directly
const safeHasOwn = Object.prototype.hasOwnProperty;
Object.prototype.hasOwnProperty = safeHasOwn;  // Restore

log('Object.hasOwn("fake") - ES2022', Object.hasOwn(testObj, 'fake'));

console.log('\n--- Prevention Strategies ---\n');

console.log('1. Use Object.create(null) for dictionaries');
console.log('2. Freeze Object.prototype in sensitive code');
console.log('3. Validate/sanitize user input keys');
console.log('4. Use Map instead of plain objects for user data');
console.log('5. Use Object.hasOwn() instead of hasOwnProperty()');
console.log('6. Block __proto__, constructor, prototype in merges');

console.log('\n--- Freezing Built-in Prototypes ---\n');

// For security-critical code, you can freeze prototypes
// Object.freeze(Object.prototype);
// Object.freeze(Array.prototype);
// Object.freeze(Function.prototype);

console.log('Object.freeze(Object.prototype) prevents all modifications');
console.log('But may break third-party code that extends prototypes');
