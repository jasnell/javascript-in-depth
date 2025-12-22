# Chapter 3: Numbers

Examples exploring IEEE 754 floating-point representation, V8's number optimizations, and numeric edge cases.

## Examples

| File | Description |
|------|-------------|
| [ch03_denormalized_numbers.js](ch03_denormalized_numbers.js) | IEEE 754 subnormal numbers that provide gradual underflow near zero. |
| [ch03_floating_point_precision.js](ch03_floating_point_precision.js) | Why 0.1 + 0.2 !== 0.3 and how to handle floating-point comparisons with Number.EPSILON. |
| [ch03_integer_boundaries.js](ch03_integer_boundaries.js) | SMI, HeapNumber, and BigInt boundaries and when V8 switches between representations. *Requires `--allow-natives-syntax`* |
| [ch03_math_precision.js](ch03_math_precision.js) | Accumulated rounding errors in loops, financial calculations, and comparison strategies. |
| [ch03_nan_boxing.js](ch03_nan_boxing.js) | How JavaScript engines use NaN boxing to efficiently represent multiple types in 64 bits. |
| [ch03_safe_integers_bigint.js](ch03_safe_integers_bigint.js) | The MAX_SAFE_INTEGER boundary and when to use BigInt for exact large integers. |
| [ch03_smi_optimization.js](ch03_smi_optimization.js) | V8's SMI (Small Integer) optimization that stores integers directly in pointers. *Requires `--allow-natives-syntax`* |
| [ch03_special_values.js](ch03_special_values.js) | Negative zero, NaN, and Infinity behaviors including Object.is() vs === differences. |
| [ch03_typed_array_views.js](ch03_typed_array_views.js) | How typed arrays provide different views of the same binary data and endianness handling. |
