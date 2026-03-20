import { useEffect } from "react";
import { useNexusStore } from "./store";
import { Sidebar } from "./components/Sidebar";
import { ConnectPage } from "./components/ConnectPage";
import { ProjectView } from "./components/ProjectView";
import { DevicesView } from "./components/DevicesView";
import { TimelineView } from "./components/TimelineView";
import { CablesView } from "./components/CablesView";
import { LogViewer } from "./components/LogViewer";
import { MixerView } from "./components/MixerView";
import { SamplerView } from "./components/SamplerView";
import { MasteringView } from "./components/MasteringView";
import { ChatView } from "./components/ChatView";
import { SettingsView } from "./components/SettingsView";

export default function App() {
  const { page, sidebarOpen } = useNexusStore();

  useEffect(() => {
    // Inject Outfit font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30">
      <Sidebar />

      <main
        className={`flex-1 overflow-y-auto transition-all duration-500 ease-[0.23,1,0.32,1] ${sidebarOpen ? "pl-[240px]" : "pl-[64px]"}`}
      >
        <div className="min-h-full p-8 max-w-[1400px] mx-auto">
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
