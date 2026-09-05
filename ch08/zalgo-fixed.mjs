// The Zalgo cure: a promise-based getData that is ALWAYS asynchronous, so cache hit and miss behave identically. The sync line always prints before either result.
const cache = new Map();

function fetchFromServer(key) {
  return new Promise((resolve) => setTimeout(() => resolve(`value-for-${key}`), 10));
}

async function getData(key) {
  if (cache.has(key)) {
    return cache.get(key); // still delivered through a promise, so still deferred
  }
  const value = await fetchFromServer(key);
  cache.set(key, value);
  return value;
}

const miss = getData('user'); // cache miss
console.log('getData returned a pending promise (result not available yet)');
console.log('miss ->', await miss);

const hit = getData('user'); // cache hit, but STILL asynchronous
console.log('even a cache hit returns a promise, so ordering is identical');
console.log('hit  ->', await hit);

// Expected output:
// getData returned a pending promise (result not available yet)
// miss -> value-for-user
// even a cache hit returns a promise, so ordering is identical
// hit  -> value-for-user
//
// The consuming side always runs in a fresh call stack, on both paths. No Zalgo.
