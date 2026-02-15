
import React, { useState, useRef, useMemo } from 'react';
import { Project, Zone, LEDStrip, PSU, Subsystem, Controller, EthernetSwitch, FixtureDefinition, MountingStructure, Cable, Fuse } from '../types';
import { WIRE_RESISTANCE } from '../constants';
import { Move, Zap, Network, Box, Cpu, MousePointer2, Trash2, Info, DollarSign, Ruler, AlertCircle } from 'lucide-react';

interface Props {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  strips: LEDStrip[];
  mountings: MountingStructure[];
  cables: Cable[];
  fuses: Fuse[];
}

const StageCanvas: React.FC<Props> = ({ project, setProject, strips, mountings, cables, fuses }) => {
  const [selectedElement, setSelectedElement] = useState<{ type: 'zone' | 'subsystem' | 'switch', id: string } | null>(null);
  const containerRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (type: 'zone' | 'subsystem' | 'switch', id: string) => {
    setSelectedElement({ type, id });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !containerRef.current) return;
    
    const svg = containerRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    setProject(prev => {
      if (selectedElement.type === 'zone') {
        return { ...prev, zones: prev.zones.map(z => z.id === selectedElement.id ? { ...z, x: svgP.x, y: svgP.y } : z) };
      } else if (selectedElement.type === 'subsystem') {
        return { ...prev, subsystems: prev.subsystems.map(s => s.id === selectedElement.id ? { ...s, x: svgP.x, y: svgP.y } : s) };
      } else {
        return { ...prev, ethernetSwitches: prev.ethernetSwitches.map(sw => sw.id === selectedElement.id ? { ...sw, x: svgP.x, y: svgP.y } : sw) };
      }
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Selection Detail Logic
  const selectedInfo = useMemo(() => {
    if (!selectedElement || selectedElement.type !== 'zone') return null;
    const zone = project.zones.find(z => z.id === selectedElement.id);
    if (!zone) return null;
    const fixtureDef = project.fixtureDefinitions.find(f => f.id === zone.fixtureDefinitionId);
    if (!fixtureDef) return null;
    const strip = strips.find(s => s.id === fixtureDef.stripId);
    const mounting = mountings.find(m => m.id === fixtureDef.mountingId);
    const cable = cables.find(c => c.gauge === zone.wireGauge);

    const power = (strip?.wattsPerMeter || 0) * fixtureDef.length;
    const current = power / (strip?.voltage || 12);
    
    // Voltage Drop Calculation
    const resistance = (WIRE_RESISTANCE[zone.wireGauge] || 0) * zone.wireLength * 2;
    const vDrop = current * resistance;
    const vDropPercent = (vDrop / (strip?.voltage || 12)) * 100;

    // Costs
    const fixtureCost = ((strip?.pricePerMeter || 0) * fixtureDef.length) + ((mounting?.pricePerMeter || 0) * fixtureDef.length);
    const cableCost = (cable?.pricePerMeter || 0) * zone.wireLength;
    const totalCost = fixtureCost + cableCost;

    return { zone, fixtureDef, power, current, vDropPercent, totalCost, fixtureCost, cableCost };
  }, [selectedElement, project, strips, mountings, cables]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden relative">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <h3 className="font-bold flex items-center gap-2 text-indigo-400">
            <Move size={18} /> Interactive Stage Plan
          </h3>
          <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded font-black tracking-widest uppercase">Select elements to see engineering data</span>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setSelectedElement(null)} className={`p-2 rounded-xl transition-all ${!selectedElement ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-700 text-slate-400'}`}><MousePointer2 size={18}/></button>
           {selectedElement && (
             <button 
               onClick={() => {
                 setProject(p => ({
                   ...p, 
                   zones: selectedElement.type === 'zone' ? p.zones.filter(z => z.id !== selectedElement.id) : p.zones,
                   subsystems: selectedElement.type === 'subsystem' ? p.subsystems.filter(s => s.id !== selectedElement.id) : p.subsystems,
                   ethernetSwitches: selectedElement.type === 'switch' ? p.ethernetSwitches.filter(sw => sw.id !== selectedElement.id) : p.ethernetSwitches
                 }));
                 setSelectedElement(null);
               }} 
               className="p-2 hover:bg-red-900/30 rounded-xl text-red-400 transition-colors"
             >
              <Trash2 size={18}/>
             </button>
           )}
        </div>
      </div>

      <div className="relative flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:25px_25px] overflow-hidden">
        <svg 
          ref={containerRef}
          className="w-full h-full cursor-crosshair touch-none min-h-[500px]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          viewBox="0 0 1000 600"
        >
          {/* Signal Wiring (Switch to Controller) */}
          {project.ethernetSwitches.map(sw => (
            project.subsystems.map(sub => (
              <line 
                key={`sig-${sw.id}-${sub.id}`}
                x1={sw.x} y1={sw.y} x2={sub.x} y2={sub.y}
                className="stroke-cyan-500/10 stroke-1"
                strokeDasharray="5 5"
              />
            ))
          ))}

          {/* Subsystem Wiring (Controller to Zones) */}
          {project.zones.map(zone => {
            const sub = project.subsystems.find(s => s.id === zone.subsystemId);
            if (!sub) return null;
            return (
              <line 
                key={`pwr-${zone.id}`}
                x1={sub.x} y1={sub.y} x2={zone.x} y2={zone.y}
                className={`stroke-2 transition-colors ${selectedElement?.id === zone.id ? 'stroke-indigo-400' : 'stroke-amber-500/10'}`}
              />
            );
          })}

          {/* Ethernet Switches */}
          {project.ethernetSwitches.map(sw => (
            <g key={sw.id} transform={`translate(${sw.x}, ${sw.y})`} onMouseDown={() => handleMouseDown('switch', sw.id)} className="cursor-move group">
              <rect x="-25" y="-15" width="50" height="30" rx="6" className={`transition-all ${selectedElement?.id === sw.id ? 'fill-cyan-600 stroke-white' : 'fill-slate-800 stroke-cyan-500'} stroke-2 shadow-2xl`} />
              <Network size={16} x="-8" y="-8" className={selectedElement?.id === sw.id ? 'text-white' : 'text-cyan-400'} />
              <text y="28" textAnchor="middle" className="text-[8px] fill-slate-500 font-black uppercase tracking-widest group-hover:fill-cyan-400">{sw.name}</text>
            </g>
          ))}

          {/* Subsystems (PSU + Controller Hub) */}
          {project.subsystems.map(sub => (
            <g key={sub.id} transform={`translate(${sub.x}, ${sub.y})`} onMouseDown={() => handleMouseDown('subsystem', sub.id)} className="cursor-move group">
              <rect x="-35" y="-35" width="70" height="70" rx="12" className={`transition-all ${selectedElement?.id === sub.id ? 'fill-indigo-600 stroke-white' : 'fill-slate-800 stroke-indigo-500'} stroke-2 shadow-2xl`} />
              <circle cx="0" cy="0" r="28" className="fill-slate-900/40 stroke-white/5 stroke-1" />
              <Cpu size={20} x="-10" y="-14" className={selectedElement?.id === sub.id ? 'text-white' : 'text-indigo-400'} />
              <Zap size={12} x="-6" y="8" className={selectedElement?.id === sub.id ? 'text-indigo-200' : 'text-amber-400'} />
              <text y="50" textAnchor="middle" className="text-[10px] fill-slate-400 font-bold uppercase tracking-widest group-hover:fill-indigo-400">{sub.name}</text>
            </g>
          ))}

          {/* Fixtures (Defined Custom Units) */}
          {project.zones.map(zone => {
            const fixtureDef = project.fixtureDefinitions.find(f => f.id === zone.fixtureDefinitionId);
            if (!fixtureDef) return null;
            const strip = strips.find(s => s.id === fixtureDef.stripId);
            const isSelected = selectedElement?.id === zone.id;
            
            return (
              <g key={zone.id} transform={`translate(${zone.x}, ${zone.y}) rotate(${zone.rotation || 0})`} onMouseDown={() => handleMouseDown('zone', zone.id)} className="cursor-move group">
                {/* Physical Shape Visualizer */}
                <rect 
                  x={-fixtureDef.length * 20} y="-6" 
                  width={fixtureDef.length * 40} height="12" 
                  rx="3" 
                  className={`transition-all ${isSelected ? 'fill-indigo-500 stroke-white stroke-2 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'fill-slate-800 stroke-slate-600 group-hover:stroke-indigo-400'}`} 
                />
                
                {/* Glow for status */}
                <rect 
                  x={-fixtureDef.length * 20} y="-2" 
                  width={fixtureDef.length * 40} height="4" 
                  className={`fill-indigo-400/30 blur-[2px] ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} 
                />

                <text y="-14" textAnchor="middle" className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'fill-indigo-300' : 'fill-slate-500'}`}>{zone.name}</text>
                <text y="22" textAnchor="middle" className="text-[7px] fill-slate-400 group-hover:fill-slate-200">{fixtureDef.name}</text>
              </g>
            );
          })}
        </svg>

        {/* Selected Fixture Info Overlay */}
        {selectedInfo && (
          <div className="absolute top-6 right-6 w-80 bg-slate-800/90 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl animate-in fade-in slide-in-from-right-4 pointer-events-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl shadow-inner"><Box size={24}/></div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight leading-none">{selectedInfo.zone.name}</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-bold">Profile: {selectedInfo.fixtureDef.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-700/50">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Total Power</span>
                  <span className="text-sm font-black text-white">{selectedInfo.power.toFixed(1)}W</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-700/50">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Peak Current</span>
                  <span className="text-sm font-black text-amber-400">{selectedInfo.current.toFixed(2)}A</span>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border transition-colors flex items-center justify-between ${selectedInfo.vDropPercent > 4 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                <div>
                   <span className="text-[9px] font-black uppercase text-slate-500 block">Voltage Drop</span>
                   <span className={`text-lg font-black ${selectedInfo.vDropPercent > 4 ? 'text-red-400' : 'text-emerald-400'}`}>{selectedInfo.vDropPercent.toFixed(1)}%</span>
                </div>
                {selectedInfo.vDropPercent > 4 ? <AlertCircle className="text-red-400" size={20}/> : <Info className="text-emerald-400" size={20}/>}
              </div>

              <div className="pt-4 border-t border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold uppercase">Fixture BOM</span>
                  <span className="text-white font-mono">${selectedInfo.fixtureCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold uppercase">Wiring Setup</span>
                  <span className="text-white font-mono">${selectedInfo.cableCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-black uppercase text-slate-400">Projected Unit Cost</span>
                  <span className="text-xl font-black text-emerald-400">${selectedInfo.totalCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-indigo-500/5 p-3 rounded-2xl border border-indigo-500/10 flex items-center gap-2">
                <Ruler size={14} className="text-indigo-400"/>
                <p className="text-[9px] text-indigo-200 font-bold uppercase">Cable: {selectedInfo.zone.wireLength}m @ {selectedInfo.zone.wireGauge} AWG</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StageCanvas;
