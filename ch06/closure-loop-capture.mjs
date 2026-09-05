// var shares one Context across loop iterations; let creates a fresh one per iteration.

const varClosures = [];
for (var i = 0; i < 3; i++) {
  varClosures.push(() => i);
}
console.log(varClosures.map((fn) => fn())); // [ 3, 3, 3 ]

const letClosures = [];
for (let j = 0; j < 3; j++) {
  letClosures.push(() => j);
}
console.log(letClosures.map((fn) => fn())); // [ 0, 1, 2 ]

// Preferred alternative to creating functions inside a loop: a factory that
// captures only the varying value.
function createHandler(index) {
  return () => `Clicked element ${index}`;
}
const handlers = [0, 1, 2].map(createHandler);
console.log(handlers.map((fn) => fn())); // Clicked element 0/1/2
