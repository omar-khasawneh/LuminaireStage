
import React from 'react';
import { Project, Subsystem, Zone, LEDStrip, PSU, Controller } from '../types';
import { DEFAULT_CONTROLLERS, DEFAULT_SWITCHES } from '../constants';
import { Plus, Trash2, Settings, ShieldAlert, Cpu, Layers } from 'lucide-react';

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

  const addFixture = (subId: string) => {
    const newZone: Zone = {
      id: crypto.randomUUID(),
      name: `Fxt ${project.zones.length + 1}`,
      stripId: strips[0].id,
      length: 5,
      wireGauge: 18,
      wireLength: 3,
      x: 500,
      y: 150 + (project.zones.length * 30),
      rotation: 0,
      subsystemId: subId
    };
    setProject(p => ({ ...p, zones: [...p.zones, newZone] }));
  };

  const removeSubsystem = (id: string) => {
    setProject(p => ({
      ...p,
      subsystems: p.subsystems.filter(s => s.id !== id),
      zones: p.zones.filter(z => z.subsystemId !== id)
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
            <Settings className="text-indigo-400" />
            <h2 className="text-lg font-bold">Project Core</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase">Venue</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm mt-1"
                value={project.venueType}
                onChange={e => setProject({...project, venueType: e.target.value as any})}
              >
                <option>Indoor</option><option>Outdoor</option><option>Club</option><option>Arena</option>
              </select>
            </div>
            <button 
              onClick={addSubsystem}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Plus size={18} /> New Subsystem
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        {project.subsystems.map(sub => (
          <div key={sub.id} className="bg-slate-800/50 rounded-3xl border border-slate-700 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Layers size={20}/></div>
                <input 
                  className="bg-transparent text-xl font-black outline-none border-b border-transparent hover:border-slate-600 focus:border-indigo-500"
                  value={sub.name}
                  onChange={e => setProject(p => ({...p, subsystems: p.subsystems.map(s => s.id === sub.id ? {...s, name: e.target.value} : s)}))}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => addFixture(sub.id)} className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Plus size={14}/> Add Fixture
                </button>
                <button onClick={() => removeSubsystem(sub.id)} className="text-slate-500 hover:text-red-400 p-2"><Trash2 size={18}/></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"><Cpu size={12}/> Hardware Hub</h4>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    className="bg-slate-800 border border-slate-700 rounded p-1.5 text-xs"
                    value={sub.psuId}
                    onChange={e => setProject(p => ({...p, subsystems: p.subsystems.map(s => s.id === sub.id ? {...s, psuId: e.target.value} : s)}))}
                  >
                    {psus.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <select 
                    className="bg-slate-800 border border-slate-700 rounded p-1.5 text-xs"
                    value={sub.controllerId}
                    onChange={e => setProject(p => ({...p, subsystems: p.subsystems.map(s => s.id === sub.id ? {...s, controllerId: e.target.value} : s)}))}
                  >
                    {DEFAULT_CONTROLLERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.zones.filter(z => z.subsystemId === sub.id).map(zone => (
                  <div key={zone.id} className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-xs flex items-center gap-3">
                    <span className="font-bold">{zone.name}</span>
                    <span className="text-slate-500">{zone.length}m</span>
                    <button onClick={() => setProject(p => ({...p, zones: p.zones.filter(z => z.id !== zone.id)}))} className="text-slate-600 hover:text-red-400"><Trash2 size={12}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {project.subsystems.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
            <p className="text-slate-600 italic">No subsystems defined. Start by creating a power/control hub.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSetup;
