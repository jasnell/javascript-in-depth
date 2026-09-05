// Reads climb the chain; writes shadow a data property but invoke a prototype setter.

// Case 1: prototype has a DATA property. Writing creates an own property
// on the instance that shadows the prototype's version.
const dataProto = { label: 'default' };
const d1 = Object.create(dataProto);
console.log(d1.label); // 'default' (found on prototype)
d1.label = 'tax documents'; // creates own property on d1
console.log(d1.label); // 'tax documents' (own shadows prototype)
console.log(dataProto.label); // 'default' (prototype untouched)

// Case 2: prototype has an ACCESSOR. Writing runs the setter with this
// bound to the instance, so the value lands on the instance, not the proto.
const accessorProto = {
  _label: 'default',
  get label() {
    return this._label;
  },
  set label(value) {
    this._label = `${value}`;
  },
};
const d2 = Object.create(accessorProto);
console.log(d2.label); // 'default'
d2.label = 'tax documents'; // runs setter; this === d2
console.log(d2.label); // 'tax documents'
console.log(accessorProto._label); // 'default' (prototype's backing field untouched)
console.log(Object.hasOwn(d2, '_label')); // true (setter created it on d2)
