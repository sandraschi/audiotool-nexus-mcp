import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Info, ScrollText, ShieldAlert, Terminal, Trash2 } from "lucide-react";
import { useNexusStore } from "../store";

export function LogViewer() {
  const { logs, clearLogs } = useNexusStore();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Terminal size={20} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Telemetry Feed</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
              Real-time system events
            </p>
          </div>
        </div>

        <button
          onClick={clearLogs}
          className="px-4 py-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all text-xs font-bold flex items-center gap-2"
        >
          <Trash2 size={14} />
          Clear Log
        </button>
      </header>

      <div className="glass-panel h-[70vh] flex flex-col font-mono">
        <div className="bg-zinc-950/80 border-b border-zinc-800/50 px-4 py-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
          </div>
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">
            nexus_telemetry.log
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-50">
              <ScrollText size={32} className="mb-2" />
              <p className="text-sm">Listening for signals...</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-3 text-[12px] py-1 border-b border-white/[0.02] last:border-0
                    ${log.level === "error" ? "text-red-400" : log.level === "warn" ? "text-amber-300" : "text-zinc-400"}`}
                >
                  <span className="text-zinc-700 flex-shrink-0 w-20">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>
                  <span className="font-bold flex-shrink-0 w-12 uppercase tracking-tighter">
                    {log.level === "error" && <ShieldAlert size={12} className="inline mr-1" />}
                    {log.level === "warn" && <AlertCircle size={12} className="inline mr-1" />}
                    {log.level === "info" && <Info size={12} className="inline mr-1" />}
                    {log.level}
                  </span>
                  <span className="flex-1">{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
