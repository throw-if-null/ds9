#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function usage() {
  console.error('Usage: node tools/builder-result-validator.mjs <path-to-builder_result.json>');
  process.exit(1);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    usage();
  }

  const filePath = path.resolve(process.cwd(), args[0]);

  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('builder-result-validator: failed to read file:', err.message);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('builder-result-validator: invalid JSON:', err.message);
    process.exit(1);
  }

  const errors = [];

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    errors.push('root must be a JSON object');
  } else {
    const obj = data;

    if (typeof obj.summary !== 'string' || obj.summary.trim() === '') {
      errors.push('summary must be a non-empty string');
    }

    const allowedComplexity = new Set(['low', 'medium', 'high']);
    if (typeof obj.complexity !== 'string' || !allowedComplexity.has(obj.complexity)) {
      errors.push('complexity must be one of: low | medium | high');
    }

    const allowedKeys = new Set(['summary', 'complexity']);
    for (const key of Object.keys(obj)) {
      if (!allowedKeys.has(key)) {
        errors.push(`unexpected top-level key: ${key}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('builder-result-validator: schema validation failed:');
    for (const e of errors) console.error(' -', e);
    process.exit(1);
  }

  console.log('builder-result-validator: OK');
}

main();
