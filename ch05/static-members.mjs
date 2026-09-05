// static members live on the constructor itself, not on instances.

class SecureDrawer {
  static label = 'Secure'; // on SecureDrawer
  static #created = 0; // private static field

  static create() {
    SecureDrawer.#created++;
    return new SecureDrawer();
  }
  static get createdCount() {
    return SecureDrawer.#created;
  }

  get status() {
    return 'locked';
  } // on SecureDrawer.prototype (per-instance)
}

console.log(SecureDrawer.label); // 'Secure' (static, on the constructor)

const drawer = new SecureDrawer();
console.log(drawer.label); // undefined (instances do not inherit statics)
console.log(drawer.status); // 'locked' (prototype accessor)

SecureDrawer.create();
SecureDrawer.create();
console.log(SecureDrawer.createdCount); // 2
