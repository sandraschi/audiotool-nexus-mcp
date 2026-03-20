# Integration tests

## PAT + project URL (online mode)

**MCP requires a PAT** (Node cannot use browser OAuth). Get one: [Personal Access Tokens](https://developer.audiotool.com/personal-access-tokens) after logging in at [developer.audiotool.com](https://developer.audiotool.com).

**Project URL:** in the Audiotool studio (e.g. [beta.audiotool.com](https://beta.audiotool.com)), create or open a project and copy the full URL from the address bar (`?project=...`).

1. Copy `.env.example` → `.env`.
2. Set **`AUDIOTOOL_PAT`**.
3. Set **`AUDIOTOOL_TEST_PROJECT_URL`** to that project URL, e.g.  
   `https://beta.audiotool.com/studio?project=...`
4. From repo root:

```powershell
npm run test
```

If either variable is missing, the Nexus PAT tests **skip** (so CI without secrets stays green). If both are set, the test **fails** unless `nexus_connect` returns **`mode: "online"`** — i.e. the SDK actually established a synced session.
