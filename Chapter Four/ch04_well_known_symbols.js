// Chapter 4: Primitives - Well-Known Symbols
// See: "Symbols" and "Customizing object behavior"
//
// Well-known symbols let you customize how JavaScript built-in operations
// treat your objects. They're the hooks that make the language extensible.
//
// Run with: node ch04_well_known_symbols.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Symbol.toStringTag ---\n');

// Customizes what Object.prototype.toString returns
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  get [Symbol.toStringTag]() {
    return 'Temperature';
  }
}

const temp = new Temperature(25);
log('Object.prototype.toString', Object.prototype.toString.call(temp));
// [object Temperature] instead of [object Object]

console.log('\n--- Symbol.toPrimitive ---\n');

// Controls type coercion for all primitive conversions
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  [Symbol.toPrimitive](hint) {
    console.log(`  (toPrimitive called with hint: "${hint}")`);
    switch (hint) {
      case 'number':
        return this.amount;
      case 'string':
        return `${this.currency}${this.amount}`;
      default:  // 'default'
        return this.amount;
    }
  }
}

const price = new Money(99.99, '$');
log('+price', +price);              // hint: 'number'
log('String(price)', String(price)); // hint: 'string'
log('price + 0', price + 0);        // hint: 'default'

console.log('\n--- Symbol.iterator ---\n');

// Makes an object iterable with for...of and spread
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) {
      yield i;
    }
  }
}

const range = new Range(1, 5);
log('for...of Range(1,5)', [...range]);

console.log('\n--- Symbol.hasInstance ---\n');

// Customizes instanceof checks
class Even {
  static [Symbol.hasInstance](value) {
    return typeof value === 'number' && value % 2 === 0;
  }
}

log('2 instanceof Even', 2 instanceof Even);   // true
log('3 instanceof Even', 3 instanceof Even);   // false
log('4 instanceof Even', 4 instanceof Even);   // true

console.log('\n--- Symbol.isConcatSpreadable ---\n');

// Controls Array.prototype.concat behavior
const notSpreadable = [1, 2, 3];
notSpreadable[Symbol.isConcatSpreadable] = false;

log('[0].concat([1,2,3])', [0].concat([1, 2, 3]));
log('[0].concat(notSpreadable)', [0].concat(notSpreadable));

// Make an object spreadable
const spreadableObj = {
  0: 'a',
  1: 'b',
  length: 2,
  [Symbol.isConcatSpreadable]: true
};
log('[].concat(spreadableObj)', [].concat(spreadableObj));

console.log('\n--- Symbol.species ---\n');

// Controls what constructor derived methods use
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array;  // map/filter return plain Arrays, not MyArrays
  }
}

const myArr = new MyArray(1, 2, 3);
const mapped = myArr.map(x => x * 2);

log('myArr instanceof MyArray', myArr instanceof MyArray);
log('mapped instanceof MyArray', mapped instanceof MyArray);  // false!
log('mapped instanceof Array', mapped instanceof Array);      // true

console.log('\n--- Symbol.match/replace/search/split ---\n');

// Make any object work with String methods
const vowelMatcher = {
  [Symbol.match](str) {
    return str.match(/[aeiou]/gi);
  },
  [Symbol.replace](str, replacement) {
    return str.replace(/[aeiou]/gi, replacement);
  }
};

log("'Hello'.match(vowelMatcher)", 'Hello'.match(vowelMatcher));
log("'Hello'.replace(vowelMatcher, '*')", 'Hello'.replace(vowelMatcher, '*'));

console.log('\n--- All Well-Known Symbols ---\n');

const wellKnown = [
  'asyncIterator', 'hasInstance', 'isConcatSpreadable',
  'iterator', 'match', 'matchAll', 'replace', 'search',
  'species', 'split', 'toPrimitive', 'toStringTag', 'unscopables'
];

console.log('Well-known symbols in Symbol:');
for (const name of wellKnown) {
  if (Symbol[name]) {
    log(`  Symbol.${name}`, String(Symbol[name]));
  }
}
