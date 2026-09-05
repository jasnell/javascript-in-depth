// The finally trap: a return or throw in finally overrides the try's error.

function suppressed() {
  try {
    throw new Error('This disappears');
  } finally {
    return 'Success!'; // return in finally swallows the thrown error
  }
}

function replaced() {
  try {
    throw new Error('This disappears');
  } finally {
    throw new Error('This replaces it'); // throw in finally masks the original
  }
}

console.log(suppressed()); // "Success!" with no error surfaced

try {
  replaced();
} catch (e) {
  console.log(e.message); // "This replaces it", the original is lost
}

// Safe pattern: use finally only for cleanup, never for control flow.
function safe() {
  let acquired = false;
  try {
    acquired = true;
    throw new Error('real failure');
  } finally {
    if (acquired) console.log('cleanup ran'); // no return/throw here
  }
}
try {
  safe();
} catch (e) {
  console.log('propagated:', e.message); // original error still escapes
}
