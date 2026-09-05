// Symbol keys never collide and stay out of normal enumeration.

const lib1ToString = Symbol('toString');
const lib2ToString = Symbol('toString'); // same description, distinct symbol

const drawer = {
  label: 'taxes',
  contents: 'documents',
  [lib1ToString]() {
    return `Library1: ${this.label}`;
  },
  [lib2ToString]() {
    return `Library2: ${this.contents}`;
  },
};

// Same-description symbols are different keys, so both coexist.
console.log(lib1ToString === lib2ToString); // false
console.log(drawer[lib1ToString]()); // 'Library1: taxes'
console.log(drawer[lib2ToString]()); // 'Library2: documents'

// Symbol keys do not appear in ordinary enumeration.
console.log(Object.keys(drawer)); // ['label', 'contents']
console.log(Object.getOwnPropertySymbols(drawer).length); // 2 (only via the symbol API)

// Symbol.toStringTag customizes the default Object.prototype.toString output.
const tagged = {
  label: 'Taxes',
  toString() {
    return `Drawer: ${this.label}`;
  },
  get [Symbol.toStringTag]() {
    return 'Drawer';
  },
};
console.log(Object.prototype.toString.call(tagged)); // '[object Drawer]'
console.log(String(tagged)); // 'Drawer: Taxes' (own toString wins for coercion)
