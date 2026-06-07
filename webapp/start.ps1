Param([switch]$Headless)

# --- SOTA Headless Standard ---
if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch 'Hidden')) {
    Start-Process pwsh -ArgumentList '-NoProfile', '-File', $PSCommandPath, '-Headless' -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { 'Hidden' } else { 'Normal' }
# ------------------------------

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

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing webapp dependencies..." -ForegroundColor Yellow
    npm install
}

# Start webapp (bind 127.0.0.1 so fleet probe can reach it)
Write-Host "Starting webapp on http://127.0.0.1:$WebPort ..." -ForegroundColor Green
npm run dev -- --host 127.0.0.1 --port $WebPort --strictPort

