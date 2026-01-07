import type { Plugin } from "@opencode-ai/plugin";

export const SessionLogger: Plugin = async ({ directory, $ }) => {
  const logPath = `${directory}/.opencode/session-events.log`;

  async function append(line: string) {
    try {
      await $`mkdir -p ${directory}/.opencode`;
      await $`bash -lc 'printf %s\\n ${line} >> "${logPath}"'`;
    } catch {
      // Ignore logging errors so we never break sessions
    }
  }

  return {
    event: async ({ event }) => {
      if (!event?.type?.startsWith("session.")) return;

      const anyEvent = event as any;
      const sessionId =
        anyEvent.sessionId ?? anyEvent.session_id ?? anyEvent.id ?? null;

      if (!sessionId) return;

      const payload = {
        ts: new Date().toISOString(),
        type: event.type,
        sessionId,
        event,
      };

      await append(JSON.stringify(payload));
    },
  };
};
