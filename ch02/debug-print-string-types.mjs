// Concept: inspect V8 internal string types with %DebugPrint
// run: node --allow-natives-syntax debug-print-string-types.mjs
/* global DebugPrint */

// Simple literal: INTERNALIZED_ONE_BYTE_STRING_TYPE
const hello = 'hello';
%DebugPrint(hello);

// Concatenating two heap strings: CONS_ONE_BYTE_STRING_TYPE (stores pointers, no copy)
const m = 'knock knock!';
const n = "who's there?";
%DebugPrint(m + n);

// Small literal concat V8 folds eagerly: SEQ_ONE_BYTE_STRING_TYPE (a flat copy)
%DebugPrint('hello ' + 'world');

// Substring: SLICED_STRING (a reference + offset/length into the parent)
const big = 'abcdefghijklmnopqrstuvwxyz0123456789';
%DebugPrint(big.slice(2, 20));

// Duplicate content is deduplicated to a THIN_STRING pointing at the internalized copy.
const key = 'a-repeated-property-name';
const obj = {};
obj[key] = 1;             // internalizes the property name
const dup = ('a-repeated-' + 'property-name'); // built at runtime, same content
%DebugPrint(dup);
