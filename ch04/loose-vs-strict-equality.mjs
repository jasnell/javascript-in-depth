// Makes the conversion chains behind loose equality observable ([] == false and true == '1') and contrasts them with ===.

// A logging stand-in for [] : an empty array coerces to the empty string ''.
// This lets us watch the ToPrimitive step that [] == false performs invisibly.
const emptyArrayLike = {
  [Symbol.toPrimitive](hint) {
    console.log(`  ToPrimitive(${hint}) -> ''`);
    return ''; // same primitive [] produces
  },
};

console.log('[] == false, step by step:');
console.log('  false -> ToNumber -> 0');            // boolean side becomes a number
console.log('  object side is coerced to primitive:');
const result = emptyArrayLike == 0;                 // triggers the logged ToPrimitive
console.log("  '' -> ToNumber -> 0, so 0 == 0");
console.log('  result:', result);                   // true
console.log('real value [] == false:', [] == false); // true, same outcome

// true == '1' runs three conversions: boolean->number, then string->number.
console.log('\ntrue == "1", step by step:');
console.log('  true -> ToNumber -> 1        (1 == "1")');
console.log('  "1"  -> ToNumber -> 1        (1 == 1)');
console.log('  result:', true == '1');             // true

// The same comparisons under === do no coercion, so they are false.
console.log('\n--- comparison table (loose vs strict) ---');
const pairs = [
  ['5', 5],
  [0, false],
  ['', 0],
  [null, undefined],
  [true, '1'],
];
for (const [a, b] of pairs) {
  const la = JSON.stringify(a);
  const lb = JSON.stringify(b);
  console.log(`${la} == ${lb} -> ${a == b}\t${la} === ${lb} -> ${a === b}`);
}

// The paradox: [] loosely equals false, yet [] is truthy in a condition.
if ([]) console.log('\n[] is truthy in a condition, even though [] == false is true');
