#!/usr/bin/env node
/**
 * Validates every YAML entry in each item-class directory against the
 * matching schema in schema/. Exits non-zero on any failure.
 *
 * The item-class directories are read from the directory list at the
 * top of this file; adding a new item class = adding the directory,
 * the schema, and an entry here.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ITEM_CLASSES = [
  'authority',
  'code-status',
  'spelling-system',
  'system-code',
  'system-relation',
  'system-relation-type',
  'system-status',
];

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const validators = new Map();
for (const cls of ITEM_CLASSES) {
  const text = await readFile(`schema/${cls}.schema.yaml`, 'utf-8');
  validators.set(cls, ajv.compile(parse(text)));
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.name.endsWith('.yaml') || e.name.endsWith('.yml')) yield full;
  }
}

async function main() {
  let failures = 0;
  let checked = 0;
  for (const cls of ITEM_CLASSES) {
    let stats;
    try {
      stats = await stat(cls);
    } catch {
      console.warn(`! ${cls}/ does not exist; skipping`);
      continue;
    }
    if (!stats.isDirectory()) continue;

    const validate = validators.get(cls);
    for await (const file of walk(cls)) {
      // Skip the .keep placeholder files (empty).
      const text = await readFile(file, 'utf-8');
      if (text.trim() === '') continue;
      const data = parse(text);
      if (!validate(data)) {
        failures++;
        console.error(`✗ ${file}`);
        for (const err of validate.errors ?? []) {
          console.error(`    ${err.instancePath || '<root>'}: ${err.message}`);
        }
        continue;
      }
      checked++;
    }
    console.log(`✓ ${cls}/ validated`);
  }
  console.log(`Checked ${checked} entries, ${failures} failure(s).`);
  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
