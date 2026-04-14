import { vi } from "vitest";

/**
 * Mocks the Audiotool NEXUS SDK for unit testing.
 * This allows testing bridge logic without an active Audiotool session.
 */
export const mockNexusClient = {
  createSyncedDocument: vi.fn(),
  destroy: vi.fn(),
};

export const mockNexusSDK = {
  createAudiotoolClient: vi.fn().mockResolvedValue(mockNexusClient),
  createOfflineDocument: vi.fn().mockResolvedValue({}),
};

// Auto-register mock if needed
vi.mock("@audiotool/nexus", () => ({
  ...mockNexusSDK
}));
