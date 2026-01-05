import { tool } from "@opencode-ai/plugin";
interface ValidationError {
  path: string;
  message: string;
  code?: string;
}
interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
}
function validateBuilderResult(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    errors.push({
      path: "<root>",
      code: "type_error",
      message: "builder_result must be a JSON object",
    });
    return { ok: false, errors };
  }
  const obj = data as Record<string, unknown>;
  const summary = obj.summary;
  if (typeof summary !== "string" || summary.trim() === "") {
    errors.push({
      path: "summary",
      code: "required",
      message: "summary must be a non-empty string",
    });
  } else if (summary.length > 300) {
    errors.push({
      path: "summary",
      code: "too_long",
      message: "summary should be at most 300 characters",
    });
  }
  const complexity = obj.complexity;
  const allowed = new Set(["low", "medium", "high"]);
  if (typeof complexity !== "string" || !allowed.has(complexity)) {
    errors.push({
      path: "complexity",
      code: "invalid_enum",
      message: "complexity must be one of 'low', 'medium', 'high'`",
    });
  }
  return { ok: errors.length === 0, errors };
}
export default tool({
  description:
    "Validate a builder_result object (no file I/O) against the Foreman contract",
  args: {
    data: tool.schema
      .any()
      .optional()
      .describe("builder_result object to validate"),
    path: tool.schema
      .string()
      .optional()
      .describe(
        "Path to builder_result.json (currently not supported in this tool)",
      ),
  },
  async execute(args, _context) {
    // Enforce that we only validate provided data
    if (!args.data) {
      const result: ValidationResult = {
        ok: false,
        errors: [
          {
            path: "<root>",
            code: "required",
            message:
              "This tool currently validates only the 'data' object; file path is not supported",
          },
        ],
      };
      return JSON.stringify(result);
    }
    try {
      const result = validateBuilderResult(args.data);
      return JSON.stringify(result);
    } catch (err) {
      const result: ValidationResult = {
        ok: false,
        errors: [
          {
            path: "<tool>",
            code: "unexpected_error",
            message: `validator threw an unexpected error: ${String(err)}`,
          },
        ],
      };
      return JSON.stringify(result);
    }
  },
});
