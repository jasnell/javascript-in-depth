// Makes ToPrimitive observable: logs the hint passed to Symbol.toPrimitive as an object is coerced in different contexts.

const money = {
  amount: 42,
  [Symbol.toPrimitive](hint) {
    console.log(`ToPrimitive called with hint: "${hint}"`);
    if (hint === 'number') return this.amount;        // arithmetic, comparisons
    if (hint === 'string') return `$${this.amount}`;  // template literals, String()
    return `money(${this.amount})`;                   // "default", e.g. + and ==
  },
};

console.log('--- number hint (unary +, arithmetic) ---');
console.log(+money);                 // hint "number" -> 42

console.log('--- string hint (template literal) ---');
console.log(`${money}`);             // hint "string" -> $42

console.log('--- default hint (+ with a string, ==) ---');
console.log(money + '!');            // hint "default" -> money(42)!

// Without Symbol.toPrimitive, the default algorithm tries valueOf then toString
// (for the "number"/"default" hints). This object logs the order.
const legacy = {
  valueOf() {
    console.log('valueOf called');
    return 7;
  },
  toString() {
    console.log('toString called');
    return 'seven';
  },
};

console.log('--- default algorithm, number/default hint tries valueOf first ---');
console.log(legacy * 2);             // valueOf -> 14

console.log('--- string hint tries toString first ---');
console.log(`${legacy}`);            // toString -> seven
