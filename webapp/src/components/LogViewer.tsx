/**
 * LogViewer — shows the in-memory log from the Zustand store.
 * Captures events from both webapp operations and MCP tool call echoes.
 */
import { useRef, useEffect } from "react";
import { Trash2, ScrollText } from "lucide-react";
import { useNexusStore } from "../store";

const LEVEL_COLORS = {
  info: "text-zinc-400",
  warn: "text-amber-400",
  error: "text-red-400",
} as const;

const LEVEL_BG = {
  info: "",
  warn: "bg-amber-500/5",
  error: "bg-red-500/5",
} as const;

export function LogViewer() {
  const { logs, clearLogs } = useNexusStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText size={16} className="text-zinc-500" />
          <h1 className="text-xl font-bold text-zinc-100">Event Log</h1>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
            {logs.length}
          </span>
        </div>
        <button
          onClick={clearLogs}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400
            px-2 py-1 rounded transition-colors"
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-zinc-600 text-sm">No events yet.</div>
        ) : (
          <div className="divide-y divide-zinc-800/50 max-h-[calc(100vh-200px)] overflow-y-auto">
            {logs.map((entry, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-2 ${LEVEL_BG[entry.level]}`}
              >
                <span className="text-zinc-600 mono text-xs flex-shrink-0 mt-0.5 w-20 truncate">
                  {entry.ts.slice(11, 19)}
                </span>
                <span
                  className={`text-xs font-medium flex-shrink-0 w-10 uppercase ${LEVEL_COLORS[entry.level]}`}
                >
                  {entry.level}
                </span>
                <span className="text-xs text-zinc-300 mono break-all">{entry.msg}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}
