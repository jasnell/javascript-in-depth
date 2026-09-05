// Shows how null (intentionally empty) and undefined (not yet assigned) differ and overlap.

const kidsActivities = {
  aaron: null,      // "Nothing, dad!" answered, so intentionally empty
  lex: undefined,   // no answer at all, never assigned
};

console.log(kidsActivities.aaron === null);      // true
console.log(kidsActivities.lex === undefined);   // true

// They are loosely equal to each other but not strictly equal.
console.log(null == undefined);   // true
console.log(null === undefined);  // false

// They coerce to different numbers.
console.log(Number(null));        // 0
console.log(Number(undefined));   // NaN

// The `== null` idiom catches both nothings with one check.
function describe(val) {
  if (val == null) return 'no value';   // true for null AND undefined
  return `processing ${val}`;
}

console.log(describe(null));       // no value
console.log(describe(undefined));  // no value
console.log(describe(0));          // processing 0
