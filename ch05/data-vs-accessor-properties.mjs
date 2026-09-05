// Data properties store a value directly; accessor properties run get/set code.

// Data property: assign a value, the same value comes back.
const drawer = {
  contents: 'tax documents', // stored directly
};
console.log(drawer.contents); // 'tax documents'
drawer.contents = 'invoices'; // replaces the stored value
console.log(drawer.contents); // 'invoices'

// Accessor property: reading runs the getter, writing runs the setter.
const dynamicDrawer = {
  _actualContents: ['receipt-001.pdf', 'receipt-002.pdf', 'tax-form.pdf'],
  get contents() {
    return this._actualContents.length > 0
      ? `${this._actualContents.length} documents`
      : 'empty';
  },
  set contents(newItem) {
    // The setter appends instead of replacing.
    if (typeof newItem === 'string') {
      this._actualContents.push(newItem);
    }
  },
};

console.log(dynamicDrawer.contents); // '3 documents'
dynamicDrawer.contents = 'invoice.pdf'; // runs the setter, pushes
console.log(dynamicDrawer.contents); // '4 documents'
