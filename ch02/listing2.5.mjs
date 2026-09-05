// Listing 2.5: read a directory with encoding:'buffer' so filenames are never decoded as text
import { readdirSync, readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'ch02-'));
writeFileSync(join(dir, 'foo.txt'), 'foo');
writeFileSync(join(dir, 'bar.txt'), 'bar');

const entries = readdirSync(dir, {
  encoding: 'buffer', // filenames come back as raw Buffers, not strings
  withFileTypes: true,
});

for (const entry of entries) {
  if (entry.isFile()) {
    // entry.name is a Buffer; Node no longer interprets the bytes as text
    const path = join(dir, entry.name.toString());
    console.log(entry.name, '->', readFileSync(path).toString());
  }
}
