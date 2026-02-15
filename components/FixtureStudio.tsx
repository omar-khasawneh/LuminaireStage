
import React, { useMemo } from 'react';
import { Project, FixtureDefinition, LEDStrip, MountingStructure } from '../types';
import { Plus, Trash2, Box, Info, List, DollarSign, Zap } from 'lucide-react';

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
      name: `Custom Fixture ${project.fixtureDefinitions.length + 1}`,
      stripId: strips[0].id,
      length: 1.0,
      mountingId: mountings[0].id,
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
      // Also remove any zones that used this fixture
      zones: prev.zones.filter(z => z.fixtureDefinitionId !== id)
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Box className="text-indigo-400" /> Fixture Lab
          </h2>
          <p className="text-slate-500 text-sm">Design your own hardware units with custom BOMs.</p>
        </div>
        <button 
          onClick={addFixture}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} /> New Fixture Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {project.fixtureDefinitions.map(fix => {
          const strip = strips.find(s => s.id === fix.stripId);
          const mounting = mountings.find(m => m.id === fix.mountingId);
          
          const totalWatts = (strip?.wattsPerMeter || 0) * fix.length;
          const totalPixels = (strip?.ledsPerMeter || 0) * fix.length;
          const bomCost = ((strip?.pricePerMeter || 0) * fix.length) + ((mounting?.pricePerMeter || 0) * fix.length);

          return (
            <div key={fix.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-indigo-500/50 transition-all shadow-xl flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <input 
                  className="bg-transparent text-lg font-bold border-b border-transparent hover:border-slate-600 focus:border-indigo-500 outline-none w-full mr-4 transition-colors"
                  value={fix.name}
                  onChange={e => updateFixture(fix.id, { name: e.target.value })}
                />
                <button onClick={() => removeFixture(fix.id)} className="text-slate-500 hover:text-red-400 p-1"><Trash2 size={18} /></button>
              </div>

              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Internal LED Strip</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                      value={fix.stripId}
                      onChange={e => updateFixture(fix.id, { stripId: e.target.value })}
                    >
                      {strips.map(s => <option key={s.id} value={s.id}>{s.name} ({s.ipRating})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Length (m)</label>
                    <input 
                      type="number"
                      step="0.1"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                      value={fix.length}
                      onChange={e => updateFixture(fix.id, { length: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Mounting Structure</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    value={fix.mountingId}
                    onChange={e => updateFixture(fix.id, { mountingId: e.target.value })}
                  >
                    {mountings.map(m => <option key={m.id} value={m.id}>{m.name} ({m.material})</option>)}
                  </select>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Estimated Peak</span>
                    <span className="text-sm font-black text-indigo-400 flex items-center gap-1"><Zap size={14}/>{totalWatts.toFixed(1)}W</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Pixels Count</span>
                    <span className="text-sm font-black text-white">{Math.floor(totalPixels)} px</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Weight</span>
                    <span className="text-sm font-black text-slate-300">{( (mounting?.weightPerMeter || 0) * fix.length ).toFixed(2)} kg</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">BOM Cost</span>
                    <span className="text-sm font-black text-emerald-400 flex items-center gap-1"><DollarSign size={14}/>{bomCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                <Info size={12}/>
                Designed for {project.venueType} use-cases.
              </div>
            </div>
          );
        })}

        {project.fixtureDefinitions.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-900/30">
            <Box className="mx-auto text-slate-700 mb-4 opacity-20" size={64} />
            <p className="text-slate-500 font-medium italic text-lg">Your design library is empty.</p>
            <p className="text-slate-600 text-sm mt-1">Start defining custom fixtures to use in your stage layout.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixtureStudio;
