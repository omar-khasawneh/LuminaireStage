
import React from 'react';
import { Project, Subsystem, Zone, LEDStrip, PSU, Controller } from '../types';
import { DEFAULT_CONTROLLERS, DEFAULT_FUSES } from '../constants';
import { Plus, Trash2, Settings, Layers, Box } from 'lucide-react';

interface Props {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  strips: LEDStrip[];
  psus: PSU[];
}

const ProjectSetup: React.FC<Props> = ({ project, setProject, strips, psus }) => {
  const isOutdoor = project.venueType === 'Outdoor';

  const addSubsystem = () => {
    const newSub: Subsystem = {
      id: crypto.randomUUID(),
      name: `Subsystem ${project.subsystems.length + 1}`,
      psuId: psus[0].id,
      controllerId: DEFAULT_CONTROLLERS[0].id,
      x: 300,
      y: 100 + (project.subsystems.length * 100)
    };
    setProject(p => ({ ...p, subsystems: [...p.subsystems, newSub] }));
  };

  const addFixtureToSub = (subId: string) => {
    if (project.fixtures.length === 0) return alert("Please define a Fixture Type in the Studio tab first.");
    const newZone: Zone = {
      id: crypto.randomUUID(),
      name: `Fxt ${project.zones.length + 1}`,
      fixtureId: project.fixtures[0].id,
      wireGauge: 14,
      wireLength: 5,
      x: 500,
      y: 150 + (project.zones.length * 40),
      rotation: 0,
      subsystemId: subId,
      fuseId: DEFAULT_FUSES[0].id
    };
    setProject(p => ({ ...p, zones: [...p.zones, newZone] }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
            <Settings className="text-indigo-400" size={18} />
            <h2 className="text-lg font-bold">Project Core</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase">Venue Filter</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-1 focus:ring-indigo-500"
                value={project.venueType}
                onChange={e => setProject({...project, venueType: e.target.value as any})}
              >
                <option>Indoor</option><option>Outdoor</option><option>Club</option><option>Arena</option>
              </select>
            </div>
            <button 
              onClick={addSubsystem}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Plus size={18} /> New Control Hub
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        {project.subsystems.map(sub => (
          <div key={sub.id} className="bg-slate-800/50 rounded-[2.5rem] border border-slate-700 p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-700 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400"><Layers size={24}/></div>
                <input 
                  className="bg-transparent text-2xl font-black outline-none border-b border-transparent hover:border-slate-600 focus:border-indigo-500 transition-all"
                  value={sub.name}
                  onChange={e => setProject(p => ({...p, subsystems: p.subsystems.map(s => s.id === sub.id ? {...s, name: e.target.value} : s)}))}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => addFixtureToSub(sub.id)} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Box size={14}/> Install Fixture
                </button>
                <button onClick={() => setProject(p => ({...p, subsystems: p.subsystems.filter(s => s.id !== sub.id)}))} className="text-slate-600 hover:text-red-400 p-2"><Trash2 size={20}/></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {project.zones.filter(z => z.subsystemId === sub.id).map(zone => (
                  <div key={zone.id} className="bg-slate-900/50 border border-slate-700/50 px-5 py-4 rounded-3xl text-xs flex items-center justify-between group">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-white text-sm">{zone.name}</span>
                      <select 
                        className="bg-transparent text-[10px] text-indigo-400 font-bold outline-none cursor-pointer"
                        value={zone.fixtureId}
                        onChange={e => setProject(p => ({...p, zones: p.zones.map(z => z.id === zone.id ? {...z, fixtureId: e.target.value} : z)}))}
                      >
                        {project.fixtures.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="text-right">
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Wiring</p>
                          <p className="text-slate-300 font-mono">{zone.wireGauge}AWG / {zone.wireLength}m</p>
                       </div>
                       <button onClick={() => setProject(p => ({...p, zones: p.zones.filter(z => z.id !== zone.id)}))} className="text-slate-700 group-hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl border border-slate-700/50 h-fit">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Hardware Profile</h4>
                 <div className="space-y-3">
                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-slate-500 font-bold">Power Supply</span>
                     <select className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white" value={sub.psuId} onChange={e => setProject(p => ({...p, subsystems: p.subsystems.map(s => s.id === sub.id ? {...s, psuId: e.target.value} : s)}))}>
                       {psus.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-slate-500 font-bold">Controller</span>
                     <select className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white" value={sub.controllerId} onChange={e => setProject(p => ({...p, subsystems: p.subsystems.map(s => s.id === sub.id ? {...s, controllerId: e.target.value} : s)}))}>
                       {DEFAULT_CONTROLLERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
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
