Param([switch]$Headless)

# --- SOTA Headless Standard ---
if ($Headless -and -not $env:AUDIOTOOL_NEXUS_HEADLESS_HANDOFF) {
    $env:AUDIOTOOL_NEXUS_HEADLESS_HANDOFF = '1'
    Start-Process pwsh -ArgumentList '-NoProfile', '-File', $PSCommandPath, '-Headless' -WindowStyle Hidden
    exit
}
$WindowStyle = if ($Headless) { 'Hidden' } else { 'Normal' }
# ------------------------------

<#
.SYNOPSIS
    Primary launcher for audiotool-nexus-mcp (MCP Server + Webapp)
.DESCRIPTION
    Ensures root dependencies are installed and delegates to the webapp launcher.
    Follows SOTA industrial startup pattern.
#>

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$WebappLauncher = Join-Path $ScriptDir "webapp\start.ps1"

Write-Host "audiotool-nexus-mcp industrial startup" -ForegroundColor Cyan

# Install MCP server deps if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing MCP server dependencies..." -ForegroundColor Yellow
    npm install
}

# Delegate to webapp launcher
if (Test-Path $WebappLauncher) {
    Write-Host "Delegating to webapp launcher..." -ForegroundColor Gray
    & $WebappLauncher
} else {
    Write-Error "Webapp launcher not found at $WebappLauncher"
}

