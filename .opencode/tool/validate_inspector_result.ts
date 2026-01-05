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

function validateInspectorResult(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    errors.push({
      path: "<root>",
      code: "type_error",
      message: "inspector_result must be a JSON object",
    });
    return { ok: false, errors };
  }

  const obj = data as Record<string, unknown>;

  const status = obj.status;
  if (status !== "approved" && status !== "changes_requested") {
    errors.push({
      path: "status",
      code: "invalid_enum",
      message: "status must be 'approved' or 'changes_requested'",
    });
  }

  let issues = obj.issues as unknown;
  if (issues === undefined || issues === null) {
    errors.push({
      path: "issues",
      code: "required",
      message: "issues array is required",
    });
    issues = [];
  } else if (!Array.isArray(issues)) {
    errors.push({
      path: "issues",
      code: "type_error",
      message: "issues must be an array",
    });
    issues = [];
  }

  if (status === "changes_requested" && Array.isArray(issues) && issues.length === 0) {
    errors.push({
      path: "issues",
      code: "empty_for_changes_requested",
      message: "issues must be non-empty when status is 'changes_requested'",
    });
  }

  if (Array.isArray(issues)) {
    issues.forEach((issue, idx) => {
      const pathPrefix = `issues[${idx}]`;
      if (issue === null || typeof issue !== "object" || Array.isArray(issue)) {
        errors.push({
          path: pathPrefix,
          code: "type_error",
          message: "each issue must be an object",
        });
        return;
      }

      const issueObj = issue as Record<string, unknown>;

      const severity = issueObj.severity;
      if (severity !== "blocker" && severity !== "major" && severity !== "minor") {
        errors.push({
          path: `${pathPrefix}.severity`,
          code: "invalid_enum",
          message: "severity must be one of 'blocker', 'major', 'minor'",
        });
      }

      const description = issueObj.description;
      if (typeof description !== "string" || description.trim() === "") {
        errors.push({
          path: `${pathPrefix}.description`,
          code: "required",
          message: "description must be a non-empty string",
        });
      }

      const paths = issueObj.paths as unknown;
      if (!Array.isArray(paths) || paths.length === 0) {
        errors.push({
          path: `${pathPrefix}.paths`,
          code: "required",
          message: "paths must be a non-empty array of strings",
        });
      } else {
        paths.forEach((p, pIdx) => {
          if (typeof p !== "string" || p.trim() === "") {
            errors.push({
              path: `${pathPrefix}.paths[${pIdx}]`,
              code: "type_error",
              message: "each path must be a non-empty string",
            });
          }
        });
      }
    });
  }

  let nextTasks = obj.next_tasks as unknown;
  if (nextTasks === undefined || nextTasks === null) {
    nextTasks = [];
  } else if (!Array.isArray(nextTasks)) {
    errors.push({
      path: "next_tasks",
      code: "type_error",
      message: "next_tasks must be an array of strings",
    });
    nextTasks = [];
  }

  if (Array.isArray(nextTasks)) {
    nextTasks.forEach((task, idx) => {
      if (typeof task !== "string" || task.trim() === "") {
        errors.push({
          path: `next_tasks[${idx}]`,
          code: "type_error",
          message: "each next_tasks entry must be a non-empty string",
        });
      }
    });
  }

  return { ok: errors.length === 0, errors };
}

export default tool({
  description:
    "Validate an inspector_result object against the Foreman inspector contract",
  args: {
    data: tool.schema
      .any()
      .optional()
      .describe("inspector_result object to validate"),
    path: tool.schema
      .string()
      .optional()
      .describe(
        "Path to inspector_result.json (not supported in this tool; use 'data' instead)",
      ),
  },
  async execute(args, _context) {
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
      const result = validateInspectorResult(args.data);
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
