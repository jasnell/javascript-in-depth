// Chapter 6: Functions - Generators as State Machines
// See: "Generators" and "Iterator protocol"
//
// Generators can be thought of as state machines that suspend execution
// at each yield, preserving their internal state between calls. This makes
// them ideal for implementing finite state machines, parsers, and protocols.
//
// Run with: node ch06_generator_state_machine.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Generator Internal State ---\n');

function* counter() {
  let count = 0;
  while (true) {
    const increment = yield count;
    count += increment || 1;
  }
}

const gen = counter();
log('Initial', gen.next().value);       // 0
log('Default increment', gen.next().value);  // 1
log('After next(5)', gen.next(5).value);     // 6
log('After next(10)', gen.next(10).value);   // 16

console.log('\n--- Traffic Light State Machine ---\n');

function* trafficLight() {
  while (true) {
    console.log('  State: GREEN');
    yield 'green';
    console.log('  State: YELLOW');
    yield 'yellow';
    console.log('  State: RED');
    yield 'red';
  }
}

const light = trafficLight();
console.log('Cycling through states:');
for (let i = 0; i < 5; i++) {
  log(`  Step ${i}`, light.next().value);
}

console.log('\n--- Connection State Machine ---\n');

function* connectionStateMachine() {
  let state = 'disconnected';

  while (true) {
    const event = yield state;

    switch (state) {
      case 'disconnected':
        if (event === 'connect') state = 'connecting';
        break;
      case 'connecting':
        if (event === 'success') state = 'connected';
        else if (event === 'failure') state = 'disconnected';
        break;
      case 'connected':
        if (event === 'disconnect') state = 'disconnecting';
        else if (event === 'error') state = 'disconnected';
        break;
      case 'disconnecting':
        if (event === 'done') state = 'disconnected';
        break;
    }
  }
}

const conn = connectionStateMachine();
console.log('Connection state machine:');
log('  Initial state', conn.next().value);
log('  After "connect"', conn.next('connect').value);
log('  After "success"', conn.next('success').value);
log('  After "disconnect"', conn.next('disconnect').value);
log('  After "done"', conn.next('done').value);
log('  After "connect" again', conn.next('connect').value);
log('  After "failure"', conn.next('failure').value);

console.log('\n--- Token Stream Parser ---\n');

function* tokenizer(input) {
  let pos = 0;

  while (pos < input.length) {
    // Skip whitespace
    while (pos < input.length && /\s/.test(input[pos])) pos++;
    if (pos >= input.length) break;

    // Number
    if (/\d/.test(input[pos])) {
      let num = '';
      while (pos < input.length && /\d/.test(input[pos])) {
        num += input[pos++];
      }
      yield { type: 'NUMBER', value: parseInt(num) };
      continue;
    }

    // Operator
    if ('+-*/'.includes(input[pos])) {
      yield { type: 'OPERATOR', value: input[pos++] };
      continue;
    }

    // Unknown
    yield { type: 'UNKNOWN', value: input[pos++] };
  }

  yield { type: 'EOF', value: null };
}

const tokens = tokenizer('12 + 34 * 5');
console.log('Tokenizing "12 + 34 * 5":');
for (const token of tokens) {
  log('  Token', token);
}

console.log('\n--- Async-like Control Flow ---\n');

// Generators can pause and resume, simulating async behavior
function* fetchUserWorkflow() {
  console.log('  Starting workflow...');
  const userId = yield 'FETCH_USER_ID';

  console.log(`  Got user ID: ${userId}`);
  const userData = yield `FETCH_USER_DATA_${userId}`;

  console.log(`  Got user data: ${JSON.stringify(userData)}`);
  const result = yield `SAVE_RESULT_${userData.name}`;

  console.log(`  Saved result: ${result}`);
  return 'COMPLETE';
}

function runWorkflow(gen) {
  // Simple runner that simulates async operations
  const mockResponses = {
    'FETCH_USER_ID': 42,
    'FETCH_USER_DATA_42': { name: 'Alice', role: 'admin' },
    'SAVE_RESULT_Alice': true
  };

  let result = gen.next();
  while (!result.done) {
    const request = result.value;
    const response = mockResponses[request];
    console.log(`  [Runner] "${request}" -> ${JSON.stringify(response)}`);
    result = gen.next(response);
  }
  return result.value;
}

console.log('Running workflow:');
const workflowResult = runWorkflow(fetchUserWorkflow());
log('Workflow result', workflowResult);

console.log('\n--- Generator Return and Done ---\n');

function* limitedCounter(max) {
  let count = 0;
  while (count < max) {
    yield count++;
  }
  return 'finished';  // Return value when done
}

const limited = limitedCounter(3);
console.log('Iterator with return value:');
let step = limited.next();
while (!step.done) {
  log('  Value', step.value);
  step = limited.next();
}
log('  Return value (done=true)', step.value);

console.log('\n--- Generator.return() and .throw() ---\n');

function* cleanupExample() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } finally {
    console.log('  Cleanup in finally block');
  }
}

const cleanup1 = cleanupExample();
log('First value', cleanup1.next().value);
log('Early return', cleanup1.return('forced').value);

const cleanup2 = cleanupExample();
log('\nFirst value', cleanup2.next().value);
try {
  cleanup2.throw(new Error('Forced error'));
} catch (e) {
  log('Caught error', e.message);
}

console.log('\n--- Delegating to Sub-Generators ---\n');

function* subGen(name) {
  yield `${name}: start`;
  yield `${name}: middle`;
  yield `${name}: end`;
}

function* mainGen() {
  yield 'main: before A';
  yield* subGen('A');  // Delegate to subGen
  yield 'main: between';
  yield* subGen('B');  // Delegate again
  yield 'main: after B';
}

console.log('Delegated iteration:');
for (const value of mainGen()) {
  log('  Value', value);
}

console.log('\n--- Practical: Pagination State Machine ---\n');

function* paginator(pageSize, totalItems) {
  let currentPage = 1;
  const totalPages = Math.ceil(totalItems / pageSize);

  while (true) {
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, totalItems);

    const action = yield {
      page: currentPage,
      totalPages,
      start,
      end,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    };

    if (action === 'next' && currentPage < totalPages) {
      currentPage++;
    } else if (action === 'prev' && currentPage > 1) {
      currentPage--;
    } else if (typeof action === 'number') {
      currentPage = Math.max(1, Math.min(action, totalPages));
    }
  }
}

const pager = paginator(10, 45);
console.log('Pagination state:');
log('  Initial', pager.next().value);
log('  next', pager.next('next').value);
log('  next', pager.next('next').value);
log('  goto 5', pager.next(5).value);
log('  prev', pager.next('prev').value);
