// Chapter 6: Functions - V8 Optimization Tiers
// See: "JIT compilation" and "Optimization pipeline"
//
// V8 has multiple compilation tiers: Ignition (interpreter), Sparkplug (baseline),
// Maglev (mid-tier), and TurboFan (optimizing). Functions move between tiers
// based on how "hot" they are and whether they can be optimized.
//
// Run with: node --allow-natives-syntax --trace-opt --trace-deopt ch06_optimization_tiers.js
// (Use --trace-opt and --trace-deopt to see optimization decisions in detail)
//
// =============================================================================
// READING %GetOptimizationStatus OUTPUT:
// =============================================================================
//
// %GetOptimizationStatus(fn) returns a bitmask. Common values:
//
//   Status = 1   -> Function exists but hasn't been called
//   Status = 2   -> Never optimized (may have optimization disabled)
//   Status = 17  -> Optimized with TurboFan (1 + 16)
//   Status = 33  -> Interpreted (1 + 32)
//   Status = 65  -> Optimized with Maglev (1 + 64)
//
// The decodeOptStatus() function below decodes these flags.
//
// BIT FLAGS:
//   Bit 0 (1):   is_function - Always set for valid functions
//   Bit 1 (2):   never_optimized - Optimization disabled for this function
//   Bit 3 (8):   is_optimized - Currently running optimized code
//   Bit 4 (16):  is_turbofanned - Optimized by TurboFan
//   Bit 5 (32):  is_interpreted - Running in interpreter (Ignition)
//   Bit 6 (64):  is_magleved - Optimized by Maglev (mid-tier)
//
// ADDITIONAL FLAGS (--trace-opt and --trace-deopt):
//   "[optimizing ... TurboFan]" - TurboFan is compiling the function
//   "[completed ... TurboFan]" - TurboFan finished compiling
//   "[bailout ...]" - Function can't be optimized (shows reason)
//   "[deoptimizing ...]" - Falling back to interpreter (shows reason)
// =============================================================================

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- V8 Compilation Tiers ---\n');

console.log('1. Ignition (Interpreter)');
console.log('   - Bytecode interpreter, fast startup');
console.log('   - Collects profiling feedback');
console.log('');
console.log('2. Sparkplug (Baseline Compiler)');
console.log('   - Quick compilation, moderate speed');
console.log('   - No optimization, just faster than interpreter');
console.log('');
console.log('3. Maglev (Mid-tier Compiler)');
console.log('   - Uses profiling feedback');
console.log('   - Faster compilation than TurboFan');
console.log('');
console.log('4. TurboFan (Optimizing Compiler)');
console.log('   - Full optimizations: inlining, type specialization');
console.log('   - Slower to compile, fastest execution');

console.log('\n--- Watching Optimization ---\n');

function add(a, b) {
  return a + b;
}

// Check initial status
console.log('Initial status:');
log('%GetOptimizationStatus(add)', %GetOptimizationStatus(add));

// Call it many times to trigger optimization
for (let i = 0; i < 10000; i++) {
  add(i, i + 1);
}

// Force optimization
%OptimizeFunctionOnNextCall(add);
add(1, 2);

console.log('\nAfter many calls:');
log('%GetOptimizationStatus(add)', %GetOptimizationStatus(add));

console.log('\n--- Optimization Status Codes ---\n');

// Status is a bitmask, key bits:
// Bit 1: Function is optimized
// Bit 2: Function is TurboFanned
// Bit 3: Function is Magleved

function decodeOptStatus(status) {
  const flags = [];
  if (status & 1) flags.push('is_function');
  if (status & 2) flags.push('never_optimized');
  if (status & 8) flags.push('is_optimized');
  if (status & 16) flags.push('is_turbofanned');
  if (status & 32) flags.push('is_interpreted');
  if (status & 64) flags.push('is_magleved');
  return flags.join(', ') || 'unknown';
}

log('add() flags', decodeOptStatus(%GetOptimizationStatus(add)));

console.log('\n--- Deoptimization ---\n');

function polyAdd(a, b) {
  return a + b;
}

// Optimize with numbers
for (let i = 0; i < 10000; i++) {
  polyAdd(i, i);
}
%OptimizeFunctionOnNextCall(polyAdd);
polyAdd(1, 2);

console.log('After optimizing with numbers:');
log('Status', decodeOptStatus(%GetOptimizationStatus(polyAdd)));

// Now call with strings - causes deoptimization
polyAdd('hello', ' world');

console.log('\nAfter calling with strings:');
log('Status', decodeOptStatus(%GetOptimizationStatus(polyAdd)));
console.log('(May have deoptimized and fallen back to interpreter)');

console.log('\n--- Functions That Can\'t Optimize ---\n');

function withEval() {
  // eval prevents many optimizations
  return eval('1 + 1');
}

function withArguments() {
  // Certain arguments patterns block optimization
  arguments[0] = 'modified';
  return arguments.length;
}

function withTryCatchFinally() {
  // Try-catch is now optimizable in modern V8, but complex
  // patterns may still prevent optimization
  try {
    throw new Error();
  } catch (e) {
    return e;
  }
}

// Try to optimize
for (let i = 0; i < 1000; i++) {
  withEval();
}

console.log('Functions with optimization barriers:');
log('withEval status', decodeOptStatus(%GetOptimizationStatus(withEval)));

console.log('\n--- Stable Types = Better Optimization ---\n');

// Monomorphic function - one type, easy to optimize
function multiplyNumbers(a, b) {
  return a * b;
}

// Always call with numbers
for (let i = 0; i < 10000; i++) {
  multiplyNumbers(i, 2);
}
%OptimizeFunctionOnNextCall(multiplyNumbers);
multiplyNumbers(5, 10);

log('Monomorphic multiply', decodeOptStatus(%GetOptimizationStatus(multiplyNumbers)));

// Polymorphic - multiple types, harder to optimize well
function multiplyAny(a, b) {
  return a * b;
}

for (let i = 0; i < 5000; i++) {
  multiplyAny(i, 2);      // numbers
}
for (let i = 0; i < 5000; i++) {
  multiplyAny(BigInt(i), 2n);  // bigints
}

log('Polymorphic multiply', decodeOptStatus(%GetOptimizationStatus(multiplyAny)));

console.log('\n--- Practical Implications ---\n');

console.log('For maximum performance:');
console.log('  1. Keep function argument types consistent');
console.log('  2. Avoid eval() and with statements');
console.log('  3. Let hot functions run many times before needing speed');
console.log('  4. Don\'t prematurely optimize - V8 is smart');
console.log('  5. Profile first, optimize where it matters');
