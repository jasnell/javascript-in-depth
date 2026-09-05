// Concept: quadratic += concatenation vs linear array join for large template building
function buildWithConcat(n) {
  let html = '';
  for (let i = 0; i < n; i++) {
    html += `<tr><td>${i}</td></tr>`;
  }
  return html;
}

function buildWithJoin(n) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    parts.push(`<tr><td>${i}</td></tr>`);
  }
  return parts.join('');
}

const n = 200_000;

let start = performance.now();
const a = buildWithConcat(n);
console.log('concat +=:', (performance.now() - start).toFixed(1), 'ms', a.length);

start = performance.now();
const b = buildWithJoin(n);
console.log('array join:', (performance.now() - start).toFixed(1), 'ms', b.length);

console.log('identical output:', a === b);
