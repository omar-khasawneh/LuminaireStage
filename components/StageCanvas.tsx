
import React, { useState, useRef, useMemo } from 'react';
import { Project, Zone, LEDStrip, PSU, Subsystem, Controller, FixtureDefinition, MountingStructure, Cable, Fuse } from '../types';
import { Move, Zap, Box, Cpu, MousePointer2, Trash2, Plus, Ruler, Link2 } from 'lucide-react';

interface Props {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  strips: LEDStrip[];
}

const StageCanvas: React.FC<Props> = ({ project, setProject, strips }) => {
  const [selectedElement, setSelectedElement] = useState<{ type: 'zone' | 'subsystem', id: string } | null>(null);
  const containerRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (type: 'zone' | 'subsystem', id: string) => {
    setSelectedElement({ type, id });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !containerRef.current) return;
    const svg = containerRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    setProject(prev => {
      if (selectedElement.type === 'zone') return { ...prev, zones: prev.zones.map(z => z.id === selectedElement.id ? { ...z, x: svgP.x, y: svgP.y } : z) };
      return { ...prev, subsystems: prev.subsystems.map(s => s.id === selectedElement.id ? { ...s, x: svgP.x, y: svgP.y } : s) };
    });
  };

  const addHub = () => {
    const newHub: Subsystem = {
      id: crypto.randomUUID(),
      name: `Hub ${project.subsystems.length + 1}`,
      psuId: '',
      controllerId: '',
      x: 100,
      y: 100
    };
    setProject(p => ({ ...p, subsystems: [...p.subsystems, newHub] }));
  };

  const addFixtureInstance = () => {
    if (project.fixtureDefinitions.length === 0) return alert("Define a fixture in the Studio first!");
    const newZone: Zone = {
      id: crypto.randomUUID(),
      name: `Unit ${project.zones.length + 1}`,
      fixtureDefinitionId: project.fixtureDefinitions[0].id,
      subsystemId: project.subsystems[0]?.id || '',
      wireLength: 5,
      wireGauge: 18,
      fuseId: '',
      x: 500,
      y: 300,
      rotation: 0
    };
    setProject(p => ({ ...p, zones: [...p.zones, newZone] }));
  };

  const selectedZone = useMemo(() => {
    if (selectedElement?.type === 'zone') return project.zones.find(z => z.id === selectedElement.id);
    return null;
  }, [selectedElement, project.zones]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-[2.5rem] border border-slate-700 overflow-hidden relative">
      <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <h3 className="font-black flex items-center gap-2 text-indigo-400 uppercase tracking-widest text-sm">
            <Move size={18} /> Physical Placement
          </h3>
          <div className="flex gap-2">
            <button onClick={addHub} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
              <Plus size={14} /> Add Hub
            </button>
            <button onClick={addFixtureInstance} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
              <Plus size={14} /> Place Fixture
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:30px_30px] overflow-hidden">
        <svg 
          ref={containerRef}
          className="w-full h-full cursor-crosshair touch-none min-h-[500px]"
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          viewBox="0 0 1000 600"
        >
          {/* Cables / Connections */}
          {project.zones.map(zone => {
            const sub = project.subsystems.find(s => s.id === zone.subsystemId);
            if (!sub) return null;
            return <line key={`cable-${zone.id}`} x1={sub.x} y1={sub.y} x2={zone.x} y2={zone.y} className={`stroke-2 transition-all ${selectedElement?.id === zone.id ? 'stroke-indigo-400 stroke-[3]' : 'stroke-amber-500/20'}`} strokeDasharray="5 5" />;
          })}

          {/* Render Elements */}
          {project.subsystems.map(sub => (
            <g key={sub.id} transform={`translate(${sub.x}, ${sub.y})`} onMouseDown={() => handleMouseDown('subsystem', sub.id)} className="cursor-move">
              <rect x="-30" y="-30" width="60" height="60" rx="12" className={`transition-all ${selectedElement?.id === sub.id ? 'fill-indigo-600 stroke-white' : 'fill-slate-800 stroke-indigo-500'} stroke-2 shadow-2xl`} />
              <Cpu size={20} x="-10" y="-10" className={selectedElement?.id === sub.id ? 'text-white' : 'text-indigo-400'} />
              <text y="45" textAnchor="middle" className="text-[10px] font-black fill-slate-500 uppercase tracking-widest">{sub.name}</text>
            </g>
          ))}

          {project.zones.map(zone => {
            const fix = project.fixtureDefinitions.find(f => f.id === zone.fixtureDefinitionId);
            if (!fix) return null;
            return (
              <g key={zone.id} transform={`translate(${zone.x}, ${zone.y}) rotate(${zone.rotation})`} onMouseDown={() => handleMouseDown('zone', zone.id)} className="cursor-move">
                <rect x={-fix.length * 20} y="-6" width={fix.length * 40} height="12" rx="4" className={`transition-all ${selectedElement?.id === zone.id ? 'fill-indigo-500 stroke-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'fill-slate-700 stroke-slate-500'} stroke-2`} />
                <text y="-14" textAnchor="middle" className={`text-[9px] font-black uppercase tracking-widest ${selectedElement?.id === zone.id ? 'fill-indigo-300' : 'fill-slate-500'}`}>{zone.name}</text>
              </g>
            );
          })}
        </svg>

        {/* Selected Zone Inspector */}
        {selectedZone && (
          <div className="absolute top-6 right-6 w-72 bg-slate-800/90 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-right-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Box size={14}/> Unit Config</h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Connection Hub</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-xs text-white"
                  value={selectedZone.subsystemId}
                  onChange={e => setProject(p => ({ ...p, zones: p.zones.map(z => z.id === selectedZone.id ? { ...z, subsystemId: e.target.value } : z) }))}
                >
                  <option value="">(Not Connected)</option>
                  {project.subsystems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block flex items-center gap-1"><Ruler size={10}/> Cable Length (m)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-xs text-white font-mono"
                  value={selectedZone.wireLength}
                  onChange={e => setProject(p => ({ ...p, zones: p.zones.map(z => z.id === selectedZone.id ? { ...z, wireLength: parseFloat(e.target.value) || 0 } : z) }))}
                />
              </div>
              <div className="pt-4 border-t border-slate-700">
                <button 
                  onClick={() => {
                    setProject(p => ({ ...p, zones: p.zones.filter(z => z.id !== selectedZone.id) }));
                    setSelectedElement(null);
                  }}
                  className="w-full bg-red-900/30 text-red-400 hover:bg-red-900/50 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Remove Fixture
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StageCanvas;
