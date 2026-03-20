import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    testTimeout: 120_000,
    hookTimeout: 120_000,
    include: ["tests/**/*.integration.test.ts"],
    setupFiles: [resolve(root, "tests/vitest.setup.ts")],
  },
});
