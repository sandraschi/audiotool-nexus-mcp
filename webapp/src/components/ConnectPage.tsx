/**
 * ConnectPage — OAuth login + project URL entry.
 *
 * Auth flow reality:
 *   The @audiotool/nexus SDK uses browser-based OAuth (getLoginStatus / login popup).
 *   This page drives that flow directly.  The MCP server (Node.js stdio) uses a
 *   PAT set via env var AUDIOTOOL_PAT — that's separate.
 *   This webapp handles its OWN connection to Audiotool for the live entity view.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, ExternalLink, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { getLoginStatus, createAudiotoolClient } from "@audiotool/nexus";
import { useNexusStore } from "../store";

// You fill this in after registering at developer.audiotool.com/applications
const REDIRECT_URL = window.location.origin + "/";

export function ConnectPage() {
  const { clientId, setClientId, projectUrl, setProjectUrl, setMode, setDoc, setConnectedAt, addLog, setPage } =
    useNexusStore();

  const [status, setStatus] = useState<"idle" | "logging-in" | "connecting" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleConnect() {
    if (!clientId.trim()) {
      setErrorMsg("Enter your OAuth Client ID from developer.audiotool.com/applications");
      return;
    }
    if (!projectUrl.trim()) {
      setErrorMsg("Enter the Audiotool project URL");
      return;
    }
    setErrorMsg("");
    setStatus("logging-in");
    addLog("info", `Starting OAuth flow with clientId=${clientId}`);

    try {
      const loginStatus = await getLoginStatus({
        clientId: clientId.trim(),
        redirectUrl: REDIRECT_URL,
        scope: "project:write",
      });

      if (!loginStatus.loggedIn) {
        addLog("info", "Not logged in — opening Audiotool login popup...");
        // This triggers the OAuth popup/redirect
        loginStatus.login();
        // Wait for login (popup completes and redirects back)
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error("Login timed out after 120s")), 120_000);
          const check = setInterval(async () => {
            try {
              const recheckStatus = await getLoginStatus({
                clientId: clientId.trim(),
                redirectUrl: REDIRECT_URL,
                scope: "project:write",
              });
              if (recheckStatus.loggedIn) {
                clearInterval(check);
                clearTimeout(timeout);
                resolve();
              }
            } catch {
              // keep polling
            }
          }, 1000);
        });
      }

      addLog("info", "Logged in — connecting to project...");
      setStatus("connecting");

      // Re-fetch status after login
      const finalStatus = await getLoginStatus({
        clientId: clientId.trim(),
        redirectUrl: REDIRECT_URL,
        scope: "project:write",
      });

      const client = await createAudiotoolClient({ authorization: finalStatus });
      const doc = await client.createSyncedDocument({
        mode: "online",
        project: projectUrl.trim(),
      });
      await doc.start();

      setDoc(doc);
      setMode("online");
      setConnectedAt(new Date().toISOString());
      addLog("info", `Connected online to ${projectUrl}`);
      setStatus("done");
      setPage("project");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setStatus("error");
      addLog("error", `Connect failed: ${msg}`);
    }
  }

  function handleOffline() {
    setMode("offline");
    setConnectedAt(new Date().toISOString());
    addLog("info", "Started offline session (no Audiotool sync)");
    setPage("project");
  }

  return (
    <div className="max-w-lg mx-auto pt-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Connect to Audiotool</h1>
        <p className="text-zinc-400 text-sm">
          Log in with your Audiotool OAuth app to sync with a live project, or use offline mode
          for structural testing without auth.
        </p>
      </div>

      {/* Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        {/* Client ID */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            OAuth Client ID
            <a
              href="https://developer.audiotool.com/applications"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              Get one <ExternalLink size={11} />
            </a>
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="your-client-id"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100
              placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors mono"
          />
        </div>

        {/* Project URL */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Project URL
          </label>
          <input
            type="text"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            placeholder="https://beta.audiotool.com/studio?project=..."
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100
              placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors mono"
          />
          <p className="text-xs text-zinc-600 mt-1">
            Open a project on beta.audiotool.com, copy the URL from your browser.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <AlertTriangle size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
            <span className="text-red-300 text-sm">{errorMsg}</span>
          </motion.div>
        )}

        {/* Success */}
        {status === "done" && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <CheckCircle2 size={15} className="text-green-400" />
            <span className="text-green-300 text-sm">Connected! Redirecting...</span>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleConnect}
            disabled={status === "logging-in" || status === "connecting" || status === "done"}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400
              disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold
              px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            {status === "logging-in" && <Loader2 size={15} className="animate-spin" />}
            {status === "connecting" && <Loader2 size={15} className="animate-spin" />}
            {status === "logging-in"
              ? "Waiting for login..."
              : status === "connecting"
              ? "Connecting..."
              : status === "done"
              ? "Connected"
              : (
                <>
                  <LogIn size={15} />
                  Login &amp; Connect
                </>
              )}
          </button>

          <button
            onClick={handleOffline}
            className="px-4 py-2.5 rounded-lg text-sm border border-zinc-700 text-zinc-400
              hover:border-zinc-600 hover:text-zinc-200 transition-colors"
          >
            Offline Mode
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="mt-4 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg space-y-2">
        <p className="text-xs font-medium text-zinc-400">How auth works</p>
        <p className="text-xs text-zinc-600 leading-relaxed">
          This webapp uses the Audiotool OAuth flow (browser popup) to connect to your live project
          and display its state. The MCP server (Claude Desktop) uses a separate{" "}
          <code className="text-zinc-400 mono">AUDIOTOOL_PAT</code> env var — set that in{" "}
          <code className="text-zinc-400 mono">claude_desktop_config.json</code> to enable
          Claude to write to your projects.
        </p>
      </div>
    </div>
  );
}
