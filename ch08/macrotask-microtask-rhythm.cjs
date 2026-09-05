// Shows the rhythm "run macrotask, drain microtasks, run macrotask, drain microtasks". Output: microtask 1, task 1, microtask from task 1, task 2, task from microtask.
setTimeout(() => {
  console.log('task 1');
  Promise.resolve().then(() => console.log('microtask from task 1'));
}, 0);

setTimeout(() => {
  console.log('task 2');
}, 0);

Promise.resolve().then(() => {
  console.log('microtask 1');
  setTimeout(() => console.log('task from microtask'), 0);
});

// Trace: the script (macrotask 0) queues timer1, timer2, and one microtask.
// Microtasks drain first -> "microtask 1" (which queues timer3).
// timer1 -> "task 1" + queues a microtask, which drains -> "microtask from task 1".
// timer2 -> "task 2". timer3 -> "task from microtask".
