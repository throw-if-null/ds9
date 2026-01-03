import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function runValidator(fileName: string): Promise<{ exitCode: number | null; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn('node', ['tools/builder-result-validator.mjs', fileName], {
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

describe('builder-result-validator', () => {
  it('accepts a valid builder_result.json', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'builder-valid-'));
    const file = join(dir, 'builder_result.json');
    writeFileSync(file, JSON.stringify({ summary: 'ok', complexity: 'medium' }), 'utf8');

    const { exitCode, stderr } = await runValidator(file);
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
  });

  it('rejects invalid complexity', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'builder-invalid-'));
    const file = join(dir, 'builder_result.json');
    writeFileSync(file, JSON.stringify({ summary: 'ok', complexity: 'weird' }), 'utf8');

    const { exitCode, stderr } = await runValidator(file);
    expect(exitCode).not.toBe(0);
    expect(stderr).toContain('complexity');
  });
});
