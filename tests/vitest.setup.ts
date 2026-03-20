/**
 * Load repo `.env` before tests so `AUDIOTOOL_PAT` / `AUDIOTOOL_TEST_PROJECT_URL` are visible
 * when `NexusBridge` is constructed. Path is fixed to repo root (parent of `tests/`), not cwd.
 */
import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const _testsDir = dirname(fileURLToPath(import.meta.url));
const _repoRoot = dirname(_testsDir);
config({ path: resolve(_repoRoot, ".env") });
