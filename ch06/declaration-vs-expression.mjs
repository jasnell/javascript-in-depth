// Hoisting: a declaration exists before its source line; an expression does not.

greet1('world'); // works, the whole declaration is hoisted

try {
  greet2('world'); // throws, greet2 is still uninitialized here
} catch (err) {
  console.log(err.constructor.name + ': ' + err.message);
}

function greet1(name) {
  console.log(`Hello, ${name}`);
}

const greet2 = function (name) {
  console.log(`Hello, ${name}`);
};

greet2('now'); // works once the expression has been evaluated
