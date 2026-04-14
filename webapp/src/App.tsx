import { useEffect } from "react";
import { CablesView } from "./components/CablesView";
import { ChatView } from "./components/ChatView";
import { ConnectPage } from "./components/ConnectPage";
import { DevicesView } from "./components/DevicesView";
import { LogViewer } from "./components/LogViewer";
import { MasteringView } from "./components/MasteringView";
import { MixerView } from "./components/MixerView";
import { ProjectView } from "./components/ProjectView";
import { SamplerView } from "./components/SamplerView";
import { SettingsView } from "./components/SettingsView";
import { Sidebar } from "./components/Sidebar";
import { TimelineView } from "./components/TimelineView";
import { useNexusStore } from "./store";

export default function App() {
  const { page, sidebarOpen } = useNexusStore();

  useEffect(() => {
    // Inject Outfit font and metadata
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.title = "Audiotool Nexus Dashboard | Industrial SOTA";
  }, []);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-zinc-950 text-white selection:bg-amber-500/30">
      {/* Dynamic Background Element */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <Sidebar />

      <main
        className={`relative z-10 flex-1 overflow-y-auto transition-all duration-700 ease-[0.23,1,0.32,1] ${
          sidebarOpen ? "pl-[240px]" : "pl-[80px]"
        }`}
      >
        <div className="min-h-full px-8 py-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {page === "connect" && <ConnectPage />}
          {page === "project" && <ProjectView />}
          {page === "devices" && <DevicesView />}
          {page === "mixer" && <MixerView />}
          {page === "sampler" && <SamplerView />}
          {page === "timeline" && <TimelineView />}
          {page === "cables" && <CablesView />}
          {page === "mastering" && <MasteringView />}
          {page === "chat" && <ChatView />}
          {page === "settings" && <SettingsView />}
          {page === "log" && <LogViewer />}
        </div>
      </main>
    </div>
  );
}
