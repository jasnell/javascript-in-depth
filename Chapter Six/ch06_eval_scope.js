// Chapter 6: Functions - Eval and Scope Pollution
// See: "Scope and closures" and "eval"
//
// eval() is one of JavaScript's most dangerous features. Direct eval can
// introduce new variables into the current scope and prevents many optimizations.
// Indirect eval runs in global scope, which is safer but still problematic.
//
// Run with: node ch06_eval_scope.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Direct vs Indirect Eval ---\n');

// Direct eval: called as "eval(...)"
// Runs in current scope, can create local variables
function directEval() {
  const x = 1;
  eval('var y = 2');  // Creates y in this function's scope!
  console.log('Direct eval created y:', y);
  console.log('Direct eval can see x:', eval('x'));
}

directEval();

// Indirect eval: any other way of calling eval
// Runs in global scope
function indirectEval() {
  const x = 1;
  const myEval = eval;
  try {
    console.log('Indirect eval cannot see x:', myEval('x'));
  } catch (e) {
    console.log('Indirect eval error:', e.message);
  }
}

indirectEval();

console.log('\n--- Scope Pollution in Action ---\n');

function pollutedScope(userCode) {
  const secret = 'password123';
  const balance = 1000000;

  // Direct eval can access ALL local variables
  return eval(userCode);
}

// User code can read local variables!
log('Accessing secret', pollutedScope('secret'));
log('Accessing balance', pollutedScope('balance'));

console.log('\n--- Why Direct Eval Blocks Optimization ---\n');

function withoutEval(x) {
  // V8 knows exactly what variables exist here
  // Can optimize aggressively
  const y = x * 2;
  return y + 1;
}

function withEval(x, code) {
  // V8 cannot know what variables 'code' might create or access
  // Must keep ALL variables accessible, prevents optimization
  const y = x * 2;
  eval(code);  // Could do anything: create vars, modify y, etc.
  return y + 1;
}

console.log('Functions with direct eval:');
console.log('  - Cannot be inlined');
console.log('  - All variables must be kept accessible');
console.log('  - No dead code elimination');
console.log('  - Context cannot be optimized');

console.log('\n--- The Eval Scope Chain ---\n');

const globalVar = 'global';

function outer() {
  const outerVar = 'outer';

  function inner() {
    const innerVar = 'inner';

    // eval can see the entire scope chain
    console.log('eval scope chain:');
    console.log('  innerVar:', eval('innerVar'));
    console.log('  outerVar:', eval('outerVar'));
    console.log('  globalVar:', eval('globalVar'));
  }

  inner();
}

outer();

console.log('\n--- Safer Alternatives to eval ---\n');

// Instead of eval for JSON
const jsonStr = '{"name": "Alice", "age": 30}';
const badParse = () => eval('(' + jsonStr + ')');  // Dangerous!
const goodParse = () => JSON.parse(jsonStr);       // Safe

log('JSON.parse result', goodParse());

// Instead of eval for dynamic property access
const obj = { foo: 1, bar: 2 };
const prop = 'foo';
const badAccess = () => eval('obj.' + prop);  // Dangerous!
const goodAccess = () => obj[prop];           // Safe

log('Dynamic property access', goodAccess());

// Instead of eval for dynamic function creation
const badDynamic = eval('(function(x) { return x * 2; })');
const goodDynamic = new Function('x', 'return x * 2');  // Runs in global scope

log('Dynamic function', goodDynamic(5));

console.log('\n--- The with Statement (Related Problem) ---\n');

// 'with' has similar problems - creates dynamic scope
const settings = { volume: 50, brightness: 80 };

// with (settings) {
//   console.log(volume);  // Is this settings.volume or a local variable?
// }

console.log('"with" statement:');
console.log('  - Deprecated, forbidden in strict mode');
console.log('  - Same optimization problems as eval');
console.log('  - Ambiguous scope resolution');

console.log('\n--- Safe Eval Patterns ---\n');

// If you must evaluate code, use indirect eval for global scope
function safeEval(code) {
  // (0, eval) is indirect eval - runs in global scope
  return (0, eval)(code);
}

// Or use Function constructor
function safeFunctionEval(code) {
  return new Function(code)();
}

console.log('Indirect eval pattern: (0, eval)(code)');
console.log('Function constructor: new Function(code)()');
console.log('Both run in global scope, not local scope');

console.log('\n--- Summary ---\n');

console.log('Direct eval problems:');
console.log('  1. Can access/modify local variables');
console.log('  2. Prevents function optimization');
console.log('  3. Security risk - code injection');
console.log('  4. Makes code hard to reason about');
console.log('');
console.log('Alternatives:');
console.log('  - JSON.parse() for data');
console.log('  - obj[prop] for dynamic access');
console.log('  - new Function() for dynamic code');
console.log('  - Indirect eval (0, eval) if you must');
