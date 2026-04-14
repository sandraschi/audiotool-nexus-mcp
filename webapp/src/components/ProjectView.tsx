import { motion } from "framer-motion";
import { AlertCircle, ExternalLink, Music2, RefreshCw } from "lucide-react";
/**
 * ProjectView — live entity overview of the connected project.
 * Queries all known entity types and shows counts + a searchable entity list.
 */
import { useEffect, useState } from "react";
import { type EntityEntry, useNexusStore } from "../store";

const ENTITY_TYPES = [
  "tonematrix",
  "stompboxDelay",
  "stompboxReverb",
  "stompboxDistortion",
  "heisenberg",
  "pulverisateur",
  "bassline",
  "noteTrack",
  "noteRegion",
  "desktopAudioCable",
] as const;

const TYPE_COLORS: Record<string, string> = {
  tonematrix: "#8b5cf6",
  stompboxDelay: "#06b6d4",
  stompboxReverb: "#06b6d4",
  stompboxDistortion: "#f97316",
  heisenberg: "#ec4899",
  pulverisateur: "#f59e0b",
  bassline: "#22c55e",
  noteTrack: "#3b82f6",
  noteRegion: "#6366f1",
  desktopAudioCable: "#71717a",
};

export function ProjectView() {
  const { doc, mode, projectUrl, connectedAt, setEntities, entityFilter, setEntityFilter, addLog } =
    useNexusStore();
  const [allEntities, setLocalEntities] = useState<EntityEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  async function refresh() {
    if (!doc && mode === "online") return;
    setLoading(true);

    const collected: EntityEntry[] = [];
    for (const t of ENTITY_TYPES) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results: any[] = doc?.queryEntities?.ofTypes(t)?.get() ?? [];
        for (const e of results) {
          const fields: Record<string, unknown> = {};
          if (e.fields) {
            for (const [k, v] of Object.entries(e.fields)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              fields[k] = (v as any)?.value ?? v;
            }
          }
          collected.push({
            type: t,
            id: e.id ?? e.location ?? "?",
            fields,
          });
        }
      } catch {
        // type not present — skip
      }
    }

    setLocalEntities(collected);
    setEntities(collected);
    setLastRefresh(new Date().toLocaleTimeString());
    addLog("info", `Refreshed — ${collected.length} entities found`);
    setLoading(false);
  }

  useEffect(() => {
    if (mode !== "disconnected") refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, mode]);

  const counts: Record<string, number> = {};
  for (const e of allEntities) {
    counts[e.type] = (counts[e.type] ?? 0) + 1;
  }

  const filtered = entityFilter
    ? allEntities.filter(
        (e) =>
          e.type.toLowerCase().includes(entityFilter.toLowerCase()) ||
          e.id.toLowerCase().includes(entityFilter.toLowerCase()),
      )
    : allEntities;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Project Overview</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {mode === "online" ? "Live sync" : "Offline document"} · Connected{" "}
            {connectedAt ? new Date(connectedAt).toLocaleTimeString() : "—"}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {lastRefresh && (
            <span className="text-xs text-zinc-600 mono">refreshed {lastRefresh}</span>
          )}
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700
              text-zinc-300 text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20
                text-amber-400 text-sm rounded-lg transition-colors"
            >
              <ExternalLink size={13} />
              Open in Audiotool
            </a>
          )}
        </div>
      </div>

      {/* Mode banner */}
      {mode === "offline" && (
        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <AlertCircle size={14} className="text-amber-400" />
          <span className="text-amber-300 text-sm">
            Offline mode — changes are local only, not synced to Audiotool. Set{" "}
            <code className="mono text-amber-200">AUDIOTOOL_PAT</code> in Claude Desktop config and
            reconnect for live sync.
          </span>
        </div>
      )}

      {/* Entity type stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ENTITY_TYPES.filter((t) => (counts[t] ?? 0) > 0).map((t) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-3"
          >
            <div
              className="text-2xl font-bold mb-0.5"
              style={{ color: TYPE_COLORS[t] ?? "#f59e0b" }}
            >
              {counts[t]}
            </div>
            <div className="text-xs text-zinc-500 font-mono">{t}</div>
          </motion.div>
        ))}
        {allEntities.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center gap-2 py-8 text-zinc-600">
            <Music2 size={32} strokeWidth={1} />
            <p className="text-sm">No entities yet. Create devices or use Claude to add content.</p>
          </div>
        )}
      </div>

      {/* Entity list */}
      {allEntities.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-300 flex-1">All Entities</h2>
            <input
              type="text"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              placeholder="Filter by type or id..."
              className="bg-zinc-950 border border-zinc-700 rounded-md px-3 py-1 text-xs text-zinc-200
                placeholder-zinc-600 focus:outline-none focus:border-amber-500 w-48 mono"
            />
            <span className="text-xs text-zinc-600">
              {filtered.length}/{allEntities.length}
            </span>
          </div>
          <div className="divide-y divide-zinc-800 max-h-96 overflow-y-auto">
            {filtered.map((e, i) => (
              <div
                key={i}
                className="px-4 py-2.5 flex items-start gap-3 hover:bg-zinc-800/40 transition-colors"
              >
                <span
                  className="inline-block mt-0.5 text-xs mono px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{
                    background: `${TYPE_COLORS[e.type] ?? "#f59e0b"}20`,
                    color: TYPE_COLORS[e.type] ?? "#f59e0b",
                  }}
                >
                  {e.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-400 mono truncate">{e.id}</div>
                  {Object.keys(e.fields).length > 0 && (
                    <div className="text-xs text-zinc-600 mt-0.5 mono truncate">
                      {JSON.stringify(e.fields).slice(0, 80)}
                      {JSON.stringify(e.fields).length > 80 ? "..." : ""}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
