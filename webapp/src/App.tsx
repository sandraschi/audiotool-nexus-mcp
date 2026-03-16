import { useNexusStore } from "./store";
import { Sidebar } from "./components/Sidebar";
import { ConnectPage } from "./components/ConnectPage";
import { ProjectView } from "./components/ProjectView";
import { DevicesView } from "./components/DevicesView";
import { TimelineView } from "./components/TimelineView";
import { CablesView } from "./components/CablesView";
import { LogViewer } from "./components/LogViewer";

export default function App() {
  const { page, sidebarOpen } = useNexusStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar />

      <main
        className="flex-1 overflow-y-auto transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? "220px" : "56px" }}
      >
        <div className="min-h-full p-6">
          {page === "connect" && <ConnectPage />}
          {page === "project" && <ProjectView />}
          {page === "devices" && <DevicesView />}
          {page === "timeline" && <TimelineView />}
          {page === "cables" && <CablesView />}
          {page === "log" && <LogViewer />}
        </div>
      </main>
    </div>
  );
}
