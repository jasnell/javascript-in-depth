// Listing 2.1: iterate a directory with readdirSync and read each file (the original buggy-context pattern)
import { readdirSync, readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Setup a real directory so the listing runs. The book's dir was './tmp'.
const dir = mkdtempSync(join(tmpdir(), 'ch02-'));
writeFileSync(join(dir, 'foo.txt'), 'foo');
writeFileSync(join(dir, 'bar.txt'), 'bar');

const entries = readdirSync(dir, { withFileTypes: true }); // returns a listing of the directory

for (const entry of entries) {
  if (entry.isFile()) {
    // entry.name is only the basename, so join it with the directory to read it
    const contents = readFileSync(join(dir, entry.name));
    console.log(entry.name, '->', contents.toString());
  }
}
