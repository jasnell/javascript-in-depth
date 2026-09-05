// Private fields (#name) and methods are accessible only inside the class body.

class SecureDrawer {
  #pinCode; // private field declaration

  constructor(pin) {
    this.#pinCode = pin;
  }

  #validatePin(pin) {
    // private method
    return this.#pinCode === pin;
  }

  unlock(pin) {
    if (!this.#validatePin(pin)) {
      throw new Error('access denied');
    }
    return 'unlocked';
  }
}

const secureDrawer = new SecureDrawer(12345);
console.log(secureDrawer.unlock(12345)); // 'unlocked'

try {
  secureDrawer.unlock(99999);
} catch (err) {
  console.log(err.message); // 'access denied'
}

// Private members are invisible from outside: no enumeration, no descriptor.
console.log(Object.keys(secureDrawer)); // []
console.log(Object.getOwnPropertyDescriptor(secureDrawer, 'pinCode')); // undefined

// Even syntactic access from outside the class is a SyntaxError, so we can
// only note it here: `secureDrawer.#pinCode` would fail to parse.
