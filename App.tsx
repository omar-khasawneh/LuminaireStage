
import React, { useState } from 'react';
import { Project, LEDStrip, PSU, Voltage, LEDType, MountingStructure, Cable, Fuse, Controller } from './types';
import { DEFAULT_STRIPS, DEFAULT_PSUS, DEFAULT_MOUNTINGS, DEFAULT_CABLES, DEFAULT_FUSES, DEFAULT_CONTROLLERS } from './constants';
import CatalogManager from './components/CatalogManager';
import FixtureStudio from './components/FixtureStudio';
import StageCanvas from './components/StageCanvas';
import EngineeringModule from './components/EngineeringModule';
import { Zap, BrainCircuit, Database, MonitorPlay, Box, Layers, ArrowRight, ChevronRight, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [strips, setStrips] = useState<LEDStrip[]>(DEFAULT_STRIPS);
  const [psus, setPsus] = useState<PSU[]>(DEFAULT_PSUS);
  const [mountings, setMountings] = useState<MountingStructure[]>(DEFAULT_MOUNTINGS);
  const [cables, setCables] = useState<Cable[]>(DEFAULT_CABLES);
  const [fuses, setFuses] = useState<Fuse[]>(DEFAULT_FUSES);
  const [controllers, setControllers] = useState<Controller[]>(DEFAULT_CONTROLLERS);

  const [project, setProject] = useState<Project>({
    id: crypto.randomUUID(),
    name: "New Architectural Stage Design",
    venueType: 'Arena',
    subsystems: [],
    fixtureDefinitions: [],
    zones: [],
    // Added missing ethernetSwitches initialization
    ethernetSwitches: [],
    safetyFactor: 1.25
  });

  const steps = [
    { id: 1, label: 'Inventory Catalog', icon: Database, description: 'Define raw components' },
    { id: 2, label: 'Fixture Studio', icon: Box, description: 'Design custom units' },
    { id: 3, label: 'Arena Layout', icon: MonitorPlay, description: 'Visual placement' },
    { id: 4, label: 'Physics Engine', icon: Zap, description: 'Engineering optimization' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30">
      <header className="border-b border-white/5 bg-slate-900/40 backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 ring-1 ring-white/20">
              <Zap size={28} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none text-white uppercase italic">LuminaireStage <span className="text-indigo-400">Pro</span></h1>
              <p className="text-[9px] uppercase tracking-[0.4em] text-slate-500 font-black mt-1.5 flex items-center gap-2">
                <Layers size={10}/> Industrial Systems Architect
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-3xl border border-white/5">
            {steps.map(step => (
              <button 
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl transition-all duration-300 ${currentStep === step.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 ring-1 ring-white/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <step.icon size={16} />
                <div className="text-left hidden lg:block">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">{step.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-8 py-10">
        <div className="mb-12 flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{steps[currentStep-1].label}</h2>
            <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">{steps[currentStep-1].description}</p>
          </div>
          <div className="flex gap-4">
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(prev => prev - 1)} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all">Previous</button>
            )}
            {currentStep < 4 && (
              <button onClick={() => setCurrentStep(prev => prev + 1)} className="bg-white text-slate-950 hover:bg-slate-200 px-10 py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 shadow-xl">
                Continue <ChevronRight size={18}/>
              </button>
            )}
          </div>
        </div>

        {currentStep === 1 && <CatalogManager strips={strips} setStrips={setStrips} psus={psus} setPsus={setPsus} controllers={controllers} setControllers={setControllers} mountings={mountings} setMountings={setMountings} cables={cables} setCables={setCables} fuses={fuses} setFuses={setFuses} />}
        {currentStep === 2 && <FixtureStudio project={project} setProject={setProject} strips={strips} mountings={mountings} />}
        {currentStep === 3 && <div className="h-[700px]"><StageCanvas project={project} setProject={setProject} strips={strips} /></div>}
        {currentStep === 4 && <EngineeringModule project={project} strips={strips} psus={psus} cables={cables} fuses={fuses} />}
      </main>

      <footer className="border-t border-white/5 bg-slate-900/40 px-8 py-4 flex items-center justify-between text-[10px] text-slate-500 uppercase font-black tracking-widest backdrop-blur-md">
        <div className="flex gap-10 items-center">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> Logic: Real-time</span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-2"><Layout size={12}/> Env: {project.venueType}</span>
        </div>
        <div className="flex gap-10 items-center">
          <span>{project.fixtureDefinitions.length} Fixture Classes</span>
          <span>{project.zones.length} Field Units</span>
          <span className="text-indigo-400">LuminaireStage Enterprise</span>
        </div>
      </footer>
    </div>
  );
};

export default App;