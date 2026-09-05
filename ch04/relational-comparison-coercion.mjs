// Shows relational operators (<, >) compare two strings lexicographically but coerce to number when types differ.

// Two strings: compared character by character (lexicographic), NOT numerically.
console.log('10' < '9');   // true: '1' comes before '9'

// Mixed types: the string is converted to a number.
console.log('10' < 9);     // false: 10 < 9 is false

// null and undefined behave differently in relational comparison.
console.log(null < 1);       // true: null becomes 0
console.log(undefined < 1);  // false: undefined becomes NaN, and NaN fails all comparisons

// This is why Array.prototype.sort with no comparator sorts numbers as strings.
console.log(['10', '2', '1'].sort());        // [ '1', '10', '2' ] (lexicographic)
console.log([10, 2, 1].sort((a, b) => a - b)); // [ 1, 2, 10 ] (numeric comparator)
