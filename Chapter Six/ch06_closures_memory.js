// Chapter 6: Functions - Closures and Memory
// See: "Closures as Context objects" and "Memory considerations with closures"
//
// When a function captures variables from its surrounding scope, the engine
// creates a Context object on the heap to hold those variables. This Context
// persists as long as any function references it, even if those functions
// don't actually use all the captured variables.

console.log('--- Closures Capture the Entire Context ---\n');

// The returned function only uses 'id', but the entire scope is captured
function processDataBad() {
  const largeData = 'x'.repeat(1_000_000);  // 1MB string
  const id = Math.random().toString(36);

  console.log('Processed', largeData.length, 'bytes');

  // This closure captures BOTH id AND largeData
  return function getId() {
    return id;
  };
}

// Better: separate concerns so largeData can be garbage collected
function processDataGood() {
  const largeData = 'x'.repeat(1_000_000);
  console.log('Processed', largeData.length, 'bytes');
  // largeData can be collected after this function returns
}

function createIdGetter() {
  const id = Math.random().toString(36);
  // This closure only captures 'id'
  return function getId() {
    return id;
  };
}

const getId1 = processDataBad();   // Keeps 1MB in memory
processDataGood();
const getId2 = createIdGetter();   // Only keeps the small id string

console.log('getId1:', getId1());
console.log('getId2:', getId2());

console.log('\n--- Function Creation in Loops ---\n');

// Each iteration creates a new function with its own Context
function setupHandlersBad(count) {
  const handlers = [];
  for (let i = 0; i < count; i++) {
    handlers.push(function() {
      return `Handler ${i}`;
    });
  }
  return handlers;
}

// This still works correctly, but creates many Context objects
const handlers = setupHandlersBad(5);
console.log(handlers[0]());  // Handler 0
console.log(handlers[4]());  // Handler 4

console.log('\n--- The var vs let Difference ---\n');

// With var: all callbacks share the SAME i because var is function-scoped
console.log('Using var (all share same i):');
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    process.stdout.write(i + ' ');
  }, 10);
}

// With let: each callback gets its OWN i because let is block-scoped
setTimeout(() => {
  console.log('\nUsing let (each has own i):');
  for (let j = 0; j < 3; j++) {
    setTimeout(function() {
      process.stdout.write(j + ' ');
    }, 10);
  }
}, 50);

setTimeout(() => console.log('\n'), 100);

// Closures allocate Context objects that persist as long as any function
// references them. Keep scope small when creating functions to avoid
// accidentally retaining large objects.
