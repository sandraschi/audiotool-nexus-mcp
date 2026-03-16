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

interface NexusState {
  // Connection
  mode: ConnectionMode;
  projectUrl: string;
  clientId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: SyncedDocument<any> | null;
  connectedAt: string | null;

  // Entities
  entities: EntityEntry[];
  entityFilter: string;

  // Log
  logs: LogEntry[];

  // UI
  page: "connect" | "project" | "devices" | "timeline" | "cables" | "log";
  sidebarOpen: boolean;

  // Actions
  setMode: (m: ConnectionMode) => void;
  setProjectUrl: (u: string) => void;
  setClientId: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setDoc: (d: SyncedDocument<any> | null) => void;
  setConnectedAt: (t: string | null) => void;
  setEntities: (e: EntityEntry[]) => void;
  setEntityFilter: (f: string) => void;
  addLog: (level: LogEntry["level"], msg: string) => void;
  clearLogs: () => void;
  setPage: (p: NexusState["page"]) => void;
  toggleSidebar: () => void;
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
  page: "connect",
  sidebarOpen: true,

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
}));
