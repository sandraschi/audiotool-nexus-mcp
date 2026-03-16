import { motion, AnimatePresence } from "framer-motion";
import {
  Music2,
  Plug,
  Cpu,
  GitBranch,
  Cable,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react";
import { useNexusStore } from "../store";
import type { NexusState } from "../store";

const NAV: {
  id: NexusState["page"];
  label: string;
  icon: React.ReactNode;
  requiresConnection?: boolean;
}[] = [
  { id: "connect", label: "Connect", icon: <Plug size={16} /> },
  { id: "project", label: "Project", icon: <Music2 size={16} />, requiresConnection: true },
  { id: "devices", label: "Devices", icon: <Cpu size={16} />, requiresConnection: true },
  { id: "timeline", label: "Timeline", icon: <GitBranch size={16} />, requiresConnection: true },
  { id: "cables", label: "Cables", icon: <Cable size={16} />, requiresConnection: true },
  { id: "log", label: "Log", icon: <ScrollText size={16} /> },
];

export function Sidebar() {
  const { page, setPage, sidebarOpen, toggleSidebar, mode, logs } = useNexusStore();
  const errorCount = logs.filter((l) => l.level === "error").length;

  const modeColor =
    mode === "online" ? "#22c55e" : mode === "offline" ? "#f59e0b" : "#52525b";
  const modeLabel =
    mode === "online" ? "Online" : mode === "offline" ? "Offline" : "Disconnected";

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 220 : 56 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col z-20 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-zinc-800 min-h-[56px]">
        <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
          <Music2 size={16} className="text-zinc-950" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="text-sm font-semibold text-zinc-100 whitespace-nowrap">
                Audiotool Nexus
              </div>
              <div className="text-xs text-zinc-500 whitespace-nowrap">MCP Dashboard</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status pill */}
      <div className="px-3 py-2">
        <div
          className="flex items-center gap-2 px-2 py-1 rounded-md"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <Circle size={8} fill={modeColor} color={modeColor} className="flex-shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs whitespace-nowrap"
                style={{ color: modeColor }}
              >
                {modeLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-1 space-y-0.5">
        {NAV.map((item) => {
          const disabled = item.requiresConnection && mode === "disconnected";
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => !disabled && setPage(item.id)}
              disabled={disabled}
              title={!sidebarOpen ? item.label : undefined}
              className={`
                w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors
                ${active
                  ? "bg-amber-500/15 text-amber-400"
                  : disabled
                  ? "text-zinc-700 cursor-not-allowed"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap flex-1 text-left"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Error badge on Log */}
              {item.id === "log" && errorCount > 0 && sidebarOpen && (
                <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
                  {errorCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="m-2 p-2 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors flex items-center justify-center"
        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Version */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="px-3 pb-3 text-xs text-zinc-600 mono"
          >
            nexus-mcp v0.1.0
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
