
import React, { useState, useRef, useMemo } from 'react';
import { Project, Zone, LEDStrip, PSU, Subsystem, Controller, EthernetSwitch, FixtureShape, Cable, Mounting } from '../types';
import { Move, Zap, Network, Box, Cpu, MousePointer2, Trash2, DollarSign, Info } from 'lucide-react';

interface Props {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  strips: LEDStrip[];
  cables: Cable[];
  mountings: Mounting[];
}

const StageCanvas: React.FC<Props> = ({ project, setProject, strips, cables, mountings }) => {
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
    pt.x = e.clientX; pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    setProject(prev => {
      if (selectedElement.type === 'zone') return { ...prev, zones: prev.zones.map(z => z.id === selectedElement.id ? { ...z, x: svgP.x, y: svgP.y } : z) };
      if (selectedElement.type === 'subsystem') return { ...prev, subsystems: prev.subsystems.map(s => s.id === selectedElement.id ? { ...s, x: svgP.x, y: svgP.y } : s) };
      return { ...prev, ethernetSwitches: prev.ethernetSwitches.map(sw => sw.id === selectedElement.id ? { ...sw, x: svgP.x, y: svgP.y } : sw) };
    });
  };

  const selectedZoneData = useMemo(() => {
    if (selectedElement?.type !== 'zone') return null;
    const zone = project.zones.find(z => z.id === selectedElement.id);
    if (!zone) return null;
    const fixtureDef = project.fixtures.find(f => f.id === zone.fixtureId);
    if (!fixtureDef) return null;
    const strip = strips.find(s => s.id === fixtureDef.stripId);
    const mounting = mountings.find(m => m.id === fixtureDef.mountingId);
    const cable = cables.find(c => c.gauge === zone.wireGauge);

    const stripCost = (strip?.pricePerMeter || 0) * fixtureDef.totalLength;
    const mountCost = (mounting?.pricePerMeter || 0) * fixtureDef.totalLength;
    const cableCost = (cable?.pricePerMeter || 0) * zone.wireLength;
    
    return { 
      name: zone.name, 
      fixtureName: fixtureDef.name, 
      totalCost: stripCost + mountCost + cableCost,
      breakdown: { strip: stripCost, mount: mountCost, cable: cableCost }
    };
  }, [selectedElement, project, strips, cables, mountings]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden relative">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-bold flex items-center gap-2 text-indigo-400"><Move size={18} /> Arena View</h3>
          <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded font-black uppercase tracking-widest">Physics-Correct Placement</span>
        </div>
      </div>

      <div className="relative flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:30px_30px]">
        <svg ref={containerRef} className="w-full h-full cursor-crosshair touch-none" onMouseMove={handleMouseMove} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)} viewBox="0 0 1000 600">
          {/* Top-down visual connections */}
          {project.ethernetSwitches.map(sw => project.subsystems.map(sub => (
            <line key={`sig-${sw.id}-${sub.id}`} x1={sw.x} y1={sw.y} x2={sub.x} y2={sub.y} className="stroke-cyan-500/10 stroke-1" strokeDasharray="4 4" />
          )))}
          {project.zones.map(zone => {
            const sub = project.subsystems.find(s => s.id === zone.subsystemId);
            if (!sub) return null;
            return <line key={`pwr-${zone.id}`} x1={sub.x} y1={sub.y} x2={zone.x} y2={zone.y} className="stroke-amber-500/10 stroke-1" />;
          })}

          {/* Render Elements */}
          {project.subsystems.map(sub => (
            <g key={sub.id} transform={`translate(${sub.x}, ${sub.y})`} onMouseDown={() => handleMouseDown('subsystem', sub.id)} className="cursor-move group">
              <rect x="-30" y="-30" width="60" height="60" rx="8" className="fill-slate-800 stroke-indigo-500/50 stroke-1 shadow-2xl" />
              <Cpu size={16} x="-8" y="-8" className="text-indigo-400" />
              <text y="40" textAnchor="middle" className="text-[8px] fill-slate-500 font-bold uppercase">{sub.name}</text>
            </g>
          ))}

          {project.zones.map(zone => {
            const fixtureDef = project.fixtures.find(f => f.id === zone.fixtureId);
            return (
              <g key={zone.id} transform={`translate(${zone.x}, ${zone.y}) rotate(${zone.rotation || 0})`} onMouseDown={() => handleMouseDown('zone', zone.id)} className="cursor-move group">
                <rect x="-20" y="-2" width="40" height="4" rx="1" className={`transition-all ${selectedElement?.id === zone.id ? 'fill-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)]' : 'fill-slate-600 group-hover:fill-slate-400'}`} />
                <text y="-8" textAnchor="middle" className="text-[7px] fill-slate-500 font-bold uppercase">{zone.name}</text>
              </g>
            );
          })}
        </svg>

        {/* Selected Element Tooltip */}
        {selectedZoneData && (
          <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-indigo-500/30 shadow-2xl animate-in fade-in slide-in-from-top-4 w-64 pointer-events-none">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl"><Info size={16}/></div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">{selectedZoneData.name}</h4>
                <p className="text-[10px] text-slate-500">{selectedZoneData.fixtureName}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[10px]">
                 <span className="text-slate-500">Strips</span>
                 <span className="text-slate-300">${selectedZoneData.breakdown.strip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                 <span className="text-slate-500">Mounting</span>
                 <span className="text-slate-300">${selectedZoneData.breakdown.mount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                 <span className="text-slate-500">Cabling</span>
                 <span className="text-slate-300">${selectedZoneData.breakdown.cable.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Cost</span>
              <span className="text-xl font-black text-emerald-400">${selectedZoneData.totalCost.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StageCanvas;
