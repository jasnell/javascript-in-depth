// Chapter 7: Errors - Error Serialization
// See: "Error serialization" and "Structured cloning"
//
// Errors don't serialize well by default. JSON.stringify loses most properties,
// and structuredClone preserves some but not all. This demo shows the problems
// and solutions for error serialization across different contexts.
//
// Run with: node ch07_error_serialization.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- The JSON.stringify Problem ---\n');

const originalError = new Error('Something went wrong');
originalError.code = 'ERR_CUSTOM';
originalError.details = { userId: 123 };

log('Original error properties', Object.keys(originalError));
log('message', originalError.message);
log('name', originalError.name);
log('code', originalError.code);
log('stack (first line)', originalError.stack?.split('\n')[0]);

console.log('\nAfter JSON.stringify:');
const jsonified = JSON.stringify(originalError);
log('Result', jsonified);  // Just "{}"!

// Why? name, message, and stack are non-enumerable
console.log('\nProperty descriptors:');
log('message enumerable', Object.getOwnPropertyDescriptor(originalError, 'message')?.enumerable);
log('code enumerable', Object.getOwnPropertyDescriptor(originalError, 'code')?.enumerable);

console.log('\n--- Manual Serialization ---\n');

function serializeError(err) {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
    code: err.code,
    cause: err.cause ? serializeError(err.cause) : undefined,
    // Include any custom enumerable properties
    ...Object.fromEntries(
      Object.entries(err).filter(([k]) => !['name', 'message', 'stack', 'cause'].includes(k))
    )
  };
}

function deserializeError(obj) {
  const ErrorClass = globalThis[obj.name] || Error;
  const err = new ErrorClass(obj.message);
  err.stack = obj.stack;
  if (obj.code) err.code = obj.code;
  if (obj.cause) err.cause = deserializeError(obj.cause);

  // Restore custom properties
  for (const [key, value] of Object.entries(obj)) {
    if (!['name', 'message', 'stack', 'cause'].includes(key)) {
      err[key] = value;
    }
  }

  return err;
}

const serialized = serializeError(originalError);
console.log('Serialized:');
console.log(JSON.stringify(serialized, null, 2));

const deserialized = deserializeError(serialized);
console.log('\nDeserialized:');
log('name', deserialized.name);
log('message', deserialized.message);
log('code', deserialized.code);
log('details', deserialized.details);

console.log('\n--- Error with Cause Chain ---\n');

const rootError = new Error('Database connection failed');
rootError.code = 'ECONNREFUSED';

const middleError = new Error('Query execution failed', { cause: rootError });
middleError.query = 'SELECT * FROM users';

const topError = new Error('Failed to load user data', { cause: middleError });
topError.userId = 42;

console.log('Original cause chain:');
let current = topError;
let depth = 0;
while (current) {
  console.log(`${'  '.repeat(depth)}${current.name}: ${current.message}`);
  current = current.cause;
  depth++;
}

console.log('\nSerialized and deserialized:');
const chainSerialized = JSON.stringify(serializeError(topError), null, 2);
const chainDeserialized = deserializeError(JSON.parse(chainSerialized));

current = chainDeserialized;
depth = 0;
while (current) {
  console.log(`${'  '.repeat(depth)}${current.name}: ${current.message}`);
  current = current.cause;
  depth++;
}

console.log('\n--- structuredClone Behavior ---\n');

// structuredClone (and postMessage) can clone Errors, but with limitations
const errorToClone = new Error('Clone me');
errorToClone.customProp = 'custom value';

const cloned = structuredClone(errorToClone);

log('Original message', errorToClone.message);
log('Cloned message', cloned.message);
log('Original customProp', errorToClone.customProp);
log('Cloned customProp', cloned.customProp);  // NOT preserved!
log('Stack preserved', !!cloned.stack);
log('name preserved', cloned.name);

console.log('\nstructuredClone preserves:');
console.log('  - message');
console.log('  - name');
console.log('  - stack');
console.log('  - cause (but only if it\'s also cloneable)');
console.log('\nstructuredClone does NOT preserve:');
console.log('  - Custom properties (like code, details, etc.)');
console.log('  - Methods');

console.log('\n--- Error Types in structuredClone ---\n');

const errorTypes = [
  new Error('Error'),
  new TypeError('TypeError'),
  new RangeError('RangeError'),
  new SyntaxError('SyntaxError'),
  new URIError('URIError'),
  new EvalError('EvalError'),
  new ReferenceError('ReferenceError')
];

for (const err of errorTypes) {
  const clone = structuredClone(err);
  log(`${err.name} type preserved`, clone.constructor.name === err.constructor.name);
}

console.log('\n--- Practical: Error Logging Format ---\n');

function formatErrorForLogging(err, includeStack = true) {
  const base = {
    timestamp: new Date().toISOString(),
    error: {
      type: err.name,
      message: err.message,
      code: err.code,
    },
    context: {}
  };

  if (includeStack) {
    base.error.stack = err.stack?.split('\n').slice(1).map(line => line.trim());
  }

  if (err.cause) {
    base.error.cause = formatErrorForLogging(err.cause, includeStack).error;
  }

  // Collect all custom properties as context
  for (const [key, value] of Object.entries(err)) {
    if (!['name', 'message', 'stack', 'cause', 'code'].includes(key)) {
      base.context[key] = value;
    }
  }

  return base;
}

const loggableError = new Error('Request failed');
loggableError.code = 'HTTP_500';
loggableError.endpoint = '/api/users';
loggableError.method = 'POST';
loggableError.requestId = 'abc-123';

console.log('Formatted for logging:');
console.log(JSON.stringify(formatErrorForLogging(loggableError, false), null, 2));

console.log('\n--- AggregateError Serialization ---\n');

function serializeAggregateError(err) {
  const base = serializeError(err);
  if (err instanceof AggregateError) {
    base.errors = err.errors.map(e =>
      e instanceof AggregateError ? serializeAggregateError(e) : serializeError(e)
    );
  }
  return base;
}

const aggregate = new AggregateError([
  new Error('First error'),
  new TypeError('Second error'),
  new AggregateError([new Error('Nested 1'), new Error('Nested 2')], 'Nested aggregate')
], 'Multiple failures');

console.log('Serialized AggregateError:');
console.log(JSON.stringify(serializeAggregateError(aggregate), null, 2).slice(0, 500) + '...');

console.log('\n--- toJSON Method ---\n');

// Custom error class with toJSON
class SerializableError extends Error {
  constructor(message, options = {}) {
    super(message, options);
    this.code = options.code;
    this.context = options.context || {};
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
      cause: this.cause instanceof Error && this.cause.toJSON
        ? this.cause.toJSON()
        : this.cause
    };
  }
}

const serializableErr = new SerializableError('Custom error', {
  code: 'CUSTOM_001',
  context: { userId: 42, action: 'delete' }
});

log('JSON.stringify works', JSON.stringify(serializableErr, null, 2));

console.log('\n--- Summary ---\n');

console.log('Error serialization strategies:');
console.log('  1. JSON.stringify: Loses most data (non-enumerable props)');
console.log('  2. structuredClone: Preserves type/message/stack, loses custom props');
console.log('  3. Manual serialize/deserialize: Full control, handles everything');
console.log('  4. Custom toJSON: Clean API for serializable errors');
