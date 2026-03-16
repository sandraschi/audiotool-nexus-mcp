# One-time setup script for audiotool-nexus-mcp
# Run this once after the repo is built.

Set-Location "D:\Dev\repos\audiotool-nexus-mcp"

# Init git
git init
git add .
git commit -m "feat: initial audiotool-nexus-mcp implementation

- MCP server (Node.js/TypeScript) with 12 tools:
  nexus_status, nexus_connect, nexus_disconnect,
  nexus_get_project_info, nexus_query_entities,
  nexus_create_device, nexus_list_devices,
  nexus_ticks_reference, nexus_create_note_track,
  nexus_add_note_region, nexus_create_cable, nexus_list_cables
- NexusBridge: PAT auth attempt + offline fallback
- React/Vite webapp on port 10900
  Pages: Connect (OAuth), Project, Devices, Timeline, Cables, Log
- Zustand global state, dark Tailwind theme, Framer Motion
- start.ps1 + start.bat SOTA startup scripts"

# Push to GitHub (create the repo on github.com first)
git remote add origin https://github.com/sandraschi/audiotool-nexus-mcp.git
git branch -M main
git push -u origin main

# Install and build MCP server
npm install
npm run build

Write-Host "Done! MCP server built at dist/index.js" -ForegroundColor Green
Write-Host "Install webapp deps:" -ForegroundColor Cyan
Write-Host "  cd webapp && npm install" -ForegroundColor Gray
