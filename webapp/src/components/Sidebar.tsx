import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Circle,
  Cpu,
  Disc,
  LayoutGrid,
  LayoutList,
  Music2,
  Plug,
  Settings,
  Sliders,
  Sparkles,
  TableProperties,
  TerminalSquare,
  Zap,
} from "lucide-react";
import { useNexusStore } from "../store";
import type { NexusState } from "../store";

const NAV: {
  id: NexusState["page"];
  label: string;
  icon: React.ReactNode;
  requiresConnection?: boolean;
}[] = [
  { id: "connect", label: "Connect", icon: <Plug size={18} /> },
  { id: "project", label: "Project", icon: <Music2 size={18} />, requiresConnection: true },
  { id: "devices", label: "Devices", icon: <Cpu size={18} />, requiresConnection: true },
  { id: "mixer", label: "Mixer", icon: <Sliders size={18} />, requiresConnection: true },
  { id: "sampler", label: "Sampler", icon: <Disc size={18} />, requiresConnection: true },
  { id: "timeline", label: "Timeline", icon: <LayoutList size={20} />, requiresConnection: true },
  { id: "cables", label: "Cables", icon: <TableProperties size={20} />, requiresConnection: true },
  { id: "mastering", label: "Mastering", icon: <Zap size={18} />, requiresConnection: true },
  { id: "log", label: "Session Log", icon: <TerminalSquare size={20} /> },
  { id: "chat", label: "AI Commander", icon: <Sparkles size={20} /> },
  { id: "settings", label: "Settings", icon: <Settings size={20} /> },
];

export function Sidebar() {
  const { page, setPage, sidebarOpen, toggleSidebar, mode, logs } = useNexusStore();
  const errorCount = logs.filter((l) => l.level === "error").length;

  const statusClasses = {
    online: "text-green-500 bg-green-500 shadow-green-500/20",
    offline: "text-amber-500 bg-amber-500 shadow-amber-500/20",
    disconnected: "text-zinc-500 bg-zinc-500 shadow-zinc-500/20",
  }[mode];

  const statusDotClass = {
    online: "bg-green-500 text-green-500",
    offline: "bg-amber-500 text-amber-500",
    disconnected: "bg-zinc-500 text-zinc-500",
  }[mode];

  const modeLabel = mode === "online" ? "Online" : mode === "offline" ? "Offline" : "Disconnected";

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 240 : 64 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="fixed left-0 top-0 h-screen bg-zinc-950/80 border-r border-zinc-800/50 flex flex-col z-20 overflow-hidden backdrop-blur-xl"
    >
      {/* Header with Logo */}
      <div className="flex items-center gap-4 px-5 py-8 border-b border-white/[0.03] min-h-[90px]">
        <div className="relative flex-shrink-0 w-10 h-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"
          />
          <img
            src="/logo.png"
            alt="Nexus Logo"
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
          />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="text-base font-bold text-zinc-100 tracking-tight whitespace-nowrap">
                Nexus
              </div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 whitespace-nowrap">
                Audiotool MCP
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status pill */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-white/5 transition-all bg-white/[0.03]">
          <div className="relative flex items-center justify-center">
            <Circle size={8} className={`z-10 fill-current ${statusClasses.split(" ")[0]}`} />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className={`absolute w-4 h-4 rounded-full ${statusDotClass.split(" ")[0]}`}
            />
          </div>          <button type="button" onClick={() => setCollapsed(!collapsed)} className="ml-auto p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all" title={collapsed ? "Expand" : "Collapse"}>{collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-[10px] uppercase font-bold tracking-wider ${statusClasses.split(" ")[0]}`}
              >
                {modeLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map((item) => {
          const disabled = item.requiresConnection && mode === "disconnected";
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => !disabled && setPage(item.id)}
              disabled={disabled}
              title={item.label}
              className={`
                w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm transition-all duration-200
                ${
                  active
                    ? "bg-amber-500/10 text-amber-500 shadow-[inset_0_0_10px_rgba(245,158,11,0.05)] border border-amber-500/10"
                    : disabled
                      ? "text-zinc-800 cursor-not-allowed grayscale"
                      : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200 border border-transparent hover:border-white/5"
                }
              `}
            >
              <span
                className={`flex-shrink-0 transition-transform duration-200 ${active ? "scale-110 shadow-amber-500/50" : "opacity-70"}`}
              >
                {item.icon}
              </span>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`whitespace-nowrap flex-1 text-left font-medium tracking-tight ${active ? "text-zinc-100" : ""}`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Error badge on Log */}
              {item.id === "log" && errorCount > 0 && sidebarOpen && (
                <span className="ml-auto text-[10px] font-bold bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full border border-red-500/10">
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
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        className="m-3 p-3 rounded-xl text-zinc-600 hover:text-zinc-300 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-center justify-center group"
      >
        <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        </motion.div>
      </button>

      {/* Version */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="px-6 pb-6 text-[10px] text-zinc-600 mono font-bold uppercase tracking-[0.2em]"
          >
            NXS-v0.1.0
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
