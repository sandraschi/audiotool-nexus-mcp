/**
 * Integration: real Audiotool NEXUS SDK + PAT + project URL.
 *
 * Skips when `AUDIOTOOL_PAT` or `AUDIOTOOL_TEST_PROJECT_URL` is missing (e.g. CI without secrets).
 * Fails loudly when env is set but connection is not **online** (PAT rejected, bad URL, SDK error).
 */
import { describe, it, expect, afterEach } from "vitest";
import { NexusBridge } from "../../src/nexus-bridge.js";

const PAT = process.env["AUDIOTOOL_PAT"]?.trim();
const PROJECT_URL = process.env["AUDIOTOOL_TEST_PROJECT_URL"]?.trim();
const runIntegration = Boolean(PAT && PROJECT_URL);

describe.skipIf(!runIntegration)("Nexus PAT → online session (integration)", () => {
  let bridge: NexusBridge;

  afterEach(async () => {
    if (bridge) {
      await bridge.disconnect();
    }
  });

  it("createAudiotoolClient + createSyncedDocument yields mode=online", async () => {
    bridge = new NexusBridge();
    expect(bridge.hasToken(), "AUDIOTOOL_PAT must be set for this test").toBe(true);

    const session = await bridge.connect(PROJECT_URL!);

    expect(
      session.mode,
      `Expected online sync; got "${session.mode}". Check PAT scopes, project URL, and stderr for [nexus-bridge] Online auth failed.`
    ).toBe("online");

    expect(bridge.getMode()).toBe("online");
    expect(bridge.isConnected()).toBe(true);
    expect(session.projectUrl).toBe(PROJECT_URL);
  });

  it("queryEntities runs without throw after online connect", async () => {
    bridge = new NexusBridge();
    await bridge.connect(PROJECT_URL!);

    expect(bridge.getMode()).toBe("online");

    const noteTracks = bridge.queryByType("noteTrack");
    expect(Array.isArray(noteTracks)).toBe(true);

    const session = bridge.getSession();
    expect(session?.entityCounts).toBeDefined();
  });
});

describe("Nexus integration env guard", () => {
  it("documents required env when skipping", () => {
    if (runIntegration) {
      expect(PAT?.length).toBeGreaterThan(10);
      expect(PROJECT_URL?.startsWith("http")).toBe(true);
    } else {
      expect(true).toBe(true);
    }
  });
});
