/**
 * Project tools — connect, disconnect, inspect a Nexus project.
 */

import type { NexusBridge } from "../nexus-bridge.js";
import type { McpTool } from "../types.js";

export function registerProjectTools(bridge: NexusBridge): McpTool[] {
  return [
    // ── nexus_status ──────────────────────────────────────────────────────────
    {
      name: "nexus_status",
      description:
        "Return the current Nexus session status: connection mode (online/offline/disconnected), " +
        "project URL, auth token presence, and entity counts. Use this first to understand " +
        "the current state before any other nexus tool.",
      inputSchema: { type: "object", properties: {} },
      handler: async () => {
        const session = bridge.getSession();
        return {
          success: true,
          connected: bridge.isConnected(),
          mode: bridge.getMode(),
          has_token: bridge.hasToken(),
          session: session ?? null,
          note: bridge.hasToken()
            ? "PAT found — online connection will be attempted on nexus_connect."
            : "No AUDIOTOOL_PAT env var set. Sessions run in offline mode (no sync to Audiotool backend). " +
              "Set AUDIOTOOL_PAT in Claude Desktop config env to enable online mode.",
        };
      },
    },

    // ── nexus_connect ─────────────────────────────────────────────────────────
    {
      name: "nexus_connect",
      description:
        "Connect to an Audiotool project. In online mode (requires AUDIOTOOL_PAT env var), " +
        "changes sync to the live Audiotool project. In offline mode (no token), creates " +
        "an in-memory document for structural work and testing. " +
        "project_url format: 'https://beta.audiotool.com/studio?project=<id>'",
      inputSchema: {
        type: "object",
        properties: {
          project_url: {
            type: "string",
            description:
              "Full Audiotool project URL from the beta studio. " +
              "Example: 'https://beta.audiotool.com/studio?project=abc123'. " +
              "In offline mode this is stored as metadata only.",
          },
        },
        required: ["project_url"],
      },
      handler: async (args) => {
        const projectUrl = String(args["project_url"] ?? "");
        const session = await bridge.connect(projectUrl);
        return {
          success: true,
          session,
          message:
            session.mode === "online"
              ? `Connected online to ${projectUrl}`
              : `Connected in OFFLINE mode (no AUDIOTOOL_PAT). ` +
                `Document is local only — changes will NOT sync to Audiotool. ` +
                `Set AUDIOTOOL_PAT env var and reconnect for live sync.`,
        };
      },
    },

    // ── nexus_disconnect ──────────────────────────────────────────────────────
    {
      name: "nexus_disconnect",
      description: "Disconnect from the current Nexus session and stop syncing.",
      inputSchema: { type: "object", properties: {} },
      handler: async () => {
        const was = bridge.getSession();
        await bridge.disconnect();
        return {
          success: true,
          disconnected_from: was?.projectUrl ?? "(none)",
        };
      },
    },

    // ── nexus_get_project_info ────────────────────────────────────────────────
    {
      name: "nexus_get_project_info",
      description:
        "Return a summary of the current project: session info, entity counts by type, " +
        "and a list of known device/entity types available in the SDK.",
      inputSchema: { type: "object", properties: {} },
      handler: async () => {
        const session = bridge.getSession();
        if (!session) {
          return {
            success: false,
            error: "No active session. Call nexus_connect first.",
          };
        }

        // Entity type catalog from the SDK docs
        const knownTypes = [
          "tonematrix",
          "stompboxDelay",
          "stompboxReverb",
          "stompboxDistortion",
          "heisenberg",
          "pulverisateur",
          "bassline",
          "noteTrack",
          "noteRegion",
          "desktopAudioCable",
        ];

        const entityCounts: Record<string, number> = {};
        for (const t of knownTypes) {
          const results = bridge.queryByType(t);
          if (results.length > 0) entityCounts[t] = results.length;
        }

        return {
          success: true,
          session,
          entity_counts: entityCounts,
          known_entity_types: knownTypes,
          sdk_version: "0.0.12",
          sdk_stability: "v0.0.x — open beta, expect breaking changes",
        };
      },
    },

    // ── nexus_query_entities ──────────────────────────────────────────────────
    {
      name: "nexus_query_entities",
      description:
        "Query all entities of a given type in the current project. " +
        "Returns id and field values for each entity found. " +
        "Known types include: tonematrix, stompboxDelay, stompboxReverb, " +
        "stompboxDistortion, heisenberg, pulverisateur, bassline, " +
        "noteTrack, noteRegion, desktopAudioCable.",
      inputSchema: {
        type: "object",
        properties: {
          entity_type: {
            type: "string",
            description:
              "Nexus entity type string. Examples: 'tonematrix', 'stompboxDelay', 'noteTrack'.",
          },
        },
        required: ["entity_type"],
      },
      handler: async (args) => {
        bridge.requireSession(); // throws if disconnected
        const entityType = String(args["entity_type"] ?? "");
        const entities = bridge.queryByType(entityType);
        return {
          success: true,
          entity_type: entityType,
          count: entities.length,
          entities,
        };
      },
    },
  ];
}
