import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockNexusClient, mockNexusSDK } from "../tests/mocks/nexus-sdk";
import { NexusBridge } from "./nexus-bridge";

describe("NexusBridge Unit Test", () => {
  let bridge: NexusBridge;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the environment variable for deterministic tests
    vi.stubEnv("AUDIOTOOL_PAT", "test-token");

    bridge = new NexusBridge();
  });

  it("should connect in online mode when PAT is provided", async () => {
    mockNexusClient.createSyncedDocument.mockResolvedValue({
      start: vi.fn().mockResolvedValue(undefined),
    });

    const info = await bridge.connect("https://www.audiotool.com/project/test");

    expect(mockNexusSDK.createAudiotoolClient).toHaveBeenCalledWith({
      pat: "test-token",
    });
    expect(info.mode).toBe("online");
    expect(info.projectUrl).toContain("test");
  });

  it("should fall back to offline mode when connection fails", async () => {
    mockNexusSDK.createAudiotoolClient.mockRejectedValue(new Error("Auth failed"));
    mockNexusSDK.createOfflineDocument.mockResolvedValue({});

    const info = await bridge.connect("https://www.audiotool.com/project/test");

    expect(info.mode).toBe("offline");
    expect(info.projectUrl).toBe("https://www.audiotool.com/project/test");
  });

  it("should correctly identify its own SDK version", async () => {
    const info = await bridge.connect("https://www.audiotool.com/project/test");
    expect(info.sdkVersion).toBe("0.0.12");
  });
});
