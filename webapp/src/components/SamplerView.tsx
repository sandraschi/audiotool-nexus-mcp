import { motion } from "framer-motion";
import { Disc, Play, Square, FastForward, Rewind, Waves, Upload, FolderOpen, MoreVertical } from "lucide-react";

export function SamplerView() {
  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 flex flex-col space-y-6">
        <header className="px-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
            <Disc className="text-amber-500" size={24} />
            Nexus Sampler
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Granular signal manipulation</p>
        </header>

        {/* Waveform Display */}
        <div className="glass-panel flex-1 relative overflow-hidden flex flex-col p-6 space-y-6">
          <div className="absolute top-0 right-0 p-4 flex gap-2">
            <div className="px-3 py-1 rounded bg-amber-500 text-zinc-950 text-[10px] font-bold uppercase tracking-widest">Live Buffer</div>
            <div className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">48kHz / 24bit</div>
          </div>

          <div className="flex-1 bg-zinc-950/80 rounded-2xl border border-zinc-900 relative overflow-hidden group">
             {/* Waveform Visualization Mock */}
             <div className="absolute inset-0 flex items-center justify-center p-8 gap-1">
                {[...Array(120)].map((_, i) => {
                  const height = Math.abs(Math.sin(i * 0.1) * 60) + Math.abs(Math.cos(i * 0.05) * 40);
                  return (
                    <motion.div 
                      key={i}
                      initial={{ height: 2 }}
                      animate={{ height }}
                      className={`w-1 rounded-full ${i % 3 === 0 ? 'bg-amber-500/60' : 'bg-amber-500/20'} group-hover:bg-amber-400/80 transition-all`}
                    />
                  );
                })}
             </div>
             
             {/* Position Indicators */}
             <div className="absolute inset-0 flex">
                <div className="w-[40%] border-r border-amber-500/40 bg-amber-500/5" />
                <div className="w-[10%] border-r border-zinc-100 overflow-hidden relative">
                   <div className="absolute inset-0 bg-white/10 animate-pulse" />
                </div>
                <div className="w-[50%] bg-zinc-950/40" />
             </div>

             <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <span className="text-[10px] font-mono text-zinc-700">00:00.000</span>
                <span className="text-[10px] font-mono text-zinc-700">00:12.450</span>
             </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all"><Rewind size={20} /></button>
              <button className="w-16 h-16 rounded-2xl bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center justify-center text-zinc-950 hover:bg-amber-400 transition-all"><Play size={28} fill="currentColor" /></button>
              <button className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all"><Square size={20} fill="currentColor" /></button>
              <button className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all"><FastForward size={20} /></button>
            </div>

            <div className="flex gap-4">
               <div className="text-right">
                  <span className="text-[10px] text-zinc-600 block uppercase font-bold mb-1">Pitch Shift</span>
                  <span className="text-zinc-100 font-mono text-xl">+2.5 st</span>
               </div>
               <div className="text-right">
                  <span className="text-[10px] text-zinc-600 block uppercase font-bold mb-1">Sample Rate</span>
                  <span className="text-zinc-100 font-mono text-xl">48.0 Khz</span>
               </div>
            </div>
          </div>
        </div>

        {/* Quick Parameters */}
        <div className="grid grid-cols-4 gap-4">
           {['Attack', 'Decay', 'Sustain', 'Release'].map((param) => (
             <div key={param} className="glass-panel p-4 space-y-3">
                <span className="text-[10px] uppercase font-bold text-zinc-600 block">{param}</span>
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                   <div className="h-full bg-amber-500/50 w-3/4 rounded-full" />
                </div>
                <span className="text-xs text-zinc-400 font-mono">{Math.floor(Math.random() * 100)} ms</span>
             </div>
           ))}
        </div>
      </div>

      {/* Sample Sidebar */}
      <div className="w-80 flex flex-col space-y-6">
         <div className="bg-zinc-900 border border-zinc-800/50 rounded-2xl p-6 space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
               <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <FolderOpen size={16} className="text-amber-500" />
                  Sample Library
               </h2>
               <button className="p-2 hover:bg-white/5 rounded-lg transition-all"><Upload size={16} className="text-zinc-500" /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-none">
               {[
                 { name: 'kick_analog_01.wav', size: '256 KB', type: 'Percussion' },
                 { name: 'snare_tight_808.wav', size: '412 KB', type: 'Percussion' },
                 { name: 'ambient_pad_c3.mp3', size: '2.4 MB', type: 'Synth' },
                 { name: 'vocal_chop_nexus.wav', size: '890 KB', type: 'Vocal' },
                 { name: 'bass_sub_glitch.wav', size: '1.2 MB', type: 'Bass' },
               ].map((sample, i) => (
                 <div key={i} className="group p-3 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                       <Waves size={14} className="text-zinc-700 group-hover:text-amber-500/50 transition-colors" />
                       <div>
                          <p className="text-[12px] font-medium text-zinc-400 group-hover:text-zinc-100 transition-colors truncate w-32">{sample.name}</p>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase">{sample.type}</p>
                       </div>
                    </div>
                    <MoreVertical size={14} className="text-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
               ))}
            </div>

            <div className="pt-6 border-t border-zinc-800/50 space-y-3">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Disk Usage</span>
                  <span className="text-[10px] text-zinc-500 font-mono">1.2 GB / 256 GB</span>
               </div>
               <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-800 w-[15%]" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
