// Listing 2.12: benchmark ConsString vs flattened string on stream writes
// Fixed: `start` is a let (the book reassigned a const).
import { createWriteStream } from 'node:fs';

const stream = createWriteStream('/dev/null');

// Coercing with `| 0` is one operation that makes V8 flatten the ConsString.
function flatstr(s) {
  s | 0;
  return s;
}

function makeStr(str, concats) {
  let s = '';
  while (concats--) {
    s += str;
  }
  return s;
}

function unflattenedManySmallConcats() {
  stream.write(makeStr('a', 10_000));
}

function flattenedManySmallConcats() {
  stream.write(flatstr(makeStr('a', 10_000)));
}

let start = performance.now();
for (let n = 0; n < 10_000; n++) {
  unflattenedManySmallConcats();
}
console.log('unflattened:', performance.now() - start);

start = performance.now();
for (let n = 0; n < 10_000; n++) {
  flattenedManySmallConcats();
}
console.log('flattened:', performance.now() - start);
