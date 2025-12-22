# Chapter 4: Primitives and Type Coercion

Examples covering JavaScript's primitive types, automatic type coercion, and the quirks that arise from them.

## Examples

| File | Description |
|------|-------------|
| [ch04_boxing.js](ch04_boxing.js) | How JavaScript temporarily wraps primitives in objects to call methods on them. |
| [ch04_coercion_algorithm.js](ch04_coercion_algorithm.js) | The ToPrimitive, ToNumber, and ToString algorithms that drive JavaScript's type coercion. |
| [ch04_falsy_truthy_gotchas.js](ch04_falsy_truthy_gotchas.js) | The eight falsy values and surprising truthy values like empty arrays and "false". |
| [ch04_nullish_coalescing.js](ch04_nullish_coalescing.js) | How ?? differs from \|\| by only treating null/undefined as missing, not all falsy values. |
| [ch04_symbols.js](ch04_symbols.js) | Symbols as unique property keys that never collide with string properties. |
| [ch04_tagged_templates.js](ch04_tagged_templates.js) | Tagged template literals for custom string processing, DSLs, and sanitization. |
| [ch04_type_coercion_operators.js](ch04_type_coercion_operators.js) | How + prefers strings while -, *, / always convert to numbers. |
| [ch04_typeof_quirks.js](ch04_typeof_quirks.js) | The typeof operator's historical quirks including typeof null === "object". |
| [ch04_well_known_symbols.js](ch04_well_known_symbols.js) | Well-known symbols like Symbol.iterator and Symbol.toPrimitive for customizing built-in behavior. |
