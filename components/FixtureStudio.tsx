
import React from 'react';
import { Project, FixtureShape, LEDStrip, Mounting } from '../types';
import { Plus, Trash2, Box, Square, Triangle, Circle, Ruler } from 'lucide-react';

interface Props {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  strips: LEDStrip[];
  mountings: Mounting[];
}

const FixtureStudio: React.FC<Props> = ({ project, setProject, strips, mountings }) => {
  const isOutdoor = project.venueType === 'Outdoor';

  const addFixtureDef = () => {
    const newFix: FixtureShape = {
      id: crypto.randomUUID(),
      name: `Custom Shape ${project.fixtures.length + 1}`,
      shapeType: 'Rectangle',
      stripId: strips[0].id,
      totalLength: 2,
      mountingId: mountings[0].id
    };
    setProject(p => ({ ...p, fixtures: [...p.fixtures, newFix] }));
  };

  const updateFixtureDef = (id: string, updates: Partial<FixtureShape>) => {
    setProject(p => ({
      ...p,
      fixtures: p.fixtures.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const removeFixtureDef = (id: string) => {
    setProject(p => ({
      ...p,
      fixtures: p.fixtures.filter(f => f.id !== id),
      zones: p.zones.filter(z => z.fixtureId !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Fixture Studio</h2>
          <p className="text-slate-500 text-sm">Design custom geometries and mounting profiles.</p>
        </div>
        <button 
          onClick={addFixtureDef}
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Create Fixture Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.fixtures.map(fix => (
          <div key={fix.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-indigo-500/50 transition-all">
            <div className="flex justify-between items-center mb-4">
              <input 
                className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-indigo-500 font-bold outline-none w-full mr-4"
                value={fix.name}
                onChange={e => updateFixtureDef(fix.id, { name: e.target.value })}
              />
              <button onClick={() => removeFixtureDef(fix.id)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={18}/></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Geometry</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs"
                  value={fix.shapeType}
                  onChange={e => updateFixtureDef(fix.id, { shapeType: e.target.value as any })}
                >
                  <option>Rectangle</option><option>Triangle</option><option>Circle</option><option>Custom</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Strip Model</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs"
                  value={fix.stripId}
                  onChange={e => updateFixtureDef(fix.id, { stripId: e.target.value })}
                >
                  {strips.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Mounting Profile</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs"
                  value={fix.mountingId}
                  onChange={e => updateFixtureDef(fix.id, { mountingId: e.target.value })}
                >
                  {mountings.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1"><Ruler size={10}/> Length (m)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs"
                  value={fix.totalLength}
                  onChange={e => updateFixtureDef(fix.id, { totalLength: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl flex items-center justify-center border border-slate-700/50">
              {fix.shapeType === 'Rectangle' && <Square className="text-indigo-400 opacity-40" size={48} />}
              {fix.shapeType === 'Triangle' && <Triangle className="text-indigo-400 opacity-40" size={48} />}
              {fix.shapeType === 'Circle' && <Circle className="text-indigo-400 opacity-40" size={48} />}
              {fix.shapeType === 'Custom' && <Box className="text-indigo-400 opacity-40" size={48} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixtureStudio;
