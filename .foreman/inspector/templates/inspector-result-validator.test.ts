import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function runValidator(fileName: string): Promise<{ exitCode: number | null; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn('node', ['tools/inspector-result-validator.mjs', fileName], {
      cwd: new URL('..', import.meta.url).pathname,
      stdio: ['ignore', 'ignore', 'pipe']
    });

    let stderr = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('close', (code) => {
      resolve({ exitCode: code, stderr });
    });
  });
}

describe('inspector-result-validator', () => {
  it('accepts a valid approved result', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'inspector-valid-'));
    const file = join(dir, 'inspector_result.json');
    const data = {
      status: 'approved',
      issues: [],
      next_tasks: []
    };
    writeFileSync(file, JSON.stringify(data), 'utf8');

    const { exitCode, stderr } = await runValidator(file);
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
  });

  it('rejects changes_requested with no issues', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'inspector-invalid-'));
    const file = join(dir, 'inspector_result.json');
    const data = {
      status: 'changes_requested',
      issues: [],
      next_tasks: []
    };
    writeFileSync(file, JSON.stringify(data), 'utf8');

    const { exitCode, stderr } = await runValidator(file);
    expect(exitCode).not.toBe(0);
    expect(stderr).toContain('requires at least one issue');
  });
});
