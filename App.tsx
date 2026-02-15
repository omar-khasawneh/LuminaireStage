
import React, { useState } from 'react';
import { Project, LEDStrip, PSU, Controller, Cable, Fuse, Mounting, Voltage, LEDType } from './types';
import { DEFAULT_STRIPS, DEFAULT_PSUS, DEFAULT_CONTROLLERS, DEFAULT_CABLES, DEFAULT_FUSES, DEFAULT_MOUNTING } from './constants';
import ProjectSetup from './components/ProjectSetup';
import EngineeringModule from './components/EngineeringModule';
import AIDashboard from './components/AIDashboard';
import InventoryManager from './components/InventoryManager';
import StageCanvas from './components/StageCanvas';
import FixtureStudio from './components/FixtureStudio';
import { Zap, BrainCircuit, Database, MonitorPlay, Box, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'design' | 'studio' | 'visual' | 'eng' | 'ai' | 'inv'>('design');
  const [strips, setStrips] = useState<LEDStrip[]>(DEFAULT_STRIPS);
  const [psus, setPsus] = useState<PSU[]>(DEFAULT_PSUS);
  const [controllers, setControllers] = useState<Controller[]>(DEFAULT_CONTROLLERS);
  const [cables, setCables] = useState<Cable[]>(DEFAULT_CABLES);
  const [fuses, setFuses] = useState<Fuse[]>(DEFAULT_FUSES);
  const [mountings, setMountings] = useState<Mounting[]>(DEFAULT_MOUNTING);

  const [project, setProject] = useState<Project>({
    id: crypto.randomUUID(),
    name: "Architectural Visual Build",
    venueType: 'Arena',
    subsystems: [
      { id: 'sub1', name: 'West Wing Hub', psuId: 'p2', controllerId: 'c1', x: 200, y: 150 }
    ],
    fixtures: [
      { id: 'fdef1', name: 'Main Arch 4m', shapeType: 'Rectangle', stripId: 's5', totalLength: 4, mountingId: 'm1' }
    ],
    zones: [
      { id: 'z1', name: 'North Facade', fixtureId: 'fdef1', wireGauge: 14, wireLength: 10, x: 400, y: 300, rotation: 0, subsystemId: 'sub1', fuseId: 'f2' }
    ],
    ethernetSwitches: [{ id: 'sw1', name: 'Master Switch', x: 500, y: 50 }],
    safetyFactor: 1.25
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-indigo-500/30">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none text-white">LuminaireStage <span className="text-indigo-400">Pro</span></h1>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black mt-1">Industrial Control Engine</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-2xl border border-slate-700">
            {[
              { id: 'design', label: 'Layout', icon: Settings, color: 'text-slate-400' },
              { id: 'studio', label: 'Studio', icon: Box, color: 'text-indigo-400' },
              { id: 'visual', label: 'Arena', icon: MonitorPlay, color: 'text-cyan-400' },
              { id: 'eng', label: 'Physics', icon: Zap, color: 'text-emerald-400' },
              { id: 'ai', label: 'AI Plan', icon: BrainCircuit, color: 'text-indigo-500' },
              { id: 'inv', label: 'Catalog', icon: Database, color: 'text-amber-400' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-slate-700 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={14} className={activeTab === tab.id ? 'text-white' : tab.color} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {activeTab === 'design' && <ProjectSetup project={project} setProject={setProject} strips={strips} psus={psus} />}
        {activeTab === 'studio' && <FixtureStudio project={project} setProject={setProject} strips={strips} mountings={mountings} />}
        {activeTab === 'visual' && <div className="h-[650px]"><StageCanvas project={project} setProject={setProject} strips={strips} cables={cables} mountings={mountings} /></div>}
        {activeTab === 'eng' && <EngineeringModule project={project} strips={strips} psus={psus} />}
        {activeTab === 'ai' && <AIDashboard project={project} strips={strips} psus={psus} />}
        {activeTab === 'inv' && <InventoryManager strips={strips} setStrips={setStrips} psus={psus} setPsus={setPsus} controllers={controllers} setControllers={setControllers} cables={cables} setCables={setCables} fuses={fuses} setFuses={setFuses} mountings={mountings} setMountings={setMountings} />}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 uppercase font-black tracking-widest">
        <div className="flex gap-4 items-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>System v5.2 (Industrial) | Venue: {project.venueType}</span>
        </div>
        <div className="flex gap-4">
          <span>{project.fixtures.length} Custom Profiles</span>
          <span className="text-indigo-400">LuminaireStage Pro</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
