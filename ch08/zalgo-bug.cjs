// Shows Zalgo: a callback API that runs synchronously on a cache hit but asynchronously on a cache miss, so the same call site behaves differently. Output: "after first (miss): null" then "after second (hit): value-for-user".
const cache = new Map();

function fetchFromServer(key, cb) {
  setTimeout(() => cb(`value-for-${key}`), 10); // genuinely async
}

function getData(key, callback) {
  if (cache.has(key)) {
    callback(cache.get(key)); // SYNC: runs in the caller's stack, before getData returns
  } else {
    fetchFromServer(key, (value) => {
      cache.set(key, value);
      callback(value); // ASYNC: runs in a future stack, long after getData returns
    });
  }
}

let result = null;
getData('user', (data) => { result = data; });
console.log('after first (miss):', result); // null: the callback has not run yet

setTimeout(() => {
  let cached = null;
  getData('user', (data) => { cached = data; }); // now a cache hit -> callback ran synchronously
  console.log('after second (hit):', cached); // value-for-user
}, 50);

// Same function, same call site, two different behaviors driven by hidden state.
// An error thrown from the callback is catchable on the sync path and uncatchable
// on the async path. See zalgo-fixed.mjs for the always-async cure.
