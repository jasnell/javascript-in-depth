// class + extends + super; engines desugar these into the same prototype chains.

class Drawer {
  constructor(label, width, height, depth) {
    this.label = label;
    this.width = width;
    this.height = height;
    this.depth = depth;
  }
  // FIX: the manuscript's SecureDrawer.open() calls super.open(), so the
  // base class must actually define open() for that call to resolve.
  open() {
    console.log(`Opening ${this.label}`);
  }
}

class SecureDrawer extends Drawer {
  constructor(label, width, height, depth, lockType) {
    super(label, width, height, depth); // run the parent constructor first
    this.lockType = lockType;
    this.isLocked = true;
    this.authorizedUsers = [];
  }

  addAuthorizedUser(user) {
    this.authorizedUsers.push(user);
    console.log(`${user} added to authorized users for ${this.label}`);
  }

  open(user) {
    if (this.isLocked && !this.authorizedUsers.includes(user)) {
      return false;
    }
    if (this.isLocked) {
      this.isLocked = false;
    }
    super.open(); // reach the overridden parent method
    return true;
  }
}

const secureDrawer = new SecureDrawer('Tax documents', 20, 40, 60, 'key');
secureDrawer.addAuthorizedUser('alice');
console.log(secureDrawer.open('bob')); // false (locked, not authorized)
console.log(secureDrawer.open('alice')); // true, then 'Opening Tax documents'
console.log(secureDrawer instanceof SecureDrawer); // true
console.log(secureDrawer instanceof Drawer); // true
