import { tool } from "@opencode-ai/plugin";

interface GitDiffResult {
  ok: boolean;
  diff: string;
  error?: string;
}

export default tool({
  description:
    "Run `git diff main...HEAD` (or a configurable base ref) and return the diff as text",
  args: {
    baseRef: tool.schema
      .string()
      .optional()
      .describe(
        "Base ref to diff against (default: 'main'); used as `<baseRef>...HEAD'`",
      ),
  },
  async execute(args, _context) {
    const base = args.baseRef || "main";

    try {
      const diffText = await Bun.$`git diff ${base}...HEAD`.text();
      const result: GitDiffResult = {
        ok: true,
        diff: diffText,
      };
      return JSON.stringify(result);
    } catch (err) {
      const result: GitDiffResult = {
        ok: false,
        diff: "",
        error: `git diff ${base}...HEAD failed: ${String(err)}`,
      };
      return JSON.stringify(result);
    }
  },
});
