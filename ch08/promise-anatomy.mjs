// Shows promise states (pending/fulfilled/rejected), that a settled promise never changes, and that .then reactions are microtasks.
import { inspect } from 'node:util';

const pending = new Promise(() => {}); // never settles
const fulfilled = Promise.resolve(42);
const rejected = Promise.reject(new Error('boom'));
rejected.catch(() => {}); // attach handler so it is not reported unhandled

console.log('pending  ->', inspect(pending)); // Promise { <pending> }
console.log('fulfilled->', inspect(fulfilled)); // Promise { 42 }
console.log('rejected ->', inspect(rejected)); // Promise { <rejected> Error: boom }

// Once settled the state is frozen: the extra resolve/reject calls are ignored.
const once = new Promise((resolve, reject) => {
  resolve('first');
  resolve('second');
  reject(new Error('third'));
});

// Every .then appends a reaction record; all reactions run as microtasks,
// in registration order, only after the current synchronous code finishes.
once.then((v) => console.log('settled value stays:', v)); // "first"
fulfilled.then(() => console.log('reaction A'));
fulfilled.then(() => console.log('reaction B'));
fulfilled.then(() => console.log('reaction C'));

console.log('sync line runs before any reaction');

// Expected output:
// pending  -> Promise { <pending> }
// fulfilled-> Promise { 42 }
// rejected -> Promise { <rejected> Error: boom ... }
// sync line runs before any reaction
// settled value stays: first
// reaction A
// reaction B
// reaction C
