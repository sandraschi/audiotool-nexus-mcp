import { motion } from "framer-motion";
import {
  AlertCircle,
  Cpu,
  ExternalLink,
  Globe,
  RefreshCcw,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";
import { useNexusStore } from "../store";

export function SettingsView() {
  const {
    llmProvider,
    setLlmProvider,
    availableModels,
    selectedModel,
    setSelectedModel,
    refreshModels,
    isLlmActive,
  } = useNexusStore();

  useEffect(() => {
    refreshModels();
  }, [llmProvider]);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">System Settings</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Configure local hardware and agentic providers.
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 
          ${isLlmActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
        >
          {isLlmActive ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
          {isLlmActive ? "Providers Online" : "Provider Offline"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LLM Hardware Config */}
        <section className="glass-panel p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={18} className="text-amber-500" />
            <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
              Local LLM Node
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-3">
                Active Bridge
              </label>
              <div className="flex gap-2">
                {(["ollama", "lmstudio"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setLlmProvider(p)}
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-medium
                      ${
                        llmProvider === p
                          ? "border-amber-500/50 bg-amber-500/10 text-amber-200"
                          : "border-zinc-800 bg-zinc-950/50 text-zinc-500 hover:border-zinc-700"
                      }`}
                  >
                    {p === "ollama" ? "Ollama" : "LM Studio"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] uppercase font-bold text-zinc-500 block">
                  Model Selection
                </label>
                <button
                  onClick={() => refreshModels()}
                  className="p-1 text-zinc-600 hover:text-amber-500 transition-colors"
                  title="Refresh models"
                >
                  <RefreshCcw size={14} />
                </button>
              </div>

              {availableModels.length > 0 ? (
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 mono"
                >
                  {availableModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400/70 text-xs italic">
                  No models eliciting from{" "}
                  {llmProvider === "ollama" ? "localhost:11434" : "localhost:1234"}.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-900 flex flex-col gap-2">
            <a
              href={llmProvider === "ollama" ? "https://ollama.com" : "https://lmstudio.ai"}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-zinc-600 hover:text-amber-500 flex items-center gap-1 transition-colors"
            >
              <ExternalLink size={10} /> Visit {llmProvider === "ollama" ? "Ollama" : "LM Studio"}{" "}
              Documentation
            </a>
          </div>
        </section>

        {/* Network & Security */}
        <section className="glass-panel p-6 space-y-6 opacity-60 pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={18} className="text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider text-muted">
              Network Mesh
            </h2>
          </div>

          <div className="p-12 text-center text-zinc-700">
            <p className="text-xs italic underline underline-offset-4 decoration-zinc-800">
              Advanced peer-to-peer telemetry coming soon.
            </p>
          </div>
        </section>
      </div>

      <section className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-4 text-zinc-400">
          <Settings size={16} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Interface Preferences</h3>
        </div>
        <div className="grid grid-cols-3 gap-6 opacity-30">
          <div className="h-2 w-full bg-zinc-900 rounded-full" />
          <div className="h-2 w-full bg-zinc-900 rounded-full" />
          <div className="h-2 w-full bg-zinc-900 rounded-full" />
        </div>
      </section>
    </div>
  );
}
