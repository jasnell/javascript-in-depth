// Async transform generator: consumes one async iterable and yields transformed values, composing pull-based stages.
async function* source() {
  for (const word of ['alpha', 'beta', 'gamma']) yield word;
}

async function* upper(iterable) {
  for await (const chunk of iterable) {
    yield chunk.toUpperCase();
  }
}

for await (const value of upper(source())) {
  console.log(value);
}
