// Listing 2.2: username registration that fails to normalize, then the normalized fix
// Uses escapes so the two encodings of "jose" are unambiguous in source.
const joseComposed = 'josé';      // e as single codepoint U+00E9
const joseDecomposed = 'josé';   // e + combining accent U+0065 U+0301

const existingUsers = ['josé', 'müller', 'café_owner'];

// Broken version: compares raw code units, so the two encodings are distinct.
function registerUser(username) {
  if (existingUsers.includes(username)) {
    return 'Username already taken';
  }
  existingUsers.push(username);
  return 'Registration successful';
}

console.log(registerUser(joseComposed));   // Username already taken (already present)
console.log(registerUser(joseDecomposed)); // Registration successful (BUG: visually identical)

// Fixed version: normalize before comparing.
const fixedUsers = [joseComposed];
function registerUserFixed(username) {
  const normalized = username.normalize();
  if (fixedUsers.some((u) => u.normalize() === normalized)) {
    return 'Username already taken';
  }
  fixedUsers.push(username);
  return 'Registration successful';
}

console.log(registerUserFixed(joseDecomposed)); // Username already taken
