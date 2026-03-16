$ErrorActionPreference = "Stop"
Set-Location "D:\Dev\repos\audiotool-nexus-mcp"
git init
git add .
git commit -m "feat: initial audiotool-nexus-mcp implementation"
git remote add origin https://github.com/sandraschi/audiotool-nexus-mcp.git
git branch -M main
git push -u origin main
Write-Host "DONE" -ForegroundColor Green
