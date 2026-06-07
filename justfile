set windows-shell := ["pwsh.exe", "-NoLogo", "-Command"]

# ── Dashboard ─────────────────────────────────────────────────────────────────

# Open the interactive recipe dashboard in the browser
default:
    @just --list

# ── Quality ───────────────────────────────────────────────────────────────────

# Execute Biome quality checks
lint:
    npm run lint

# Execute Biome formatting and auto-fixes
fix:
    npm run format

# ── Testing ───────────────────────────────────────────────────────────────────

# Run Vitest suite
test:
    npm test

# Run tests in watch mode
test-watch:
    npm run test:watch

# ── Development ───────────────────────────────────────────────────────────────

# Start Server in watch mode (tsx)
dev:
    npm run dev

# Build the production distribution
build:
    npm run build

# Start the Industrial Webapp Dashboard
dashboard:
    Set-Location 'webapp'
    npm run dev

