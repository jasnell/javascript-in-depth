// The error stack: capture, Error.stackTraceLimit, Error.captureStackTrace.

function inner() {
  throw new Error('Problem here');
}
function middle() {
  return inner();
}
function outer() {
  return middle();
}

try {
  outer();
} catch (e) {
  // .stack is captured at creation and serialized to a string on first read.
  console.log(e.stack.split('\n').slice(0, 4).join('\n'));
}

// stackTraceLimit caps how many frames are captured. Fewer frames means
// cheaper creation and less memory; 0 disables capture entirely.
Error.stackTraceLimit = 1;
console.log('\nlimit=1:', new Error('shallow').stack.split('\n').length, 'line(s)');

Error.stackTraceLimit = 0;
console.log('limit=0:', new Error('none').stack.split('\n').length, 'line(s)');

Error.stackTraceLimit = 10; // restore a useful default

// Error.captureStackTrace (V8/Node) attaches a stack to an arbitrary object
// and can hide frames at or above a given function for cleaner traces.
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    // Omit the constructor frame so the trace starts at the caller.
    Error.captureStackTrace(this, ValidationError);
  }
}

function validate() {
  throw new ValidationError('bad input');
}
try {
  validate();
} catch (e) {
  console.log('\n' + e.stack.split('\n').slice(0, 2).join('\n'));
}
