// Listing 3.1 V8's internal decision process for storing a Number (simplified model).

function howV8StoresNumber(value) {
  // First check: is it an integer?
  if (Number.isInteger(value)) {
    // Second check: does it fit in the 32-bit SMI range?
    if (value >= -2147483648 && value <= 2147483647) {
      return 'SMI: Stored directly, no memory allocation';
    } else {
      return 'HeapNumber: Too large for SMI';
    }
  } else {
    return 'HeapNumber: Floating-point values always use heap';
  }
}

// Examples showing the hierarchy in action.
console.log(howV8StoresNumber(42)); // SMI
console.log(howV8StoresNumber(-1000)); // SMI
console.log(howV8StoresNumber(0.0)); // SMI (0.0 is an integer value)
console.log(howV8StoresNumber(3.14)); // HeapNumber
console.log(howV8StoresNumber(NaN)); // HeapNumber
console.log(howV8StoresNumber(Infinity)); // HeapNumber
console.log(howV8StoresNumber(2147483648)); // HeapNumber (SMI max + 1)
