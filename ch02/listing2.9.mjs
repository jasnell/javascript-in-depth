// Listing 2.9: anti-pattern - an unbounded cache that never evicts, growing forever
const cache = new Map();

function getCachedResult(key, generator, data) {
  if (cache.has(key)) return cache.get(key);
  const result = generator(data);
  cache.set(key, result); // stored forever; nothing is ever removed
  return result;
}

const gen = (n) => 'x'.repeat(n);
console.log(getCachedResult('a', gen, 5)); // computed
console.log(getCachedResult('a', gen, 5)); // served from cache
console.log('cache size:', cache.size);
