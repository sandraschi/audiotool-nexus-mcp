import { motion } from "framer-motion";
import { Zap, Activity, Eye, ShieldCheck, Gauge, Layers, RefreshCcw } from "lucide-react";

export function MasteringView() {
  return (
    <div className="space-y-8 h-full flex flex-col">
      <header className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
            <Zap className="text-amber-500" size={24} />
            Mastering Suite
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Final spectral polish & signal integrity</p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-xl bg-green-500/5 border border-green-500/20 flex items-center gap-3">
              <ShieldCheck size={16} className="text-green-500" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest leading-none">Safe-Peak Active</span>
           </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-8">
        {/* Visualizer Main */}
        <div className="col-span-8 space-y-8">
           <div className="glass-panel h-[45vh] relative overflow-hidden flex flex-col">
              <div className="bg-zinc-950/50 border-b border-white/[0.02] p-4 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Real-time Spectrum</span>
                    <div className="h-4 w-px bg-zinc-800" />
                    <div className="flex gap-2">
                       <button className="px-2 py-1 rounded bg-amber-500 text-zinc-950 text-[9px] font-bold uppercase tracking-tighter transition-all">FFT 2048</button>
                       <button className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 text-[9px] font-bold uppercase tracking-tighter hover:text-white transition-all">Smooth</button>
                    </div>
                 </div>
                 <Eye size={14} className="text-zinc-700" />
              </div>

              <div className="flex-1 relative flex items-end justify-center p-8 gap-1 overflow-hidden">
                {/* Spectrum Analyzer Visualization Mock */}
                {[...Array(64)].map((_, i) => {
                  const baseline = Math.sin(i * 0.2) * 20 + 30;
                  const noise = Math.random() * 40;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ height: baseline }}
                      animate={{ height: baseline + noise }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: Math.random() * 0.5 + 0.2 
                      }}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-amber-500/5 via-amber-500/20 to-amber-400"
                    />
                  );
                })}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-8">
              <div className="glass-panel p-6 space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Stereo Width</h3>
                    <Layers size={14} className="text-amber-500" />
                 </div>
                 <div className="h-32 bg-zinc-950/80 rounded-2xl border border-white/[0.02] flex items-center justify-center relative overflow-hidden">
                    <div className="w-px h-full bg-zinc-900 absolute left-1/2" />
                    <div className="h-px w-full bg-zinc-900 absolute top-1/2" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, 5, -5, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 blur-sm shadow-[0_0_40px_rgba(245,158,11,0.1)]" 
                    />
                 </div>
              </div>
              <div className="glass-panel p-6 space-y-6 flex flex-col justify-center">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Signal Metrics</h3>
                    <Gauge size={14} className="text-amber-500" />
                 </div>
                 <div className="space-y-4">
                    {[
                      { label: 'RMS Power', value: '-12.4 dB', percent: 65 },
                      { label: 'Peak Level', value: '-1.2 dB', percent: 88 },
                      { label: 'Dynamic Range', value: '14.2 LU', percent: 45 }
                    ].map((metric) => (
                      <div key={metric.label} className="space-y-1.5">
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                            <span className="text-zinc-600">{metric.label}</span>
                            <span className="text-zinc-400 font-mono">{metric.value}</span>
                         </div>
                         <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.percent}%` }}
                              className="h-full bg-amber-500/30 rounded-full" 
                            />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Mastering Controls Sidebar */}
        <div className="col-span-4 space-y-8">
           <div className="glass-panel p-6 space-y-8 flex flex-col h-full">
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Master Rack</h3>
                    <RefreshCcw size={14} className="text-zinc-700 hover:text-amber-500 transition-colors cursor-pointer" />
                 </div>
                 
                 <div className="space-y-3">
                    {[
                      { name: 'Linear-Phase EQ', status: 'Active', active: true },
                      { name: 'Glue Compressor', status: 'Bypassed', active: false },
                      { name: 'Oversampled Limiter', status: 'Active', active: true },
                      { name: 'Stereo Imager', status: 'Active', active: true },
                      { name: 'Harmonic Exciter', status: 'Active', active: true }
                    ].map((fx, i) => (
                      <div key={i} className={`p-4 rounded-xl border transition-all flex items-center justify-between group
                        ${fx.active ? 'bg-amber-500/5 border-amber-500/10' : 'bg-zinc-950/20 border-zinc-800/30 grayscale opacity-40'}`}>
                         <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${fx.active ? 'bg-amber-500' : 'bg-zinc-700'}`} />
                            <span className={`text-[12px] font-bold ${fx.active ? 'text-zinc-100' : 'text-zinc-600'}`}>{fx.name}</span>
                         </div>
                         <button className={`text-[9px] uppercase font-bold transition-all px-2 py-1 rounded
                           ${fx.active ? 'text-amber-500 hover:bg-amber-500/10' : 'text-zinc-700 hover:text-zinc-500'}`}>
                           {fx.active ? 'Bypass' : 'Enable'}
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="flex-1 flex flex-col justify-end">
                 <button className="primary-button w-full flex items-center justify-center gap-3 py-4 text-sm">
                    <Zap size={18} fill="currentColor" />
                    Commit Agentic Mastering
                 </button>
                 <p className="text-[9px] text-zinc-600 text-center mt-3 font-bold uppercase tracking-tight">
                    Powered by Nexus Real-time Analysis Grid
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
