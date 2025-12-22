// Chapter 6: Functions - The this Binding Rules
// See: "The this keyword" and "The four binding rules"
//
// For regular functions, 'this' is determined at call time, not definition
// time. The four rules (in precedence order) are: new binding, explicit
// binding, implicit binding, and default binding.

'use strict';

console.log('--- The Four Binding Rules ---\n');

function identify() {
  return this?.label ?? 'no this';
}

// 1. NEW BINDING (highest precedence)
// When called with 'new', a fresh object is created and bound to 'this'
function Widget(label) {
  this.label = label;
}
const widget = new Widget('from new');
console.log('1. new binding:', widget.label);

// 2. EXPLICIT BINDING (call/apply/bind)
// You directly specify what 'this' should be
console.log('2. explicit binding (.call):', identify.call({ label: 'from call' }));
console.log('   explicit binding (.apply):', identify.apply({ label: 'from apply' }));

const boundIdentify = identify.bind({ label: 'from bind' });
console.log('   explicit binding (.bind):', boundIdentify());

// 3. IMPLICIT BINDING (method call)
// The object before the dot becomes 'this'
const cabinet = {
  label: 'from method',
  identify: identify,
};
console.log('3. implicit binding:', cabinet.identify());

// 4. DEFAULT BINDING (fallback)
// In strict mode: undefined. In sloppy mode: globalThis
console.log('4. default binding:', identify());

console.log('\n--- Losing this: The Destructuring Trap ---\n');

// Extracting a method loses the implicit binding
const { identify: extracted } = cabinet;
console.log('After destructuring:', extracted());  // Lost!

// Fix with bind
const fixed = extracted.bind(cabinet);
console.log('Fixed with bind:', fixed());

console.log('\n--- Arrow Functions Capture this ---\n');

const counter = {
  count: 0,

  // Regular function: 'this' is determined at call time
  incrementBroken: function() {
    setTimeout(function() {
      this.count++;  // 'this' is NOT counter here
      console.log('Broken count:', this.count);
    }, 10);
  },

  // Arrow function: 'this' is captured from the enclosing scope
  incrementFixed: function() {
    setTimeout(() => {
      this.count++;  // 'this' IS counter (captured from incrementFixed)
      console.log('Fixed count:', this.count);
    }, 20);
  },
};

counter.incrementBroken();
counter.incrementFixed();

setTimeout(() => {
  console.log('\nRegular functions determine this at call time.');
  console.log('Arrow functions capture this when they are created.');
}, 50);

// Regular functions use the four binding rules at call time.
// Arrow functions ignore these rules and use the this value from
// their enclosing lexical scope.
