// run: node --expose-gc finalization-registry.mjs
// A FinalizationRegistry callback fires with the held value after the registered object is collected.

const registry = new FinalizationRegistry((heldValue) => {
  console.log(`connection ${heldValue} was collected`);
});

function createConnection(id) {
  const conn = { id, socket: 'x'.repeat(1000) };
  registry.register(conn, id); // id is the held value, never the object itself
  return conn;
}

let c1 = createConnection('db-1');
let c2 = createConnection('db-2');

c1 = null; // drop strong references so the objects become collectable
c2 = null;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

globalThis.gc();
await wait(50);
globalThis.gc();
await wait(50);

console.log('done waiting for finalizers');
