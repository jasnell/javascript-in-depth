// Node.js err.code: branch on the stable code, not the human message.

import { readFile } from 'node:fs/promises';
import path from 'node:path';

async function readConfig(file) {
  try {
    return await readFile(file, 'utf8');
  } catch (e) {
    switch (e.code) {
      case 'ENOENT':
        console.log('ENOENT: file not found, using defaults');
        return '{}';
      case 'EACCES': // permission denied (note: EACCES, not EACCESS)
        console.log('EACCES: permission denied, fatal');
        throw e;
      case 'EMFILE': // too many open files, worth retrying later
        console.log('EMFILE: too many open files, back off and retry');
        throw e;
      default:
        throw e;
    }
  }
}

console.log('config:', await readConfig('/no/such/file.json'));

// Node type errors carry ERR_INVALID_ARG_TYPE (singular ARG, singular TYPE).
try {
  path.resolve(123);
} catch (e) {
  console.log(e.code, '=>', e instanceof TypeError); // ERR_INVALID_ARG_TYPE => true
}
