// Shows that && and || return one of their OPERANDS (not a boolean) and skip evaluating the second when short-circuited.

// && returns the first falsy operand, otherwise the last operand.
console.log('a' && 'b');   // 'b'  (both truthy, returns the second)
console.log('' && 'b');    // ''   (first is falsy, returned as-is)
console.log(0 && 'b');     // 0

// || returns the first truthy operand, otherwise the last operand.
console.log(0 || 'x');     // 'x'
console.log('a' || 'b');   // 'a'  (first is truthy, second never evaluated)
console.log('' || 0 || 'default'); // 'default'

// Short-circuit really means the right side is NOT evaluated.
function sideEffect() {
  console.log('sideEffect ran');
  return true;
}
console.log('--- && short-circuit ---');
false && sideEffect();     // sideEffect never runs
console.log('--- || short-circuit ---');
true || sideEffect();      // sideEffect never runs

// The values returned are operands, so their type is whatever the operand was.
console.log(typeof ('a' && 'b'));  // string, not boolean
console.log(typeof (0 || 42));     // number, not boolean
