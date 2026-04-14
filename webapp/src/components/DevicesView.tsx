import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2, PlusCircle, Settings2, Sliders } from "lucide-react";
import { useMemo, useState } from "react";
import { useNexusStore } from "../store";

const INSTRUMENTS = ["heisenberg", "pulverisateur", "bassline", "tonematrix"] as const;
const EFFECTS = ["stompboxDelay", "stompboxReverb", "stompboxDistortion"] as const;
const ALL_TYPES = [...INSTRUMENTS, ...EFFECTS] as const;
type DeviceType = (typeof ALL_TYPES)[number];

export function DevicesView() {
  const { doc, mode, addLog, entities } = useNexusStore();

  const [deviceType, setDeviceType] = useState<DeviceType>("heisenberg");
  const [displayName, setDisplayName] = useState("");
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(150);
  const [status, setStatus] = useState<"idle" | "creating" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const devices = useMemo(() => {
    return entities.filter((e) => ALL_TYPES.includes(e.type as DeviceType));
  }, [entities]);

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
      await doc.modify((t: any) => {
        t.create(deviceType, {
          displayName: name,
          positionX: posX,
          positionY: posY,
        });
      });
      setMsg(`Created ${deviceType} "${name}"`);
      addLog("info", `Created device: ${deviceType} "${name}"`);
      setStatus("ok");
      setDisplayName("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err);
      setMsg(m);
      addLog("error", `Create device failed: ${m}`);
      setStatus("error");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Devices</h1>
          <p className="text-zinc-500 text-sm mt-1">Management and live parameter synthesis.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 mb-1">
            Active Entities
          </div>
          <div className="text-2xl font-mono text-amber-500/80">{devices.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Creator Panel */}
        <section className="glass-panel p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle size={18} className="text-amber-500" />
            <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
              Deploy New Device
            </h2>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-3">
              Model Selection
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setDeviceType(t)}
                  className={`px-3 py-2.5 rounded-lg text-xs mono text-left transition-all border
                    ${
                      deviceType === t
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                        : "border-zinc-800 bg-zinc-950/30 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    }`}
                >
                  <span className="mr-2 opacity-50">
                    {INSTRUMENTS.includes(t as any) ? "🎹" : "🔧"}
                  </span>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">
                Alias / Label
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={`${deviceType}-v1`}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm
                  text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="text-[10px] uppercase font-bold text-zinc-500 block mb-2"
                  id="label-posX"
                >
                  X Coordinate
                </label>
                <input
                  type="number"
                  value={posX}
                  aria-labelledby="label-posX"
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm
                    text-zinc-100 focus:outline-none focus:border-amber-500/50 mono"
                />
              </div>
              <div>
                <label
                  className="text-[10px] uppercase font-bold text-zinc-500 block mb-2"
                  id="label-posY"
                >
                  Y Coordinate
                </label>
                <input
                  type="number"
                  value={posY}
                  aria-labelledby="label-posY"
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm
                    text-zinc-100 focus:outline-none focus:border-amber-500/50 mono"
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {msg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className={`flex items-start gap-3 p-4 rounded-xl text-sm border
                  ${
                    status === "ok"
                      ? "bg-green-500/5 border-green-500/20 text-green-300/80"
                      : "bg-red-500/5 border-red-500/20 text-red-300/80"
                  }`}
              >
                {status === "ok" ? (
                  <CheckCircle2 size={16} className="mt-0.5" />
                ) : (
                  <AlertTriangle size={16} className="mt-0.5" />
                )}
                {msg}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleCreate}
            disabled={status === "creating"}
            aria-busy={status === "creating"}
            className="primary-button w-full py-3"
          >
            {status === "creating" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <PlusCircle size={16} />
            )}
            {status === "creating" ? "Synthesizing..." : "Initialize Device"}
          </button>
        </section>

        {/* Live List */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Settings2 size={18} className="text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider text-muted">
              Active Instances
            </h2>
          </div>

          <div className="space-y-3">
            {devices.length === 0 ? (
              <div className="glass-panel p-12 text-center text-zinc-600">
                <Sliders size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm italic">No active silicon detected in the project.</p>
              </div>
            ) : (
              devices.map((dev) => <DeviceCard key={dev.id} device={dev} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function DeviceCard({ device }: { device: any }) {
  const { doc, addLog } = useNexusStore();
  const [isEditing, setIsEditing] = useState(false);

  // Example parameters based on common Audiotool devices
  const params = useMemo(() => {
    if (device.type === "heisenberg")
      return ["osc1Type", "osc1Detune", "filterCutoff", "filterResonance"];
    if (device.type === "tonematrix") return ["patternIndex", "scale", "rootNote"];
    if (device.type === "stompboxDelay") return ["mix", "feedbackFactor", "delayTime"];
    return Object.keys(device.fields)
      .filter((f) => typeof device.fields[f] === "number")
      .slice(0, 4);
  }, [device]);

  async function updateParam(name: string, value: any) {
    if (!doc) return;
    try {
      await doc.modify((t: any) => {
        const entity = t.getEntity(device.id);
        if (entity?.fields[name]) {
          entity.fields[name].value = value;
        }
      });
      addLog("info", `Updated ${device.type} parameter: ${name} = ${value}`);
    } catch (err) {
      addLog("error", `Failed to update param ${name}: ${err}`);
    }
  }

  return (
    <div className="glass-card group hover:scale-[1.01]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-950/50 flex items-center justify-center border border-zinc-800">
            <span className="text-sm">
              {INSTRUMENTS.includes(device.type as any) ? "🎹" : "🔧"}
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-100 tracking-tight">
              {device.fields.displayName || device.type}
            </div>
            <div className="text-[10px] mono text-zinc-600 uppercase tracking-tighter">
              {device.type} · {device.id.split("/").pop()}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          aria-label={isEditing ? "Close settings" : "Open settings"}
          className={`p-1.5 rounded-md transition-colors ${isEditing ? "text-amber-500 bg-amber-500/10" : "text-zinc-600 hover:text-zinc-300"}`}
        >
          <Settings2 size={14} />
        </button>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-2 border-t border-zinc-800/50"
          >
            {params.map((p) => (
              <div key={p} className="space-y-2">
                <div
                  className="flex justify-between text-[10px] mono uppercase font-bold"
                  id={`label-${device.id}-${p}`}
                >
                  <span className="text-zinc-500">{p}</span>
                  <span className="text-amber-500/80">
                    {Number(device.fields[p]?.value || 0).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  aria-labelledby={`label-${device.id}-${p}`}
                  defaultValue={device.fields[p]?.value || 0}
                  onChange={(e) => updateParam(p, Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
