<#
.SYNOPSIS
    Start audiotool-nexus-mcp webapp (port 10900)
.DESCRIPTION
    Clears port, installs deps if needed, runs Vite dev server.
    Follows SOTA startup pattern from AGENT_PROTOCOLS.md.
#>

$ErrorActionPreference = "Stop"
$WebPort = 10900
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$WebappDir = Join-Path $ScriptDir "webapp"

Write-Host "audiotool-nexus-mcp webapp startup" -ForegroundColor Cyan
Write-Host "Port: $WebPort" -ForegroundColor Gray

# Clear port zombies
Write-Host "Clearing port $WebPort..." -ForegroundColor Gray
try {
    $connections = Get-NetTCPConnection -LocalPort $WebPort -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Write-Host "Cleared existing process on port $WebPort" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Port clear: $($_)" -ForegroundColor Gray
}

# Install webapp deps if needed
Set-Location $WebappDir
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing webapp dependencies..." -ForegroundColor Yellow
    Start-Process -FilePath "npm.cmd" -ArgumentList "install" -Wait -NoNewWindow
}

# Install MCP server deps if needed
$McpDir = $ScriptDir
Set-Location $McpDir
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing MCP server dependencies..." -ForegroundColor Yellow
    Start-Process -FilePath "npm.cmd" -ArgumentList "install" -Wait -NoNewWindow
}

# Start webapp
Write-Host "Starting webapp on http://localhost:$WebPort ..." -ForegroundColor Green
Set-Location $WebappDir
npm run dev
