# Installation & Setup

This guide covers the technical setup for the **Audiotool Nexus MCP** node.

## 1. Prerequisites

- **Node.js**: v20.0.0 or higher.
- **npm**: v10.0.0 or higher.
- **Audiotool Account**: Required for obtaining a PAT.

## 2. Global Installation

Clone the repository and install dependencies:

```powershell
git clone https://github.com/sandraschi/audiotool-nexus-mcp.git
cd audiotool-nexus-mcp
npm install
npm run build
```

## 3. Configuration (`.env`)

Copy the example environment file and configure your credentials:

```powershell
cp .env.example .env
```

| Variable | Description | Required |
| :--- | :--- | :--- |
| `AUDIOTOOL_PAT` | Personal Access Token for the MCP server. | Yes (Online) |
| `AUDIOTOOL_TEST_PROJECT_URL` | Project URL used for integration tests. | Optional |

## 4. Authentication

### Personal Access Token (PAT)
The MCP server runs in a headless environment and requires a PAT for authentication.
1. Log in to the [Developer Dashboard](https://developer.audiotool.com).
2. Navigate to [Personal Access Tokens](https://developer.audiotool.com/personal-access-tokens).
3. Create a new token and paste it into your `.env` file as `AUDIOTOOL_PAT`.

### Webapp OAuth
The local dashboard uses the standard OAuth flow. You may need to register an application in the Developer Dashboard to obtain a Client ID.

## 5. Development Workflow

This project uses **Biome** for quality control and **Just** for task orchestration.

- **Check Style**: `just lint`
- **Auto-Fix**: `just fix`
- **Run Tests**: `npm test`
- **Start Webapp**: `.\start.bat` (Port 10900)
