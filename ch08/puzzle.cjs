// The five-queue puzzle. Run as CommonJS on Node.js v22+ it prints "Hello" (H e l l o).
function print(a) {
  process.stdout.write(a);
}

queueMicrotask(() => print('e')); // promise-style microtask
process.nextTick(() => print('H')); // Node nextTick queue (drains before microtasks)
setTimeout(() => print('l'), 0); // macrotask: timer phase
Promise.resolve().then(() => print('l')); // promise microtask
setImmediate(() => print('o')); // macrotask: check phase

// Node/CommonJS drains: nextTick(H) -> microtasks(e, l) -> timer(l) -> immediate(o) => "Hello".
// Cross-runtime (identical source, see chapter Table 8.1):
//   Node.js ESM  -> "elHlo"  (script runs as a microtask, so nextTick is no longer pre-drained first)
//   Deno  (ESM)  -> "elHol"
//   Bun   (ESM)  -> "Helol"
// Only queueMicrotask and Promise.then have language-defined ordering; nextTick,
// setTimeout(0) and setImmediate are all host-defined and vary by runtime.
// Caveat: at the top level, setTimeout(0) vs setImmediate order is not strictly
// guaranteed in Node; inside an I/O callback setImmediate always wins.
