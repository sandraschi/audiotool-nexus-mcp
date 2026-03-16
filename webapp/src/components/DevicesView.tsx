/**
 * DevicesView — create audio devices and see existing ones.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useNexusStore } from "../store";

const INSTRUMENTS = ["heisenberg", "pulverisateur", "bassline", "tonematrix"] as const;
const EFFECTS = ["stompboxDelay", "stompboxReverb", "stompboxDistortion"] as const;
const ALL_TYPES = [...INSTRUMENTS, ...EFFECTS] as const;
type DeviceType = (typeof ALL_TYPES)[number];

export function DevicesView() {
  const { doc, mode, addLog } = useNexusStore();

  const [deviceType, setDeviceType] = useState<DeviceType>("heisenberg");
  const [displayName, setDisplayName] = useState("");
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(150);
  const [status, setStatus] = useState<"idle" | "creating" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleCreate() {
    if (!doc && mode === "online") {
      setMsg("No active document. Reconnect.");
      setStatus("error");
      return;
    }
    setStatus("creating");
    setMsg("");
    const name = displayName.trim() || `${deviceType}-${Date.now().toString(36)}`;
    try {
      await doc.modify((t: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (t as any).create(deviceType, {
          displayName: name,
          positionX: posX,
          positionY: posY,
        });
      });
      setMsg(`Created ${deviceType} "${name}" at (${posX}, ${posY})`);
      addLog("info", `Created device: ${deviceType} "${name}"`);
      setStatus("ok");
      setDisplayName("");
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err);
      setMsg(m);
      addLog("error", `Create device failed: ${m}`);
      setStatus("error");
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Devices</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          Create instruments and effects in the current project.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300">Create Device</h2>

        {/* Device type selector */}
        <div>
          <label className="text-xs text-zinc-500 block mb-2">Device Type</label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setDeviceType(t)}
                className={`px-3 py-2 rounded-lg text-xs mono text-left transition-colors border
                  ${deviceType === t
                    ? "border-amber-500 bg-amber-500/10 text-amber-300"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
              >
                {INSTRUMENTS.includes(t as (typeof INSTRUMENTS)[number]) ? "🎹" : "🔧"} {t}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">Display Name (optional)</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={`${deviceType}-1`}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm
              text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 mono"
          />
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">X Position</label>
            <input
              type="number"
              value={posX}
              onChange={(e) => setPosX(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm
                text-zinc-100 focus:outline-none focus:border-amber-500 mono"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">Y Position</label>
            <input
              type="number"
              value={posY}
              onChange={(e) => setPosY(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm
                text-zinc-100 focus:outline-none focus:border-amber-500 mono"
            />
          </div>
        </div>

        {/* Status message */}
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
            {status === "ok" ? <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" /> : <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />}
            {msg}
          </motion.div>
        )}

        <button
          onClick={handleCreate}
          disabled={status === "creating"}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400
            disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold
            px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          {status === "creating" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <PlusCircle size={15} />
          )}
          {status === "creating" ? "Creating..." : "Create Device"}
        </button>

        {mode === "offline" && (
          <p className="text-xs text-zinc-600">
            Offline mode — device will be created in local document only.
          </p>
        )}
      </div>
    </div>
  );
}
