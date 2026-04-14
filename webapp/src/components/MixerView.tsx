import { motion } from "framer-motion";
import { Activity, Music, Sliders, Volume2 } from "lucide-react";
import { useNexusStore } from "../store";

export function MixerView() {
  const { entities } = useNexusStore();

  // High-level heuristic: find anything that looks like a sound source or effect
  const tracks = entities.filter(
    (e) =>
      e.type?.toLowerCase().includes("device") ||
      e.type?.toLowerCase().includes("synth") ||
      e.type?.toLowerCase().includes("effect"),
  );

  return (
    <div className="space-y-8 h-full flex flex-col">
      <header className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
            <Sliders className="text-amber-500" size={24} />
            Console One
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">
            High-speed agentic mixing grid
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase text-zinc-600 font-bold tracking-widest">
              Master Peak
            </p>
            <div className="flex gap-0.5 mt-1">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-3 rounded-full ${i > 9 ? "bg-red-500/40" : i > 7 ? "bg-amber-500/40" : "bg-green-500/20"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 glass-panel overflow-x-auto overflow-y-hidden p-6 flex gap-4 scrollbar-thin scrollbar-thumb-zinc-800">
        {tracks.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center text-zinc-700 opacity-50 space-y-4">
            <Volume2 size={48} />
            <p className="text-sm font-medium">No active channels detected in current project.</p>
          </div>
        ) : (
          tracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="w-24 flex-shrink-0 flex flex-col bg-zinc-950/40 border border-zinc-800/50 rounded-2xl p-3 group hover:border-amber-500/20 transition-all"
            >
              {/* Metering */}
              <div className="h-48 bg-zinc-900/50 rounded-xl relative overflow-hidden mb-4 p-1 flex justify-center gap-0.5 group-hover:bg-zinc-900/80 transition-colors">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex-1 flex flex-col-reverse gap-0.5">
                    {[...Array(20)].map((_, k) => (
                      <motion.div
                        key={k}
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                          backgroundColor:
                            k > 17
                              ? ["#ef4444", "#f87171", "#ef4444"]
                              : k > 14
                                ? ["#f59e0b", "#fbbf24", "#f59e0b"]
                                : ["#10b98144", "#10b981aa", "#10b98144"],
                        }}
                        transition={{
                          duration: 0.5 + Math.random(),
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className={"w-full h-1.5 rounded-sm"}
                      />
                    ))}
                  </div>
                ))}
                <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-zinc-950/90 to-transparent pointer-events-none" />
              </div>

              {/* Slider */}
              <div className="flex-1 flex flex-col items-center gap-4 py-2">
                <div className="w-1.5 h-full bg-zinc-900 rounded-full relative">
                  <motion.div
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 80 }}
                    className="absolute left-1/2 -ml-3 w-6 h-8 bg-zinc-100 rounded shadow-xl cursor-ns-resize flex items-center justify-center group-hover:bg-amber-400 transition-colors"
                    style={{ top: "40%" }}
                  >
                    <div className="w-4 h-[2px] bg-zinc-950/20" />
                  </motion.div>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-600 hover:text-red-500 hover:border-red-500/30 transition-all">
                    M
                  </button>
                  <button className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-600 hover:text-amber-500 hover:border-amber-500/30 transition-all">
                    S
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800/50">
                <p className="text-[10px] font-bold text-zinc-500 truncate text-center uppercase tracking-tighter">
                  {(track.fields.name as string) || track.type}
                </p>
                <div className="mt-2 flex justify-center opacity-30 group-hover:opacity-100 transition-opacity">
                  {track.type.toLowerCase().includes("synth") ? (
                    <Music size={12} />
                  ) : (
                    <Activity size={12} />
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <footer className="glass-panel p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-600 block mb-1">
              Total Channels
            </span>
            <span className="text-zinc-100 font-mono text-sm leading-none">{tracks.length}</span>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-600 block mb-1">
              Signal Path
            </span>
            <span className="text-amber-500 font-mono text-sm leading-none font-bold">
              STEREO_ULTRA
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-all">
            Reset Levels
          </button>
          <button className="primary-button px-6">Auto-Phase</button>
        </div>
      </footer>
    </div>
  );
}
