/**
 * Global Zustand store for Nexus webapp state.
 */
import { create } from "zustand";
import type { SyncedDocument } from "@audiotool/nexus";

export type ConnectionMode = "disconnected" | "online" | "offline";

export interface EntityEntry {
  type: string;
  id: string;
  fields: Record<string, unknown>;
}

export interface LogEntry {
  ts: string;
  level: "info" | "warn" | "error";
  msg: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  ts: string;
}

export type LLMProvider = "ollama" | "lmstudio";

export interface NexusState {
  // Connection
  mode: ConnectionMode;
  projectUrl: string;
  clientId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: SyncedDocument | null;
  connectedAt: string | null;

  // Entities
  entities: EntityEntry[];
  entityFilter: string;

  // Log
  logs: LogEntry[];
  msg: string;

  // UI
  page: "connect" | "project" | "devices" | "timeline" | "cables" | "log" | "mixer" | "sampler" | "mastering" | "chat" | "settings";
  sidebarOpen: boolean;

  // AI / Local LLM
  llmProvider: LLMProvider;
  availableModels: string[];
  selectedModel: string;
  isLlmActive: boolean;
  chatHistory: ChatMessage[];

  // Actions
  setMode: (m: ConnectionMode) => void;
  setProjectUrl: (u: string) => void;
  setClientId: (id: string) => void;
  setDoc: (d: SyncedDocument | null) => void;
  setConnectedAt: (t: string | null) => void;
  setEntities: (e: EntityEntry[]) => void;
  setEntityFilter: (f: string) => void;
  addLog: (level: LogEntry["level"], msg: string) => void;
  clearLogs: () => void;
  setPage: (p: NexusState["page"]) => void;
  toggleSidebar: () => void;
  connect: (url: string) => Promise<void>;

  // AI Actions
  setLlmProvider: (p: LLMProvider) => void;
  setSelectedModel: (m: string) => void;
  refreshModels: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export const useNexusStore = create<NexusState>((set) => ({
  mode: "disconnected",
  projectUrl: "",
  clientId: "",
  doc: null,
  connectedAt: null,
  entities: [],
  entityFilter: "",
  logs: [],
  msg: "",
  page: "connect",
  sidebarOpen: true,

  llmProvider: "ollama",
  availableModels: [],
  selectedModel: "",
  isLlmActive: false,
  chatHistory: [],

  setMode: (mode) => set({ mode }),
  setProjectUrl: (projectUrl) => set({ projectUrl }),
  setClientId: (clientId) => set({ clientId }),
  setDoc: (doc) => set({ doc }),
  setConnectedAt: (connectedAt) => set({ connectedAt }),
  setEntities: (entities) => set({ entities }),
  setEntityFilter: (entityFilter) => set({ entityFilter }),
  addLog: (level, msg) =>
    set((s) => ({
      logs: [
        ...s.logs.slice(-199),
        { ts: new Date().toISOString(), level, msg },
      ],
    })),
  clearLogs: () => set({ logs: [] }),
  setPage: (page) => set({ page }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  connect: async (url) => {
    set({ mode: "offline", msg: "Establishing secure session...", projectUrl: url });
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    set({ 
      mode: "online", 
      msg: "", 
      connectedAt: new Date().toISOString(),
      page: "project" // Automatically switch to project view on success
    });
    
    // Add success log
    set((s) => ({
      logs: [
        ...s.logs.slice(-199),
        { ts: new Date().toISOString(), level: "info", msg: `Successfully connected to ${url}` },
      ],
    }));
  },

  setLlmProvider: (llmProvider) => set({ llmProvider, availableModels: [], selectedModel: "" }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  
  refreshModels: async () => {
    const { llmProvider } = useNexusStore.getState();
    const endpoint = llmProvider === "ollama" 
      ? "http://localhost:11434/api/tags" 
      : "http://localhost:1234/v1/models";

    try {
      const resp = await fetch(endpoint);
      if (!resp.ok) throw new Error(`Provider ${llmProvider} unreachable`);
      
      const data = await resp.json();
      let models: string[] = [];

      if (llmProvider === "ollama") {
        models = data.models.map((m: any) => m.name);
      } else {
        models = data.data.map((m: any) => m.id);
      }

      set({ availableModels: models, isLlmActive: true });
      if (models.length > 0 && !useNexusStore.getState().selectedModel) {
        set({ selectedModel: models[0] });
      }
    } catch (err) {
      set({ availableModels: [], isLlmActive: false });
      console.error("LLM Refresh Error:", err);
    }
  },

  sendMessage: async (content) => {
    const { llmProvider, selectedModel, chatHistory } = useNexusStore.getState();
    if (!selectedModel) return;

    const userMsg: ChatMessage = { role: "user", content, ts: new Date().toISOString() };
    set((s) => ({ chatHistory: [...s.chatHistory, userMsg] }));

    const endpoint = llmProvider === "ollama" 
      ? "http://localhost:11434/api/chat" 
      : "http://localhost:1234/v1/chat/completions";

    try {
      const body = llmProvider === "ollama" 
        ? { model: selectedModel, messages: [...chatHistory, userMsg].map(m => ({ role: m.role, content: m.content })), stream: false }
        : { model: selectedModel, messages: [...chatHistory, userMsg].map(m => ({ role: m.role, content: m.content })) };

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await resp.json();
      let reply = "";

      if (llmProvider === "ollama") {
        reply = data.message.content;
      } else {
        reply = data.choices[0].message.content;
      }

      set((s) => ({ 
        chatHistory: [...s.chatHistory, { role: "assistant", content: reply, ts: new Date().toISOString() }] 
      }));
    } catch (err) {
      set((s) => ({ 
        chatHistory: [...s.chatHistory, { role: "assistant", content: "Error: Could not reach LLM provider.", ts: new Date().toISOString() }] 
      }));
    }
  },

  clearChat: () => set({ chatHistory: [] })
}));
