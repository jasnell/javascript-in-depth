// Writes a .heapsnapshot file with v8.writeHeapSnapshot() that can be loaded into Chrome DevTools.

import v8 from 'node:v8';

// Retain something identifiable so the snapshot has objects to inspect.
const held = [];
for (let i = 0; i < 10_000; i++) {
  held.push({ id: i, token: 'tok_' + i.toString(16), payload: new Array(8).fill(i) });
}

// writeHeapSnapshot triggers a full GC first, so the file reflects only
// what is actually reachable. Called with no argument it returns the
// generated filename; pass a path to choose your own.
const filename = v8.writeHeapSnapshot();
console.log(`Snapshot written to ${filename}`);
console.log(`Retained ${held.length} records`);
