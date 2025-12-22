# How JavaScript Things Work

Code samples from the book demonstrating JavaScript internals, V8 optimizations, and language quirks.

## Table of Contents

- [Chapter 1: How JavaScript Runs](Chapter%20One/INDEX.md) — Event loop, microtasks, and concurrency
- [Chapter 2: Strings](Chapter%20Two/INDEX.md) — UTF-16, Unicode handling, and V8 string optimizations
- [Chapter 3: Numbers](Chapter%20Three/INDEX.md) — IEEE 754 floating-point, SMI optimization, and numeric edge cases
- [Chapter 4: Primitives and Type Coercion](Chapter%20Four/INDEX.md) — Type coercion, boxing, symbols, and truthiness
- [Chapter 5: Objects and Prototypes](Chapter%20Five/INDEX.md) — Prototype chain, hidden classes, and property storage
- [Chapter 6: Functions](Chapter%20Six/INDEX.md) — Closures, this binding, optimization tiers, and generators
- [Chapter 7: Errors](Chapter%20Seven/INDEX.md) — Error handling, stack traces, and serialization
- [Chapter 8: The Event Loop](Chapter%20Eight/INDEX.md) — Microtasks, macrotasks, and async execution ordering

## Running the Examples

Most examples run with Node.js:

```bash
node ch01_hello.js
```

Examples using V8 intrinsics require the `--allow-natives-syntax` flag:

```bash
node --allow-natives-syntax ch03_smi_optimization.js
```

Some optimization examples benefit from additional flags:

```bash
node --allow-natives-syntax --trace-opt --trace-deopt ch06_optimization_tiers.js
node --allow-natives-syntax --trace-ic ch05_megamorphism.js
```
