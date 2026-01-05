import { tool } from "@opencode-ai/plugin";

interface BuilderIssue {
  path: string;
  message: string;
  code?: string;
}

interface BuilderSkillResult {
  ok: boolean;
  verdict: "approved" | "changes_requested";
  builder_result_ok: boolean;
  builder_result_errors: BuilderIssue[];
  changed_files: { path: string; status: string }[];
}

export default tool({
  description:
    "Skill: check builder handoff via validate_builder_result + git_status (uses builder_result.json at repo root)",
  args: {},
  async execute(_args, context) {
    const issues: BuilderIssue[] = [];
    let builderResultOk = false;

    // Load builder_result.json using the read_json_file tool
    const readResRaw = await context.invoke("read_json_file", {
      path: "builder_result.json",
    });

    let builderData: unknown | null = null;
    try {
      const parsed = JSON.parse(readResRaw as string) as {
        ok: boolean;
        data?: unknown;
      };
      if (!parsed.ok) {
        issues.push({
          path: "builder_result.json",
          message: "Failed to read or parse builder_result.json",
          code: "read_error",
        });
      } else {
        builderData = parsed.data ?? null;
      }
    } catch {
      issues.push({
        path: "builder_result.json",
        message:
          "read_json_file tool returned invalid JSON; cannot parse builder_result.json",
        code: "tool_protocol_error",
      });
    }

    // Validate builder_result object when available
    if (builderData !== null) {
      const validateResRaw = await context.invoke("validate_builder_result", {
        data: builderData,
      });

      try {
        const validateParsed = JSON.parse(validateResRaw as string) as {
          ok: boolean;
          errors?: BuilderIssue[];
        };
        builderResultOk = !!validateParsed.ok;
        if (!validateParsed.ok && validateParsed.errors) {
          issues.push(...validateParsed.errors);
        }
      } catch {
        issues.push({
          path: "<validator>",
          message:
            "validate_builder_result tool returned invalid JSON; cannot validate builder_result",
          code: "tool_protocol_error",
        });
      }
    }

    // Get changed files via git_status
    const changedFiles: { path: string; status: string }[] = [];
    try {
      const gitStatusRaw = await context.invoke("git_status", {});
      const gitParsed = JSON.parse(gitStatusRaw as string) as {
        ok: boolean;
        files?: { path: string; status: string }[];
      };
      if (gitParsed.ok && Array.isArray(gitParsed.files)) {
        changedFiles.push(...gitParsed.files);
      }
    } catch {
      // Non-fatal; we simply leave changedFiles empty
    }

    const ok = builderResultOk && issues.length === 0;
    const verdict: "approved" | "changes_requested" = ok
      ? "approved"
      : "changes_requested";

    const result: BuilderSkillResult = {
      ok,
      verdict,
      builder_result_ok: builderResultOk,
      builder_result_errors: issues,
      changed_files: changedFiles,
    };

    return JSON.stringify(result);
  },
});
