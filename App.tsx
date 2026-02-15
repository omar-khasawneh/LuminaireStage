
import React, { useState } from 'react';
import { Project, LEDStrip, PSU, Voltage, LEDType, MountingStructure, Cable, Fuse, Controller } from './types';
import { DEFAULT_STRIPS, DEFAULT_PSUS, DEFAULT_MOUNTINGS, DEFAULT_CABLES, DEFAULT_FUSES, DEFAULT_CONTROLLERS } from './constants';
import ProjectSetup from './components/ProjectSetup';
import EngineeringModule from './components/EngineeringModule';
import AIDashboard from './components/AIDashboard';
import InventoryManager from './components/InventoryManager';
import StageCanvas from './components/StageCanvas';
import FixtureStudio from './components/FixtureStudio';
import { Zap, BrainCircuit, Database, MonitorPlay, Box, Settings, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'design' | 'studio' | 'visual' | 'eng' | 'ai' | 'inv'>('design');
  const [strips, setStrips] = useState<LEDStrip[]>(DEFAULT_STRIPS);
  const [psus, setPsus] = useState<PSU[]>(DEFAULT_PSUS);
  const [mountings, setMountings] = useState<MountingStructure[]>(DEFAULT_MOUNTINGS);
  const [cables, setCables] = useState<Cable[]>(DEFAULT_CABLES);
  const [fuses, setFuses] = useState<Fuse[]>(DEFAULT_FUSES);
  const [controllers, setControllers] = useState<Controller[]>(DEFAULT_CONTROLLERS);

  const [project, setProject] = useState<Project>({
    id: crypto.randomUUID(),
    name: "Architectural Stage Alpha",
    venueType: 'Arena',
    subsystems: [
      { id: 'sub1', name: 'West Wing FOH', psuId: 'p2', controllerId: 'c1', x: 200, y: 150 }
    ],
    fixtureDefinitions: [
      { id: 'fd1', name: 'Main Arch 3m', stripId: 's5', length: 3.0, mountingId: 'm1' }
    ],
    zones: [
      { id: 'z1', name: 'Entrance Arch A', fixtureDefinitionId: 'fd1', wireGauge: 14, wireLength: 8, x: 450, y: 350, rotation: 0, subsystemId: 'sub1' }
    ],
    ethernetSwitches: [
      { id: 'sw1', name: 'Master Backbone', x: 500, y: 50 }
    ],
    safetyFactor: 1.25
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 flex flex-col">
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 ring-1 ring-white/20">
              <Zap size={28} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none text-white">LuminaireStage <span className="text-indigo-400">PRO</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mt-1.5 flex items-center gap-2">
                <Layers size={10}/> Technical Design Engine
              </p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-3xl border border-white/5">
            {[
              { id: 'design', label: 'Layout', icon: Settings, color: 'text-indigo-400' },
              { id: 'studio', label: 'Studio', icon: Box, color: 'text-emerald-400' },
              { id: 'visual', label: 'Arena', icon: MonitorPlay, color: 'text-cyan-400' },
              { id: 'eng', label: 'Physics', icon: Zap, color: 'text-amber-400' },
              { id: 'inv', label: 'Catalog', icon: Database, color: 'text-slate-400' },
              { id: 'ai', label: 'Reports', icon: BrainCircuit, color: 'text-indigo-500' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === tab.id ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? 'text-white' : tab.color} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-10 overflow-y-auto">
        {activeTab === 'design' && <ProjectSetup project={project} setProject={setProject} strips={strips} psus={psus} cables={cables} fuses={fuses} />}
        {activeTab === 'studio' && <FixtureStudio project={project} setProject={setProject} strips={strips} mountings={mountings} />}
        {activeTab === 'visual' && <div className="h-[750px]"><StageCanvas project={project} setProject={setProject} strips={strips} mountings={mountings} cables={cables} fuses={fuses} /></div>}
        {activeTab === 'eng' && <EngineeringModule project={project} strips={strips} psus={psus} />}
        {activeTab === 'ai' && <AIDashboard project={project} strips={strips} psus={psus} />}
        {activeTab === 'inv' && <InventoryManager strips={strips} setStrips={setStrips} psus={psus} setPsus={setPsus} controllers={controllers} setControllers={setControllers} mountings={mountings} setMountings={setMountings} cables={cables} setCables={setCables} fuses={fuses} setFuses={setFuses} />}
      </main>

      <footer className="border-t border-white/5 bg-slate-900/80 px-8 py-3 flex items-center justify-between text-[10px] text-slate-500 uppercase font-black tracking-widest backdrop-blur-md">
        <div className="flex gap-8 items-center">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Control Core v5.1</span>
          <span className="text-slate-600">|</span>
          <span>Venue Environment: {project.venueType}</span>
        </div>
        <div className="flex gap-8 items-center">
          <span>{project.subsystems.length} Subsystems</span>
          <span className="text-indigo-400">Architectural Stage Design Platform</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
