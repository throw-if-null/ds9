import { tool } from "@opencode-ai/plugin";

interface InspectorIssue {
  path: string;
  message: string;
  code?: string;
}

interface InspectorSkillResult {
  ok: boolean;
  verdict: "approved" | "changes_requested";
  inspector_result_ok: boolean;
  inspector_result_errors: InspectorIssue[];
  changed_files: { path: string; status: string }[];
}

export default tool({
  description:
    "Skill: check inspector handoff via validate_inspector_result + git_status (uses inspector_result.json at repo root)",
  args: {},
  async execute(_args, context) {
    const issues: InspectorIssue[] = [];
    let inspectorResultOk = false;

    // Load inspector_result.json using the read_json_file tool
    const readResRaw = await context.invoke("read_json_file", {
      path: "inspector_result.json",
    });

    let inspectorData: unknown | null = null;
    try {
      const parsed = JSON.parse(readResRaw as string) as {
        ok: boolean;
        data?: unknown;
      };
      if (!parsed.ok) {
        issues.push({
          path: "inspector_result.json",
          message: "Failed to read or parse inspector_result.json",
          code: "read_error",
        });
      } else {
        inspectorData = parsed.data ?? null;
      }
    } catch {
      issues.push({
        path: "inspector_result.json",
        message:
          "read_json_file tool returned invalid JSON; cannot parse inspector_result.json",
        code: "tool_protocol_error",
      });
    }

    // Validate inspector_result object when available
    if (inspectorData !== null) {
      const validateResRaw = await context.invoke("validate_inspector_result", {
        data: inspectorData,
      });

      try {
        const validateParsed = JSON.parse(validateResRaw as string) as {
          ok: boolean;
          errors?: InspectorIssue[];
        };
        inspectorResultOk = !!validateParsed.ok;
        if (!validateParsed.ok && validateParsed.errors) {
          issues.push(...validateParsed.errors);
        }
      } catch {
        issues.push({
          path: "<validator>",
          message:
            "validate_inspector_result tool returned invalid JSON; cannot validate inspector_result",
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

    const ok = inspectorResultOk && issues.length === 0;
    const verdict: "approved" | "changes_requested" = ok
      ? "approved"
      : "changes_requested";

    const result: InspectorSkillResult = {
      ok,
      verdict,
      inspector_result_ok: inspectorResultOk,
      inspector_result_errors: issues,
      changed_files: changedFiles,
    };

    return JSON.stringify(result);
  },
});
