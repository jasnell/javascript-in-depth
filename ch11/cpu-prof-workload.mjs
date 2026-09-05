// run: node --cpu-prof cpu-prof-workload.mjs
// A small mixed workload that produces a .cpuprofile file on exit, loadable into the DevTools Performance panel.

// Two distinct hot paths so the profile shows self-time split between them.
function buildStrings(n) {
  let s = '';
  for (let i = 0; i < n; i++) s += i.toString(36) + '-';
  return s.length;
}

function crunchNumbers(n) {
  let total = 0;
  for (let i = 0; i < n; i++) total += Math.sqrt(i) * Math.sin(i);
  return total;
}

let acc = 0;
for (let round = 0; round < 200; round++) {
  acc += buildStrings(20_000);
  acc += crunchNumbers(200_000);
}
console.log(`done, acc=${acc.toFixed(0)}`);
// --cpu-prof writes CPU.<date>.<pid>.<tid>.<seq>.cpuprofile when the process exits.
