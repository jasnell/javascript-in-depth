// Shows the whole microtask queue drains (even microtasks that enqueue more microtasks) before the next macrotask fires.
setTimeout(() => console.log('timeout: the macrotask finally runs'), 0);

let n = 0;
function reschedule() {
  n++;
  if (n <= 5) {
    console.log('microtask', n);
    queueMicrotask(reschedule); // enqueues another microtask from within a microtask
  } else {
    console.log('microtask queue drained after', n - 1, 'iterations');
  }
}

queueMicrotask(reschedule);
console.log('sync done');

// Expected: sync done, microtask 1..5, drained message, THEN the timeout.
// A recursive microtask always finishes ahead of the timer. An UNBOUNDED
// version (if (true) queueMicrotask(reschedule)) would starve the event loop
// forever: the timer would never fire. That is microtask starvation.
