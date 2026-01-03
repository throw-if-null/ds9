#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function usage() {
  console.error('Usage: node tools/inspector-result-validator.mjs <path-to-inspector_result.json>');
  process.exit(1);
}

function validateInspectorResult(obj) {
  const errors = [];

  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    errors.push('root must be a JSON object');
    return errors;
  }

  const status = obj.status;
  const allowedStatus = new Set(['approved', 'changes_requested']);
  if (typeof status !== 'string' || !allowedStatus.has(status)) {
    errors.push('status must be "approved" or "changes_requested"');
  }

  const issues = obj.issues;
  if (!Array.isArray(issues)) {
    errors.push('issues must be an array');
  } else {
    const allowedSev = new Set(['blocker', 'major', 'minor']);
    issues.forEach((issue, index) => {
      if (!issue || typeof issue !== 'object' || Array.isArray(issue)) {
        errors.push(`issues[${index}] must be an object`);
        return;
      }
      const i = issue;
      if (typeof i.severity !== 'string' || !allowedSev.has(i.severity)) {
        errors.push(`issues[${index}].severity must be one of: blocker | major | minor`);
      }
      if (typeof i.description !== 'string' || i.description.trim() === '') {
        errors.push(`issues[${index}].description must be a non-empty string`);
      }
      if (!Array.isArray(i.paths)) {
        errors.push(`issues[${index}].paths must be an array of strings`);
      } else {
        i.paths.forEach((p, pi) => {
          if (typeof p !== 'string') {
            errors.push(`issues[${index}].paths[${pi}] must be a string`);
          }
        });
      }
    });
  }

  const nextTasks = obj.next_tasks;
  if (!Array.isArray(nextTasks)) {
    errors.push('next_tasks must be an array of strings');
  } else {
    nextTasks.forEach((t, i) => {
      if (typeof t !== 'string') {
        errors.push(`next_tasks[${i}] must be a string`);
      }
    });
  }

  if (status === 'changes_requested') {
    if (Array.isArray(issues) && issues.length === 0) {
      errors.push('status "changes_requested" requires at least one issue');
    }
    if (Array.isArray(nextTasks) && nextTasks.length === 0) {
      errors.push('status "changes_requested" requires at least one next_tasks entry');
    }
  }

  return errors;
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
    console.error('inspector-result-validator: failed to read file:', err.message);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('inspector-result-validator: invalid JSON:', err.message);
    process.exit(1);
  }

  const errors = validateInspectorResult(data);
  if (errors.length > 0) {
    console.error('inspector-result-validator: schema validation failed:');
    for (const e of errors) console.error(' -', e);
    process.exit(1);
  }

  console.log('inspector-result-validator: OK');
}

main();
