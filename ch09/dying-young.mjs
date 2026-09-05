// run: node --trace-gc dying-young.mjs
// Per-request objects die before the next scavenge, so the trace shows only Scavenge lines.

function simulateRequest() {
  const response = [];
  for (let i = 0; i < 5000; i++) {
    response.push({ id: i, data: `item-${i}-${'x'.repeat(100)}` });
  }
  return response.length;
}

let total = 0;
for (let i = 0; i < 5000; i++) {
  total += simulateRequest();
}

console.log('done', total);
