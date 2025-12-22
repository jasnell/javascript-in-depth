// Chapter 4: Objects - Tagged Template Literals
// See: "Template literals" and "Tagged templates"
//
// Tagged templates are a powerful but underused JavaScript feature.
// They let you intercept template literal processing, enabling
// custom string handling, DSLs, and sanitization.
//
// Run with: node ch04_tagged_templates.js

function log(label, value) {
  console.log(`${label}:`, value);
}

console.log('--- Basic Tagged Template ---\n');

// A tag function receives strings and values separately
function inspect(strings, ...values) {
  console.log('strings:', strings);
  console.log('values:', values);
  console.log('strings.raw:', strings.raw);
  return 'processed';
}

const name = 'Alice';
const age = 30;
const result = inspect`Hello ${name}, you are ${age} years old`;
log('Return value', result);

console.log('\n--- The strings Array Properties ---\n');

// strings is a frozen array with a 'raw' property
function examineStrings(strings) {
  log('Is array', Array.isArray(strings));
  log('Is frozen', Object.isFrozen(strings));
  log('Has raw', 'raw' in strings);
  log('raw is frozen', Object.isFrozen(strings.raw));
  return '';
}

examineStrings`test`;

// strings.length is always values.length + 1
function showLengths(strings, ...values) {
  log('strings.length', strings.length);
  log('values.length', values.length);
  return '';
}

console.log('\nWith 3 interpolations:');
showLengths`a${1}b${2}c${3}d`;

console.log('\n--- Raw vs Cooked Strings ---\n');

function showRaw(strings) {
  console.log('Cooked:', JSON.stringify(strings[0]));
  console.log('Raw:', JSON.stringify(strings.raw[0]));
  return '';
}

// Escape sequences are processed in cooked but preserved in raw
showRaw`Line1\nLine2\tTabbed`;

console.log('\n--- Building a Custom Tag ---\n');

// Simple string interpolation tag
function html(strings, ...values) {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    // Escape HTML entities in interpolated values
    const escaped = String(values[i])
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    result += escaped + strings[i + 1];
  }
  return result;
}

const userInput = '<script>alert("XSS")</script>';
log('Escaped HTML', html`<div>User said: ${userInput}</div>`);

console.log('\n--- SQL Query Builder ---\n');

function sql(strings, ...values) {
  const params = [];
  let query = strings[0];

  for (let i = 0; i < values.length; i++) {
    params.push(values[i]);
    query += `$${i + 1}` + strings[i + 1];
  }

  return { query, params };
}

const userId = 42;
const status = 'active';
const queryObj = sql`SELECT * FROM users WHERE id = ${userId} AND status = ${status}`;

log('Query', queryObj.query);
log('Params', queryObj.params);

console.log('\n--- String.raw Built-in Tag ---\n');

// String.raw returns the raw string without processing escapes
log('Normal template', `Line1\nLine2`);
log('String.raw', String.raw`Line1\nLine2`);

// Useful for Windows paths or regex
log('Windows path', String.raw`C:\Users\name\Documents`);
log('Regex pattern', String.raw`\d+\.\d+`);

console.log('\n--- Styled Components Pattern ---\n');

// Simulating the styled-components pattern
function css(strings, ...values) {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += values[i] + strings[i + 1];
  }
  return {
    type: 'style',
    css: result.trim()
  };
}

const primaryColor = '#007bff';
const style = css`
  color: ${primaryColor};
  padding: 10px;
  border-radius: 4px;
`;

log('Style object', style);

console.log('\n--- Internationalization Tag ---\n');

// i18n tag with placeholder replacement
const translations = {
  'Hello, {0}!': {
    es: 'Hola, {0}!',
    fr: 'Bonjour, {0}!'
  }
};

function createI18n(locale) {
  return function i18n(strings, ...values) {
    // Build the key from static strings
    const key = strings.reduce((acc, str, i) =>
      acc + (i > 0 ? `{${i-1}}` : '') + str, ''
    );

    // Get translation or use original
    const template = translations[key]?.[locale] || key;

    // Replace placeholders
    return values.reduce((str, val, i) =>
      str.replace(`{${i}}`, val), template
    );
  };
}

const i18n = createI18n('es');
const userName = 'Carlos';
log('Spanish greeting', i18n`Hello, ${userName}!`);

console.log('\n--- Highlight Differences ---\n');

// Show what parts are static vs dynamic
function highlight(strings, ...values) {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += `[static: "${strings[i]}"]`;
    if (i < values.length) {
      result += `[dynamic: ${JSON.stringify(values[i])}]`;
    }
  }
  return result;
}

const x = 10;
const y = 20;
log('Highlighted', highlight`x=${x}, y=${y}`);

console.log('\n--- Expression Evaluation ---\n');

// Values can be any expression
function showValues(strings, ...values) {
  log('Values', values);
  return '';
}

const arr = [1, 2, 3];
showValues`Sum: ${arr.reduce((a, b) => a + b)} | Max: ${Math.max(...arr)} | Fn: ${(() => 'hello')()}`;

console.log('\n--- Practical: Debug Logging ---\n');

function debug(strings, ...values) {
  const parts = [];
  for (let i = 0; i < values.length; i++) {
    // Extract variable name from the string before
    const before = strings[i];
    const match = before.match(/(\w+)\s*[:=]?\s*$/);
    const name = match ? match[1] : `arg${i}`;
    parts.push(`${name}=${JSON.stringify(values[i])}`);
  }
  console.log('[DEBUG]', parts.join(', '));
  return '';
}

const user = { id: 1, name: 'Bob' };
const count = 42;
debug`user: ${user} count: ${count}`;

console.log('\n--- Performance Note ---\n');

console.log('Tagged template strings array is cached per call site.');
console.log('The same strings array is reused on repeated calls:');

const seenStrings = new Set();
function checkCaching(strings) {
  const wasSeen = seenStrings.has(strings);
  seenStrings.add(strings);
  return wasSeen ? 'Same object (cached)' : 'New object';
}

// Same call site in a loop - strings object is reused
for (let i = 1; i <= 3; i++) {
  log(`Loop iteration ${i}`, checkCaching`test`);
}

// Different call sites - each gets its own cached strings object
seenStrings.clear();
log('Call site A', checkCaching`test`);
log('Call site B', checkCaching`test`);  // Different line = different call site
