/**
 * CablesView — create audio routing between device sockets.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Cable, Loader2, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useNexusStore } from "../store";

export function CablesView() {
  const { doc, mode, addLog } = useNexusStore();

  const [fromSocket, setFromSocket] = useState("");
  const [toSocket, setToSocket] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleCreate() {
    if (!fromSocket.trim() || !toSocket.trim()) {
      setMsg("Both from_socket and to_socket are required.");
      setStatus("error");
      return;
    }
    if (!doc && mode === "online") {
      setMsg("No active document.");
      setStatus("error");
      return;
    }
    setStatus("busy"); setMsg("");
    try {
      let cableId = "";
      await doc.modify((t: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cable = (t as any).create("desktopAudioCable", {
          fromSocket: fromSocket.trim(),
          toSocket: toSocket.trim(),
        });
        cableId = cable?.id ?? cable?.location ?? "unknown";
      });
      setMsg(`Created cable id=${cableId}`);
      addLog("info", `Created cable: ${fromSocket} → ${toSocket} [id=${cableId}]`);
      setStatus("ok");
      setFromSocket("");
      setToSocket("");
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err);
      setMsg(m); addLog("error", `Cable create failed: ${m}`); setStatus("error");
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Audio Cables</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Route audio between device sockets.</p>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
        <Info size={13} className="text-zinc-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          Socket locations look like <code className="text-zinc-400 mono">entities/abc123/fields/audioOutput</code>.
          Get them from the Project view entity inspector — look in the <code className="mono text-zinc-400">fields</code> object
          for keys like <code className="mono text-zinc-400">audioOutput</code>, <code className="mono text-zinc-400">audioInput</code>,
          <code className="mono text-zinc-400">masterOutput</code>.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
          <Cable size={15} className="text-amber-400" />
          Create Cable
        </h2>

        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">From Socket (output)</label>
          <input
            type="text"
            value={fromSocket}
            onChange={(e) => setFromSocket(e.target.value)}
            placeholder="entities/abc.../fields/audioOutput"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm
              text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 mono"
          />
        </div>

        {/* Arrow indicator */}
        <div className="flex items-center justify-center gap-3 text-zinc-600 text-xs">
          <div className="flex-1 h-px bg-zinc-800" />
          <span>↓ routes to</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">To Socket (input)</label>
          <input
            type="text"
            value={toSocket}
            onChange={(e) => setToSocket(e.target.value)}
            placeholder="entities/def.../fields/audioInput"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm
              text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 mono"
          />
        </div>

        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2 p-3 rounded-lg text-sm
              ${status === "ok"
                ? "bg-green-500/10 border border-green-500/20 text-green-300"
                : "bg-red-500/10 border border-red-500/20 text-red-300"
              }`}
          >
            {status === "ok"
              ? <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
              : <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />}
            <span className="mono text-xs">{msg}</span>
          </motion.div>
        )}

        <button
          onClick={handleCreate}
          disabled={status === "busy"}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400
            disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold
            px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          {status === "busy"
            ? <Loader2 size={14} className="animate-spin" />
            : <Cable size={14} />}
          {status === "busy" ? "Creating..." : "Create Cable"}
        </button>

        {mode === "offline" && (
          <p className="text-xs text-zinc-600">
            Offline mode — cable is local only.
          </p>
        )}
      </div>
    </div>
  );
}
