# Per-repo fleet start config for audiotool-nexus-mcp
# Edit ports/backend target here - start.ps1 is fleet-standard.
@{
    Name         = 'audiotool-nexus-mcp'
    BackendPort  = 0
    FrontendPort = 10900
    HealthPath   = '/'
    WebRoot      = 'D:\Dev\repos\audiotool-nexus-mcp\webapp'
    Backend = @{
        Kind = 'none'
    }
    Frontend = @{
        Kind           = 'vite-npm'
        PackageManager = 'npm'
        PortEnvVar     = 'VITE_PORT'
        ApiTargetEnv   = 'VITE_API_TARGET'
    }
}
