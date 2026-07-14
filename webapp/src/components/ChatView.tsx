import { motion } from "framer-motion";
import { Bot, Download, Loader2, MessageSquare, Send, Sparkles, Trash2, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNexusStore } from "../store";

interface Personality {
  id: string;
  label: string;
  prompt: string;
}

const PERSONALITIES: Personality[] = [
  { id: "audio-engineer", label: "Audio Engineer", prompt: "You are an expert audio engineer specializing in professional audio workstation automation. Help users with routing, signal processing, mixing, and mastering. Be technically precise." },
  { id: "midi-specialist", label: "MIDI Specialist", prompt: "You are a MIDI and sequencing expert. Advise on MIDI routing, controller mapping, clock synchronization, and DAW integration. Focus on practical setup and troubleshooting." },
  { id: "quick-summarizer", label: "Quick Summarizer", prompt: "You are a concise assistant. Answer in 1-3 sentences. Be direct and to the point." },
  { id: "custom", label: "Custom", prompt: "" },
];

const EXAMPLE_PROMPTS = [
  { group: "Tracks", items: ["Route audio from track 1 to the master bus", "Add sidechain compression to the kick drum", "Create a send/return effect chain for reverb"] },
  { group: "Effects", items: ["Set up a multiband compressor on the mix bus", "Configure a delay effect tempo-synced to 120 BPM", "Add automation lanes for filter cutoff frequency"] },
  { group: "Mix", items: ["Balance levels for a 16-track mix", "Create headroom for mastering with gain staging", "Set up a monitoring mix for headphones"] },
];

const STORAGE_KEY = "audiotool-nexus-chat-history";
const PERSONALITY_KEY = "audiotool-nexus-chat-personality";

export function ChatView() {
  const { chatHistory, sendMessage, clearChat, selectedModel, isLlmActive } = useNexusStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [personality, setPersonality] = useState(() => {
    try { return localStorage.getItem(PERSONALITY_KEY) || "audio-engineer"; } catch { return "audio-engineer"; }
  });
  const [showExamples, setShowExamples] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    try { localStorage.setItem(PERSONALITY_KEY, personality); } catch {}
  }, [personality]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory)); } catch {}
  }, [chatHistory]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !isLlmActive) return;
    setShowExamples(false);
    const msg = input;
    setInput("");
    setIsLoading(true);
    await sendMessage(msg);
    setIsLoading(false);
  }, [input, isLoading, isLlmActive, sendMessage]);

  const handleExport = () => {
    const text = chatHistory.map((m) => `[${new Date(m.ts).toLocaleString()}] ${m.role === "user" ? "You" : "Assistant"}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audiotool-chat-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };



  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto" data-testid="chat-page">
      <div className="flex items-center justify-between mb-4 px-1" data-testid="chat-controls">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">AI Commander</h1>
            <div className="flex items-center gap-2 text-[10px] mono uppercase font-bold">
              <span className={isLlmActive ? "text-green-500" : "text-red-500"} data-testid="backend-dot">
                {isLlmActive ? "Active" : "Offline"}
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded font-mono">skill:{personality}</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">{selectedModel || "No Model Selected"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            data-testid="personality-select"
            className="text-[10px] bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300 focus:outline-none"
          >
            {PERSONALITIES.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <button onClick={handleExport} data-testid="chat-export"
            className="p-2 text-zinc-600 hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-800/50"
            title="Export conversation">
            <Download size={16} />
          </button>
          <button onClick={clearChat} data-testid="chat-clear"
            className="p-2 text-zinc-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5"
            title="Clear History">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto glass-panel p-6 mb-4 space-y-6" ref={scrollRef} data-testid="chat-messages">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
            <MessageSquare size={48} className="mb-4 text-zinc-700" />
            <p className="text-lg font-medium text-zinc-500">Begin the Cyber-Orchestration.</p>
            <p className="text-sm text-zinc-600 mt-1 max-w-xs">
              Ask the agent to tweak your modules, route cables, or generate patterns.
            </p>
          </div>
        ) : (
          chatHistory.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === "assistant" ? "items-start" : "items-start flex-row-reverse"}`}
            >
              <div
                className={`mt-1 p-2 rounded-lg border ${
                  msg.role === "assistant"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400"
                }`}
              >
                {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-zinc-900/50 border border-zinc-800 text-zinc-200"
                    : "bg-amber-500 text-zinc-950 font-medium"
                }`}
              >
                {msg.content}
                <div
                  className={`text-[9px] mt-2 mono opacity-40 ${msg.role === "assistant" ? "" : "text-zinc-900"}`}
                >
                  {new Date(msg.ts).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-4 items-start">
            <div className="mt-1 p-2 rounded-lg border bg-amber-500/10 border-amber-500/20 text-amber-500">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-500 text-xs italic">
              AI is computing orchestration logic...
            </div>
          </div>
        )}
      </div>

      {showExamples && chatHistory.length === 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5 px-1" data-testid="example-prompts">
          {EXAMPLE_PROMPTS.map((group) => (
            <div key={group.group} className="flex flex-wrap items-center gap-1 mr-3">
              <span className="text-[10px] text-zinc-500 font-medium mr-1">{group.group}:</span>
              {group.items.map((p) => (
                <button key={p} type="button" onClick={() => { setInput(p); }}
                  className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors border border-zinc-700/30">
                  {p}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            isLlmActive ? "Send command to local LLM..." : "Provider offline - Check settings"
          }
          disabled={!isLlmActive || isLoading}
          className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl pl-6 pr-14 py-4 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all shadow-2xl"
          data-testid="chat-input"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading || !isLlmActive}
          data-testid="chat-send"
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all
            ${
              input.trim() && isLlmActive && !isLoading
                ? "bg-amber-500 text-zinc-950 hover:scale-105 active:scale-95"
                : "bg-zinc-900 text-zinc-700"
            }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
