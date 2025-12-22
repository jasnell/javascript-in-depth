# Chapter 5: Objects and Prototypes

Examples exploring JavaScript's object system, prototype chain, and V8's object optimizations.

## Examples

| File | Description |
|------|-------------|
| [ch05_dictionary_mode.js](ch05_dictionary_mode.js) | How delete, too many properties, or defineProperty can force objects into slow dictionary mode. *Requires `--allow-natives-syntax`* |
| [ch05_hidden_classes.js](ch05_hidden_classes.js) | V8's hidden classes (Maps) and how consistent object shapes enable optimization. *Requires `--allow-natives-syntax`* |
| [ch05_map_transitions.js](ch05_map_transitions.js) | How adding properties in different orders creates different Map transition chains. *Requires `--allow-natives-syntax`* |
| [ch05_megamorphism.js](ch05_megamorphism.js) | How inline caches transition from monomorphic to polymorphic to megamorphic state. *Requires `--allow-natives-syntax`* |
| [ch05_property_descriptors.js](ch05_property_descriptors.js) | Property attributes (writable, enumerable, configurable) and how they affect behavior. |
| [ch05_prototype_chain.js](ch05_prototype_chain.js) | Prototype chain traversal for reads vs direct writes that shadow inherited properties. |
| [ch05_prototype_pollution.js](ch05_prototype_pollution.js) | The prototype pollution security vulnerability and how to defend against it. |
| [ch05_proxy.js](ch05_proxy.js) | Proxy objects for intercepting property access, assignment, and other operations. |
| [ch05_reflect_api.js](ch05_reflect_api.js) | The Reflect API for meta-programming with methods matching Proxy traps. |
