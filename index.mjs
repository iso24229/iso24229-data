// Entry point for @iso24229/iso24229-data.
//
// Loads every register entry from the seven item-class directories.
// Each named export is a Record keyed by entry id (filename stem).

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadDir(dir) {
  if (!exists(dir)) return {};
  const out = {};
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.yaml')) continue;
    const id = name.slice(0, -'.yaml'.length);
    out[id] = parse(readFileSync(join(dir, name), 'utf8'));
  }
  return out;
}

function exists(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}

export const itemClasses = [
  'authority',
  'code-status',
  'spelling-system',
  'system-code',
  'system-relation',
  'system-relation-type',
  'system-status',
];

export const authorities           = loadDir(join(__dirname, 'authority'));
export const codeStatuses          = loadDir(join(__dirname, 'code-status'));
export const spellingSystems       = loadDir(join(__dirname, 'spelling-system'));
export const systemCodes           = loadDir(join(__dirname, 'system-code'));
export const systemRelations       = loadDir(join(__dirname, 'system-relation'));
export const systemRelationTypes   = loadDir(join(__dirname, 'system-relation-type'));
export const systemStatuses        = loadDir(join(__dirname, 'system-status'));

export const entries = {
  'authority': authorities,
  'code-status': codeStatuses,
  'spelling-system': spellingSystems,
  'system-code': systemCodes,
  'system-relation': systemRelations,
  'system-relation-type': systemRelationTypes,
  'system-status': systemStatuses,
};

export const version = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8')).version;
