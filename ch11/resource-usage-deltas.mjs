// Computes per-interval deltas from process.resourceUsage() for the cumulative CPU, context-switch, and page-fault counters.

// The counters (userCPUTime, context switches, faults) are cumulative for
// the process lifetime, so a single reading is meaningless. Deltas between
// two samples show what happened during the interval.
let last = process.resourceUsage();

// Give userCPUTime something to accumulate each tick.
function burnCpu() {
  let x = 0;
  for (let i = 0; i < 5_000_000; i++) x += Math.sqrt(i);
  return x;
}

setInterval(() => {
  burnCpu();
  const now = process.resourceUsage();
  console.log(
    `userCPU ${now.userCPUTime - last.userCPUTime} us  ` +
    `sysCPU ${now.systemCPUTime - last.systemCPUTime} us  ` +
    `voluntaryCS ${now.voluntaryContextSwitches - last.voluntaryContextSwitches}  ` +
    `involuntaryCS ${now.involuntaryContextSwitches - last.involuntaryContextSwitches}  ` +
    `majorFault ${now.majorPageFault - last.majorPageFault}`,
  );
  last = now;
}, 2000);
