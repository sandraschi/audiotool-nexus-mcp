/**
 * TimelineView — create note tracks and note regions.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Loader2, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Ticks } from "@audiotool/nexus";
import { useNexusStore } from "../store";

const SEMIBREVE = Ticks.SemiBreve;

export function TimelineView() {
  const { doc, mode, addLog } = useNexusStore();

  // Note track form
  const [deviceId, setDeviceId] = useState("");
  const [trackOrder, setTrackOrder] = useState(0);
  const [trackStatus, setTrackStatus] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [trackMsg, setTrackMsg] = useState("");
  const [lastTrackId, setLastTrackId] = useState("");

  // Note region form
  const [trackId, setTrackId] = useState("");
  const [positionBars, setPositionBars] = useState(0);
  const [durationBars, setDurationBars] = useState(4);
  const [regionStatus, setRegionStatus] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [regionMsg, setRegionMsg] = useState("");

  async function handleCreateTrack() {
    if (!doc && mode === "online") { setTrackMsg("No doc"); setTrackStatus("error"); return; }
    setTrackStatus("busy"); setTrackMsg("");
    try {
      let createdId = "";
      await doc.modify((t: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const track = (t as any).create("noteTrack", {
          orderAmongTracks: trackOrder,
          player: deviceId.trim(),
        });
        createdId = track?.id ?? track?.location ?? "unknown";
      });
      setLastTrackId(createdId);
      setTrackId(createdId);
      setTrackMsg(`Created noteTrack id=${createdId}`);
      addLog("info", `Created noteTrack: ${createdId}`);
      setTrackStatus("ok");
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err);
      setTrackMsg(m); addLog("error", m); setTrackStatus("error");
    }
  }

  async function handleCreateRegion() {
    if (!doc && mode === "online") { setRegionMsg("No doc"); setRegionStatus("error"); return; }
    if (!trackId.trim()) { setRegionMsg("Enter a track id"); setRegionStatus("error"); return; }
    setRegionStatus("busy"); setRegionMsg("");
    const posTicks = Math.round(positionBars * SEMIBREVE);
    const durTicks = Math.round(durationBars * SEMIBREVE);
    try {
      let createdId = "";
      await doc.modify((t: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const region = (t as any).create("noteRegion", {
          track: trackId.trim(),
          region: { positionTicks: posTicks, durationTicks: durTicks },
        });
        createdId = region?.id ?? region?.location ?? "unknown";
      });
      setRegionMsg(`Created noteRegion id=${createdId} at bar ${positionBars}, dur ${durationBars} bars`);
      addLog("info", `Created noteRegion: ${createdId}`);
      setRegionStatus("ok");
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err);
      setRegionMsg(m); addLog("error", m); setRegionStatus("error");
    }
  }

  function StatusMsg({ status, msg }: { status: string; msg: string }) {
    if (!msg) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-start gap-2 p-3 rounded-lg text-sm
          ${status === "ok"
            ? "bg-green-500/10 border border-green-500/20 text-green-300"
            : "bg-red-500/10 border border-red-500/20 text-red-300"
          }`}
      >
        {status === "ok"
          ? <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
          : <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />}
        <span className="mono text-xs">{msg}</span>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Timeline</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Create note tracks and MIDI regions.</p>
      </div>

      {/* Ticks info */}
      <div className="flex items-start gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
        <Info size={13} className="text-zinc-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-zinc-500">
          1 bar (4/4) = {SEMIBREVE.toLocaleString()} ticks (Ticks.SemiBreve).
          This view works in bars for convenience.
        </p>
      </div>

      {/* Note Track form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300">Create Note Track</h2>

        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">Device ID (instrument to link)</label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="entity id or location from Project view"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm
              text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 mono"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">Track Order (0 = first)</label>
          <input
            type="number"
            value={trackOrder}
            onChange={(e) => setTrackOrder(Number(e.target.value))}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm
              text-zinc-100 focus:outline-none focus:border-amber-500 mono"
          />
        </div>

        <StatusMsg status={trackStatus} msg={trackMsg} />

        <button
          onClick={handleCreateTrack}
          disabled={trackStatus === "busy"}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400
            disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold
            px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          {trackStatus === "busy" ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
          {trackStatus === "busy" ? "Creating..." : "Create Note Track"}
        </button>

        {lastTrackId && (
          <p className="text-xs text-zinc-600 mono">
            Last created track id: <span className="text-zinc-400">{lastTrackId}</span>
            {" "}(auto-filled below)
          </p>
        )}
      </div>

      {/* Note Region form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300">Add Note Region</h2>

        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">Track ID</label>
          <input
            type="text"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            placeholder="track id from above"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm
              text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">Start (bars)</label>
            <input
              type="number"
              min={0}
              value={positionBars}
              onChange={(e) => setPositionBars(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm
                text-zinc-100 focus:outline-none focus:border-amber-500 mono"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">Duration (bars)</label>
            <input
              type="number"
              min={1}
              value={durationBars}
              onChange={(e) => setDurationBars(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm
                text-zinc-100 focus:outline-none focus:border-amber-500 mono"
            />
          </div>
        </div>

        <p className="text-xs text-zinc-600 mono">
          → positionTicks: {Math.round(positionBars * SEMIBREVE).toLocaleString()} ·
          durationTicks: {Math.round(durationBars * SEMIBREVE).toLocaleString()}
        </p>

        <StatusMsg status={regionStatus} msg={regionMsg} />

        <button
          onClick={handleCreateRegion}
          disabled={regionStatus === "busy"}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400
            disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold
            px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          {regionStatus === "busy" ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
          {regionStatus === "busy" ? "Creating..." : "Add Note Region"}
        </button>
      </div>
    </div>
  );
}
