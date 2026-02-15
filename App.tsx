
import React, { useState } from 'react';
import { Project, LEDStrip, PSU, Voltage, LEDType } from './types';
import { DEFAULT_STRIPS, DEFAULT_PSUS } from './constants';
import ProjectSetup from './components/ProjectSetup';
import EngineeringModule from './components/EngineeringModule';
import AIDashboard from './components/AIDashboard';
import InventoryManager from './components/InventoryManager';
import StageCanvas from './components/StageCanvas';
import { Zap, BrainCircuit, Database, Download, MonitorPlay, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'design' | 'visual' | 'eng' | 'ai' | 'inv'>('design');
  const [strips, setStrips] = useState<LEDStrip[]>(DEFAULT_STRIPS);
  const [psus, setPsus] = useState<PSU[]>(DEFAULT_PSUS);
  const [project, setProject] = useState<Project>({
    id: crypto.randomUUID(),
    name: "Multi-Subsystem Arena Build",
    venueType: 'Arena',
    subsystems: [
      { id: 'sub1', name: 'Stage Left Hub', psuId: 'p2', controllerId: 'c1', x: 200, y: 200 },
      { id: 'sub2', name: 'Stage Right Hub', psuId: 'p2', controllerId: 'c2', x: 800, y: 200 }
    ],
    zones: [
      { id: 'z1', name: 'SL Arch 1', stripId: 's5', length: 12, wireGauge: 14, wireLength: 5, x: 100, y: 400, rotation: 0, subsystemId: 'sub1' },
      { id: 'z2', name: 'SL Arch 2', stripId: 's5', length: 12, wireGauge: 14, wireLength: 8, x: 250, y: 400, rotation: 0, subsystemId: 'sub1' },
      { id: 'z3', name: 'SR Arch 1', stripId: 's5', length: 12, wireGauge: 14, wireLength: 5, x: 750, y: 400, rotation: 0, subsystemId: 'sub2' },
      { id: 'z4', name: 'SR Arch 2', stripId: 's5', length: 12, wireGauge: 14, wireLength: 8, x: 900, y: 400, rotation: 0, subsystemId: 'sub2' }
    ],
    ethernetSwitches: [
      { id: 'sw1', name: 'FOH Master Switch', x: 500, y: 50 }
    ],
    safetyFactor: 1.25
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-indigo-500/30">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">LuminaireStage <span className="text-indigo-400">Pro</span></h1>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black mt-1">Multi-Node Design Suite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
              <button onClick={() => setActiveTab('design')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'design' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>Layout</button>
              <button onClick={() => setActiveTab('visual')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}><MonitorPlay size={14}/> Topology</button>
              <button onClick={() => setActiveTab('eng')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'eng' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>Engineering</button>
              <button onClick={() => setActiveTab('inv')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'inv' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}><Database size={14}/> Catalog</button>
              <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}><BrainCircuit size={14}/> AI Plan</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {activeTab === 'design' && <ProjectSetup project={project} setProject={setProject} strips={strips} psus={psus} />}
        {activeTab === 'visual' && <div className="h-[600px]"><StageCanvas project={project} setProject={setProject} strips={strips} /></div>}
        {activeTab === 'eng' && <EngineeringModule project={project} strips={strips} psus={psus} />}
        {activeTab === 'ai' && <AIDashboard project={project} strips={strips} psus={psus} />}
        {activeTab === 'inv' && <InventoryManager strips={strips} setStrips={setStrips} psus={psus} setPsus={setPsus} />}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 uppercase font-black tracking-widest">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Multi-Node Logic Active</span>
        </div>
        <div className="flex gap-4 items-center">
          <span>{project.subsystems.length} Subsystems | {project.zones.length} Fixtures</span>
          <span className="text-indigo-400">LuminaireStage v4.0.0</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
