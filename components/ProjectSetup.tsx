
import React from 'react';
import { Project, Subsystem, Zone, LEDStrip, PSU, FixtureDefinition, Cable, Fuse } from '../types';
import { DEFAULT_CONTROLLERS, DEFAULT_FUSES, DEFAULT_CABLES } from '../constants';
import { Plus, Trash2, Settings, Layers, Box, Ruler, Shield } from 'lucide-react';

interface Props {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  strips: LEDStrip[];
  psus: PSU[];
  cables: Cable[];
  fuses: Fuse[];
}

const ProjectSetup: React.FC<Props> = ({ project, setProject, strips, psus, cables, fuses }) => {
  const isOutdoor = project.venueType === 'Outdoor';

  const addSubsystem = () => {
    const newSub: Subsystem = {
      id: crypto.randomUUID(),
      name: `Hub ${project.subsystems.length + 1}`,
      psuId: psus[0].id,
      controllerId: DEFAULT_CONTROLLERS[0].id,
      x: 300,
      y: 100 + (project.subsystems.length * 100)
    };
    setProject(p => ({ ...p, subsystems: [...p.subsystems, newSub] }));
  };

  const addFixtureInstance = (subId: string) => {
    if (project.fixtureDefinitions.length === 0) {
      alert("No fixtures designed yet! Go to the 'Studio' tab to create your first lighting unit.");
      return;
    }

    const newZone: Zone = {
      id: crypto.randomUUID(),
      name: `Unit ${project.zones.length + 1}`,
      fixtureDefinitionId: project.fixtureDefinitions[0].id,
      wireGauge: 18,
      wireLength: 5,
      x: 500,
      y: 150 + (project.zones.length * 30),
      rotation: 0,
      subsystemId: subId,
      fuseId: fuses[0].id
    };
    setProject(p => ({ ...p, zones: [...p.zones, newZone] }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-800 p-6 rounded-[2.5rem] border border-slate-700 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 text-indigo-400 opacity-10 group-hover:opacity-20 transition-opacity">
             <Settings size={80}/>
          </div>
          <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4 relative z-10">
            <Settings className="text-indigo-400" size={20} />
            <h2 className="text-xl font-black text-white">Project Config</h2>
          </div>
          <div className="space-y-4 relative z-10">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Scope</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
                value={project.venueType}
                onChange={e => setProject({...project, venueType: e.target.value as any})}
              >
                <option>Indoor</option><option>Outdoor</option><option>Club</option><option>Arena</option>
              </select>
            </div>
            <button 
              onClick={addSubsystem}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-3xl font-black text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 uppercase tracking-widest text-xs"
            >
              <Plus size={18} /> Deploy Control Hub
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-8">
        {project.subsystems.map(sub => (
          <div key={sub.id} className="bg-slate-800/40 backdrop-blur-md rounded-[3rem] border border-slate-700/50 p-8 space-y-8 relative group hover:border-indigo-500/30 transition-all shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-500/10 rounded-[1.5rem] text-indigo-400 shadow-inner group-hover:scale-110 transition-transform"><Layers size={28}/></div>
                <div>
                  <input 
                    className="bg-transparent text-2xl font-black text-white outline-none border-b border-transparent hover:border-slate-600 focus:border-indigo-500 transition-all w-64"
                    value={sub.name}
                    onChange={e => setProject(p => ({...p, subsystems: p.subsystems.map(s => s.id === sub.id ? {...s, name: e.target.value} : s)}))}
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Infrastructure Hub</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addFixtureInstance(sub.id)} className="bg-slate-700 hover:bg-slate-600 px-5 py-2.5 rounded-2xl text-xs font-black text-white flex items-center gap-2 transition-all">
                  <Plus size={16}/> Install Fixture
                </button>
                <button onClick={() => setProject(p => ({...p, subsystems: p.subsystems.filter(s => s.id !== sub.id)}))} className="text-slate-600 hover:text-red-400 p-2 transition-colors"><Trash2 size={24}/></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><Box size={14}/> Active Fixture Chain</h4>
                <div className="space-y-3">
                  {project.zones.filter(z => z.subsystemId === sub.id).map(zone => (
                    <div key={zone.id} className="bg-slate-900/40 border border-slate-700/50 p-5 rounded-[2rem] flex items-center justify-between group/fix transition-all hover:bg-slate-900">
                      <div className="space-y-1 flex-1">
                        <input 
                          className="bg-transparent text-sm font-black text-slate-200 outline-none w-full" 
                          value={zone.name}
                          onChange={e => setProject(p => ({...p, zones: p.zones.map(x => x.id === zone.id ? {...x, name: e.target.value} : x)}))}
                        />
                        <select 
                          className="bg-transparent text-[10px] text-indigo-400 font-bold outline-none cursor-pointer hover:text-indigo-300"
                          value={zone.fixtureDefinitionId}
                          onChange={e => setProject(p => ({...p, zones: p.zones.map(z => z.id === zone.id ? {...z, fixtureDefinitionId: e.target.value} : z)}))}
                        >
                          {project.fixtureDefinitions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 text-slate-500">
                            <Ruler size={10}/>
                            <span className="text-[9px] font-bold uppercase">{zone.wireLength}m Feed</span>
                          </div>
                          <select 
                            className="bg-slate-800 text-[9px] font-mono text-slate-400 border border-slate-700 rounded px-1"
                            value={zone.wireGauge}
                            onChange={e => setProject(p => ({...p, zones: p.zones.map(z => z.id === zone.id ? {...z, wireGauge: parseInt(e.target.value)} : z)}))}
                          >
                            <option value={24}>24 AWG</option><option value={20}>20 AWG</option><option value={18}>18 AWG</option><option value={14}>14 AWG</option><option value={10}>10 AWG</option>
                          </select>
                        </div>
                        <button onClick={() => setProject(p => ({...p, zones: p.zones.filter(z => z.id !== zone.id)}))} className="text-slate-700 group-hover/fix:text-red-400 transition-colors p-2"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  {project.zones.filter(z => z.subsystemId === sub.id).length === 0 && (
                    <div className="text-center py-10 border border-dashed border-slate-700 rounded-[2rem] text-slate-600 italic text-xs">
                      Chain is empty. Connect your first unit.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-slate-700/50 flex flex-col gap-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Core Infrastructure</h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-black uppercase">Main Power Supply</label>
                      <select 
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                        value={sub.psuId}
                        onChange={e => setProject(p => ({...p, subsystems: p.subsystems.map(s => s.id === sub.id ? {...s, psuId: e.target.value} : s)}))}
                      >
                        {psus.map(p => <option key={p.id} value={p.id}>{p.brand} {p.name} ({p.voltage}V)</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-black uppercase">Lighting Controller</label>
                      <select 
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                        value={sub.controllerId}
                        onChange={e => setProject(p => ({...p, subsystems: p.subsystems.map(s => s.id === sub.id ? {...s, controllerId: e.target.value} : s)}))}
                      >
                        {DEFAULT_CONTROLLERS.map(c => <option key={c.id} value={c.id}>{c.brand} {c.name} ({c.ports} Ports)</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-auto bg-slate-800/50 p-4 rounded-[1.5rem] border border-slate-700/50 flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl"><Shield size={16}/></div>
                  <div className="flex-1">
                     <p className="text-[9px] text-slate-500 font-black uppercase tracking-tight">System Safety Status</p>
                     <p className="text-[10px] text-amber-200 font-bold">Calculation Required for Load Check</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSetup;
