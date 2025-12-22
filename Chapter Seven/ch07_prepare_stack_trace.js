// Chapter 7: Errors - Error.prepareStackTrace
// See: "Stack traces" and "Customizing error output"
//
// V8 provides Error.prepareStackTrace, a hook that lets you customize
// how stack traces are formatted. This is powerful for logging frameworks,
// error monitoring, and debugging tools.
//
// Run with: node ch07_prepare_stack_trace.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Default Stack Trace ---\n');

function level3() {
  throw new Error('Something went wrong');
}
function level2() { level3(); }
function level1() { level2(); }

try {
  level1();
} catch (e) {
  console.log('Default format:');
  console.log(e.stack);
}

console.log('\n--- Error.prepareStackTrace API ---\n');

console.log('V8 calls prepareStackTrace(error, structuredStackTrace)');
console.log('  error: The Error object');
console.log('  structuredStackTrace: Array of CallSite objects');
console.log('');
console.log('CallSite methods:');
console.log('  .getFunctionName()  - Name of the function');
console.log('  .getFileName()      - Source file path');
console.log('  .getLineNumber()    - Line number');
console.log('  .getColumnNumber()  - Column number');
console.log('  .getTypeName()      - Type name (for methods)');
console.log('  .getMethodName()    - Method name');
console.log('  .isNative()         - Is this in native code?');
console.log('  .isEval()           - Is this from eval()?');

console.log('\n--- Custom Stack Formatter ---\n');

// Save original
const originalPrepare = Error.prepareStackTrace;

// Custom formatter
Error.prepareStackTrace = (error, stack) => {
  const lines = [`${error.name}: ${error.message}`];

  for (const frame of stack) {
    const funcName = frame.getFunctionName() || '<anonymous>';
    const fileName = frame.getFileName() || '<unknown>';
    const lineNo = frame.getLineNumber();
    const colNo = frame.getColumnNumber();

    // Extract just the filename, not full path
    const shortFile = fileName.split('/').pop();

    lines.push(`    → ${funcName} (${shortFile}:${lineNo}:${colNo})`);
  }

  return lines.join('\n');
};

function customLevel3() {
  throw new Error('Custom formatted error');
}
function customLevel2() { customLevel3(); }
function customLevel1() { customLevel2(); }

try {
  customLevel1();
} catch (e) {
  console.log('Custom format:');
  console.log(e.stack);
}

console.log('\n--- Structured Error Data ---\n');

// Get structured data instead of string
Error.prepareStackTrace = (error, stack) => {
  return {
    message: error.message,
    frames: stack.map(frame => ({
      function: frame.getFunctionName(),
      file: frame.getFileName(),
      line: frame.getLineNumber(),
      column: frame.getColumnNumber(),
      isNative: frame.isNative(),
      isEval: frame.isEval()
    }))
  };
};

function structuredLevel3() {
  return new Error('Structured error');
}
function structuredLevel2() { return structuredLevel3(); }
function structuredLevel1() { return structuredLevel2(); }

const structured = structuredLevel1();
console.log('Structured stack data:');
console.log(JSON.stringify(structured.stack, null, 2));

console.log('\n--- Filtering Stack Frames ---\n');

Error.prepareStackTrace = (error, stack) => {
  // Filter out internal/library frames
  const appFrames = stack.filter(frame => {
    const file = frame.getFileName() || '';
    // Keep only app code, not node internals
    return !file.includes('node:') &&
           !file.includes('node_modules');
  });

  const lines = [`${error.name}: ${error.message}`];
  for (const frame of appFrames) {
    const funcName = frame.getFunctionName() || '<anonymous>';
    const line = frame.getLineNumber();
    lines.push(`    at ${funcName} (line ${line})`);
  }
  return lines.join('\n');
};

function appLevel3() {
  throw new Error('Filtered stack');
}
function appLevel2() { appLevel3(); }
function appLevel1() { appLevel2(); }

try {
  appLevel1();
} catch (e) {
  console.log('Filtered stack (app code only):');
  console.log(e.stack);
}

// Restore original
Error.prepareStackTrace = originalPrepare;

console.log('\n--- Performance Considerations ---\n');

console.log('prepareStackTrace is called lazily when .stack is accessed');
console.log('If you never access .stack, your function is never called');
console.log('');
console.log('Expensive operations in prepareStackTrace can slow down');
console.log('error handling significantly.');

console.log('\n--- Use Cases ---\n');

console.log('1. Logging frameworks - custom format for log aggregation');
console.log('2. Error monitoring - extract structured data for analysis');
console.log('3. Security - hide internal paths from error messages');
console.log('4. Debugging - add extra context like local variables');
console.log('5. Source maps - translate from compiled to source locations');

console.log('\n--- Caution ---\n');

console.log('prepareStackTrace is V8-specific (Node.js, Chrome)');
console.log('Not available in all JavaScript environments');
console.log('Libraries should save and restore the original');
