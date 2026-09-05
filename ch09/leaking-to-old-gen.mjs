// run: node --trace-gc --max-old-space-size=256 leaking-to-old-gen.mjs
// Retaining a slice per request promotes objects to the old generation: Mark-Compact pauses escalate, then OOM.

const cache = [];

function simulateRequest() {
  const response = [];
  for (let i = 0; i < 5000; i++) {
    response.push({ id: i, data: `item-${i}-${'x'.repeat(100)}` });
  }
  cache.push(response.slice(0, 500)); // the retained 500 survive into the old generation
}

for (let i = 0; i < 5000; i++) {
  simulateRequest();
}

console.log('done', cache.length);
