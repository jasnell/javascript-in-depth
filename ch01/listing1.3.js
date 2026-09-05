// Demonstrates that setImmediate is not a global in Deno, so the unmodified puzzle throws a ReferenceError.
// run: deno run listing1.3.js
// Under Deno prints "elH" then throws: ReferenceError: setImmediate is not defined
// (Under Node.js this is identical to listing1.1 and prints Hello.)

function print(a) {
  process.stdout.write(a);
}

queueMicrotask(() => print('e'));
process.nextTick(() => print('H'));
setTimeout(() => print('l'), 0);
Promise.resolve().then(() => print('l'));
setImmediate(() => print('o\n'));
