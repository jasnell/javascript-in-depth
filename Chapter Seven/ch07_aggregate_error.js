// Chapter 7: Errors - AggregateError
// See: "AggregateError" and "Promise.any"
//
// AggregateError wraps multiple errors into one. It's thrown by Promise.any()
// when all promises reject, and is useful for batch operations where you
// want to collect and report multiple failures.
//
// Run with: node ch07_aggregate_error.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Basic AggregateError ---\n');

const errors = [
  new Error('First failure'),
  new TypeError('Second failure'),
  new RangeError('Third failure')
];

const aggregate = new AggregateError(errors, 'Multiple errors occurred');

log('message', aggregate.message);
log('name', aggregate.name);
log('errors.length', aggregate.errors.length);

console.log('\nIndividual errors:');
for (const [i, err] of aggregate.errors.entries()) {
  log(`  errors[${i}]`, `${err.name}: ${err.message}`);
}

console.log('\n--- AggregateError from Promise.any() ---\n');

// Promise.any throws AggregateError when ALL promises reject
const promises = [
  Promise.reject(new Error('Service A failed')),
  Promise.reject(new Error('Service B failed')),
  Promise.reject(new Error('Service C failed'))
];

try {
  await Promise.any(promises);
} catch (e) {
  log('Caught', e.name);
  log('message', e.message);
  console.log('Individual rejections:');
  for (const err of e.errors) {
    log('  -', err.message);
  }
}

console.log('\n--- Promise.any() Success Case ---\n');

const mixedPromises = [
  Promise.reject(new Error('First failed')),
  Promise.resolve('Second succeeded'),
  Promise.reject(new Error('Third failed'))
];

try {
  const result = await Promise.any(mixedPromises);
  log('Promise.any result', result);
} catch (e) {
  log('Error', e.message);
}

console.log('\n--- Practical: Batch Validation ---\n');

function validateUser(user) {
  const errors = [];

  if (!user.name || user.name.length < 2) {
    errors.push(new Error('Name must be at least 2 characters'));
  }

  if (!user.email || !user.email.includes('@')) {
    errors.push(new Error('Invalid email address'));
  }

  if (!user.age || user.age < 0 || user.age > 150) {
    errors.push(new Error('Age must be between 0 and 150'));
  }

  if (user.password && user.password.length < 8) {
    errors.push(new Error('Password must be at least 8 characters'));
  }

  if (errors.length > 0) {
    throw new AggregateError(errors, 'User validation failed');
  }

  return true;
}

console.log('Validating invalid user:');
try {
  validateUser({ name: 'A', email: 'bad-email', age: -5, password: '123' });
} catch (e) {
  log('Error type', e.name);
  console.log('Validation errors:');
  for (const err of e.errors) {
    log('  -', err.message);
  }
}

console.log('\nValidating valid user:');
try {
  validateUser({ name: 'Alice', email: 'alice@example.com', age: 30 });
  console.log('  Validation passed!');
} catch (e) {
  log('Error', e.message);
}

console.log('\n--- Practical: Multi-Service Fetch ---\n');

async function fetchFromServices(endpoints) {
  const results = await Promise.allSettled(
    endpoints.map(async (url) => {
      // Simulate fetch
      if (url.includes('fail')) {
        throw new Error(`Failed to fetch ${url}`);
      }
      return { url, data: `Data from ${url}` };
    })
  );

  const successes = [];
  const errors = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      successes.push(result.value);
    } else {
      errors.push(result.reason);
    }
  }

  if (errors.length > 0 && successes.length === 0) {
    throw new AggregateError(errors, 'All service requests failed');
  }

  return { successes, errors };
}

const endpoints = [
  'https://api.service1.com/data',
  'https://api.fail-service.com/data',
  'https://api.service2.com/data',
  'https://api.fail-again.com/data'
];

try {
  const { successes, errors: partialErrors } = await fetchFromServices(endpoints);
  log('Successful requests', successes.length);
  log('Failed requests', partialErrors.length);

  console.log('\nSuccesses:');
  for (const s of successes) {
    log('  -', s.url);
  }

  console.log('\nFailures:');
  for (const e of partialErrors) {
    log('  -', e.message);
  }
} catch (e) {
  log('All failed', e.message);
}

console.log('\n--- Nested AggregateErrors ---\n');

// AggregateError can contain other AggregateErrors
const dbErrors = new AggregateError([
  new Error('Connection timeout'),
  new Error('Query failed')
], 'Database errors');

const apiErrors = new AggregateError([
  new Error('Rate limit exceeded'),
  new Error('Authentication failed')
], 'API errors');

const combined = new AggregateError([dbErrors, apiErrors], 'System failures');

function flattenAggregateError(err, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}${err.name}: ${err.message}`);

  if (err.errors) {
    for (const child of err.errors) {
      if (child instanceof AggregateError) {
        flattenAggregateError(child, depth + 1);
      } else {
        console.log(`${indent}  - ${child.message}`);
      }
    }
  }
}

console.log('Nested error tree:');
flattenAggregateError(combined);

console.log('\n--- AggregateError with cause ---\n');

// Can combine with Error.cause for even more context
const rootCause = new Error('Network unreachable');
const aggregateWithCause = new AggregateError(
  [new Error('Retry 1 failed'), new Error('Retry 2 failed')],
  'All retries exhausted',
  { cause: rootCause }
);

log('message', aggregateWithCause.message);
log('cause', aggregateWithCause.cause?.message);
log('errors count', aggregateWithCause.errors.length);

console.log('\n--- Checking for AggregateError ---\n');

function handleError(err) {
  if (err instanceof AggregateError) {
    console.log(`Multiple errors (${err.errors.length}):`);
    for (const e of err.errors) {
      console.log(`  - ${e.message}`);
    }
  } else {
    console.log(`Single error: ${err.message}`);
  }
}

handleError(new Error('Single failure'));
console.log('');
handleError(new AggregateError([
  new Error('Error A'),
  new Error('Error B')
], 'Batch failure'));
