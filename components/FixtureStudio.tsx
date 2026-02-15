
import React from 'react';
import { Project, FixtureDefinition, LEDStrip, MountingStructure } from '../types';
import { Plus, Trash2, Box, Info, Zap, DollarSign, Layers, Square, Circle, Triangle, Minus } from 'lucide-react';

interface Props {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  strips: LEDStrip[];
  mountings: MountingStructure[];
}

const FixtureStudio: React.FC<Props> = ({ project, setProject, strips, mountings }) => {
  const addFixture = () => {
    const newFix: FixtureDefinition = {
      id: crypto.randomUUID(),
      name: `New Fixture ${project.fixtureDefinitions.length + 1}`,
      stripId: strips[0]?.id || '',
      length: 1.0,
      mountingId: mountings[0]?.id || '',
      shape: 'Line'
    };
    setProject(prev => ({ ...prev, fixtureDefinitions: [...prev.fixtureDefinitions, newFix] }));
  };

  const updateFixture = (id: string, updates: Partial<FixtureDefinition>) => {
    setProject(prev => ({
      ...prev,
      fixtureDefinitions: prev.fixtureDefinitions.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const removeFixture = (id: string) => {
    setProject(prev => ({
      ...prev,
      fixtureDefinitions: prev.fixtureDefinitions.filter(f => f.id !== id),
      zones: prev.zones.filter(z => z.fixtureDefinitionId !== id)
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Box className="text-indigo-400" /> Fixture Lab
          </h2>
          <p className="text-slate-500 text-sm">Convert strips and mounts into deployable lighting units.</p>
        </div>
        <button 
          onClick={addFixture}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-indigo-500/20"
        >
          <Plus size={20} /> Create Fixture Unit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {project.fixtureDefinitions.map(fix => {
          const strip = strips.find(s => s.id === fix.stripId);
          const mounting = mountings.find(m => m.id === fix.mountingId);
          const totalWatts = (strip?.wattsPerMeter || 0) * fix.length;
          const bomCost = ((strip?.pricePerMeter || 0) * fix.length) + ((mounting?.pricePerMeter || 0) * fix.length);

          return (
            <div key={fix.id} className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 hover:border-indigo-500/50 transition-all shadow-2xl flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <input 
                  className="bg-transparent text-xl font-black text-white outline-none border-b border-transparent hover:border-slate-600 focus:border-indigo-500 w-full mr-4"
                  value={fix.name}
                  onChange={e => updateFixture(fix.id, { name: e.target.value })}
                />
                <button onClick={() => removeFixture(fix.id)} className="text-slate-500 hover:text-red-400 p-2"><Trash2 size={20} /></button>
              </div>

              <div className="space-y-6 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Geometry</label>
                    <div className="flex gap-1">
                      {[
                        { id: 'Line', icon: Minus },
                        { id: 'Rectangle', icon: Square },
                        { id: 'Circle', icon: Circle },
                        { id: 'Triangle', icon: Triangle },
                      ].map(shape => (
                        <button
                          key={shape.id}
                          onClick={() => updateFixture(fix.id, { shape: shape.id as any })}
                          className={`p-2 rounded-xl transition-all ${fix.shape === shape.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-slate-300'}`}
                        >
                          <shape.icon size={16} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Strip Length (m)</label>
                    <input 
                      type="number" step="0.1"
                      className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-sm text-white font-mono"
                      value={fix.length}
                      onChange={e => updateFixture(fix.id, { length: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Component: LED Strip</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs text-white"
                      value={fix.stripId}
                      onChange={e => updateFixture(fix.id, { stripId: e.target.value })}
                    >
                      {strips.map(s => <option key={s.id} value={s.id}>{s.name} ({s.voltage}V)</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Component: Mounting</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs text-white"
                      value={fix.mountingId}
                      onChange={e => updateFixture(fix.id, { mountingId: e.target.value })}
                    >
                      {mountings.map(m => <option key={m.id} value={m.id}>{m.name} ({m.material})</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-700/50 grid grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Load Req.</span>
                    <span className="text-lg font-black text-indigo-400 flex items-center gap-1"><Zap size={14}/>{totalWatts.toFixed(1)}W</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Pixels</span>
                    <span className="text-lg font-black text-white">{Math.floor((strip?.ledsPerMeter || 0) * fix.length)}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">BOM Total</span>
                    <span className="text-xl font-black text-emerald-400 flex items-center gap-1"><DollarSign size={18}/>{bomCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {project.fixtureDefinitions.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-800 rounded-[3rem] bg-slate-900/30">
            <Layers className="mx-auto text-slate-700 mb-4 opacity-20" size={80} />
            <p className="text-slate-500 font-black uppercase tracking-widest text-lg">Your lab is empty</p>
            <p className="text-slate-600 text-sm mt-2">Start combining inventory items into deployable fixtures.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixtureStudio;
