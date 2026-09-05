// Async generator source: yield produces values on demand; for-await-of pulls one at a time with natural backpressure.
async function* countUp(limit) {
  for (let i = 0; i < limit; i++) {
    await new Promise((resolve) => setTimeout(resolve, 5)); // simulate async work per value
    yield i; // suspends here until the consumer asks for the next value
  }
}

for await (const value of countUp(5)) {
  console.log(value); // the generator stays suspended until this iteration finishes
}
