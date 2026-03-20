import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Trash2, Sparkles, MessageSquare, Loader2 } from "lucide-react";
import { useNexusStore } from "../store";

export function ChatView() {
  const { chatHistory, sendMessage, clearChat, selectedModel, isLlmActive } = useNexusStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  async function handleSend() {
    if (!input.trim() || isLoading || !isLlmActive) return;
    const msg = input;
    setInput("");
    setIsLoading(true);
    await sendMessage(msg);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">AI Commander</h1>
            <div className="flex items-center gap-2 text-[10px] mono uppercase font-bold">
              <span className={isLlmActive ? "text-green-500" : "text-red-500"}>
                {isLlmActive ? "Active" : "Offline"}
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">{selectedModel || "No Model Selected"}</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-zinc-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5"
          title="Clear History"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto glass-panel p-6 mb-4 space-y-6" ref={scrollRef}>
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
            <MessageSquare size={48} className="mb-4 text-zinc-700" />
            <p className="text-lg font-medium text-zinc-500">Begin the Cyber-Orchestration.</p>
            <p className="text-sm text-zinc-600 mt-1 max-w-xs">Ask the agent to tweak your modules, route cables, or generate patterns.</p>
          </div>
        ) : (
          chatHistory.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === "assistant" ? "items-start" : "items-start flex-row-reverse"}`}
            >
              <div className={`mt-1 p-2 rounded-lg border ${
                msg.role === "assistant" 
                ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                : "bg-zinc-800 border-zinc-700 text-zinc-400"
              }`}>
                {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === "assistant"
                ? "bg-zinc-900/50 border border-zinc-800 text-zinc-200"
                : "bg-amber-500 text-zinc-950 font-medium"
              }`}>
                {msg.content}
                <div className={`text-[9px] mt-2 mono opacity-40 ${msg.role === "assistant" ? "" : "text-zinc-900"}`}>
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

      {/* Input Area */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={isLlmActive ? "Send command to local LLM..." : "Provider offline - Check settings"}
          disabled={!isLlmActive || isLoading}
          className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl pl-6 pr-14 py-4 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all shadow-2xl"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading || !isLlmActive}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all
            ${input.trim() && isLlmActive && !isLoading
              ? "bg-amber-500 text-zinc-950 hover:scale-105 active:scale-95"
              : "bg-zinc-900 text-zinc-700"}`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
