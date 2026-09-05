// Shows Node drains the nextTick queue before promise microtasks, and the cross-runtime polyfill pitfall. Node output: nextTick, microtask, promise.
queueMicrotask(() => console.log('microtask'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));

// Node.js: nextTick has its own higher-priority queue that drains fully before
// the promise microtask queue, so -> nextTick, microtask, promise.
//
// Polyfill pitfall: Cloudflare Workers implements process.nextTick by deferring
// to queueMicrotask, so nextTick shares the ordinary microtask queue. There it
// runs in registration order -> microtask, nextTick, promise. Deno has been
// reported to run promise microtasks before nextTick in some contexts. Never
// rely on nextTick ordering in cross-runtime code; prefer queueMicrotask.
