import { tool } from "@opencode-ai/plugin";

interface GitStatusEntry {
  path: string;
  status: string;
}

interface GitStatusResult {
  ok: boolean;
  files: GitStatusEntry[];
  error?: string;
}

function parseGitStatus(output: string): GitStatusResult {
  const files: GitStatusEntry[] = [];

  const lines = output.split(/\r?\n/).filter((line) => line.trim() !== "");

  for (const line of lines) {
    // git status --porcelain format: two status chars + space + path (possibly more for renames)
    // Example: " M src/file.ts" or "R  old.ts -> new.ts"
    const statusPart = line.slice(0, 2);
    const rest = line.slice(3).trim();

    if (!rest) continue;

    files.push({
      path: rest,
      status: statusPart.trim() || statusPart,
    });
  }

  return { ok: true, files };
}

export default tool({
  description:
    "Run `git status --porcelain` and return a structured list of changed files",
  args: {},
  async execute(_args, _context) {
    try {
      const raw = await Bun.$`git status --porcelain`.text();
      const result = parseGitStatus(raw || "");
      return JSON.stringify(result);
    } catch (err) {
      const result: GitStatusResult = {
        ok: false,
        files: [],
        error: `git status failed: ${String(err)}`,
      };
      return JSON.stringify(result);
    }
  },
});
