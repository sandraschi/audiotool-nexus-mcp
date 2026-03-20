import { useState } from "react";
import { useNexusStore } from "../store";
import { Plug, Music2, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ConnectPage() {
  const { connect, mode, msg } = useNexusStore();
  const [url, setUrl] = useState("https://www.audiotool.com/project/nexus-test");

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 h-full flex flex-col justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <header className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_50px_rgba(245,158,11,0.3)] mb-4">
            <Music2 size={40} className="text-zinc-950" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight text-white font-sans">
              Nexus <span className="text-amber-500 font-light">MCP</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-md mx-auto leading-relaxed">
              Synthesizing the boundary between local logic and Audiotool's cloud grid.
            </p>
          </div>
        </header>
        
        <div className="glass-panel p-10 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          
          <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest" id="label-url">Project Handshake URL</label>
              <span className="text-[10px] mono text-zinc-700">v13.0 SOTA</span>
            </div>
            <input 
              type="text"
              aria-labelledby="label-url"
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-5 py-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
              placeholder="https://www.audiotool.com/project/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <button 
            onClick={() => connect(url)}
            disabled={mode !== 'disconnected'}
            className="primary-button w-full py-5 text-base"
          >
            {mode === 'disconnected' ? (
              <>
                <Plug size={20} />
                Establish Secure Session
              </>
            ) : (
              <>
                <Loader2 size={20} className="animate-spin" />
                Negotiating...
              </>
            )}
          </button>

          {msg && mode === 'disconnected' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm"
            >
              <AlertTriangle size={18} className="flex-shrink-0" />
              {msg}
            </motion.div>
          )}
        </div>

        <footer className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-700">
            Powered by Google Deepmind · Advanced Agentic Coding
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
