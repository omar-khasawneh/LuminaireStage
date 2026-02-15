
import React, { useState, useRef } from 'react';
import { Project, Zone, LEDStrip, PSU, Subsystem, Controller, EthernetSwitch } from '../types';
import { Move, Zap, Network, Box, Cpu, MousePointer2, Trash2 } from 'lucide-react';

interface Props {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  strips: LEDStrip[];
}

const StageCanvas: React.FC<Props> = ({ project, setProject, strips }) => {
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

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-bold flex items-center gap-2 text-indigo-400">
            <Move size={18} /> System Topology View
          </h3>
          <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">Visualizing Power & Data Logic Flow</span>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setSelectedElement(null)} className="p-2 hover:bg-slate-700 rounded text-slate-400 transition-colors"><MousePointer2 size={18}/></button>
        </div>
      </div>

      <div className="relative flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:25px_25px]">
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
                className="stroke-cyan-500/20 stroke-1"
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
                className="stroke-amber-500/20 stroke-2"
              />
            );
          })}

          {/* Ethernet Switches */}
          {project.ethernetSwitches.map(sw => (
            <g key={sw.id} transform={`translate(${sw.x}, ${sw.y})`} onMouseDown={() => handleMouseDown('switch', sw.id)} className="cursor-move group">
              <rect x="-25" y="-15" width="50" height="30" rx="4" className="fill-slate-800 stroke-cyan-500 stroke-2" />
              <Network size={16} x="-8" y="-8" className="text-cyan-400" />
              <text y="25" textAnchor="middle" className="text-[9px] fill-cyan-500 font-black uppercase tracking-tighter">{sw.name}</text>
            </g>
          ))}

          {/* Subsystems (PSU + Controller Hub) */}
          {project.subsystems.map(sub => (
            <g key={sub.id} transform={`translate(${sub.x}, ${sub.y})`} onMouseDown={() => handleMouseDown('subsystem', sub.id)} className="cursor-move group">
              <rect x="-35" y="-35" width="70" height="70" rx="8" className="fill-slate-800 stroke-indigo-500 stroke-2 shadow-xl" />
              <circle cx="0" cy="0" r="28" className="fill-slate-900/50 stroke-indigo-500/20 stroke-1" />
              <Cpu size={20} x="-10" y="-14" className="text-indigo-400" />
              <Zap size={12} x="-6" y="8" className="text-amber-400" />
              <text y="48" textAnchor="middle" className="text-[10px] fill-slate-300 font-bold uppercase tracking-widest">{sub.name}</text>
            </g>
          ))}

          {/* Fixtures (LED Strips) */}
          {project.zones.map(zone => {
            const strip = strips.find(s => s.id === zone.stripId);
            const power = (strip?.wattsPerMeter || 0) * zone.length;
            const current = power / (strip?.voltage || 12);
            
            return (
              <g key={zone.id} transform={`translate(${zone.x}, ${zone.y}) rotate(${zone.rotation || 0})`} onMouseDown={() => handleMouseDown('zone', zone.id)} className="cursor-move group">
                <rect x="-40" y="-4" width="80" height="8" rx="2" className="fill-slate-800 stroke-slate-600 hover:stroke-indigo-400 transition-colors" />
                <rect x="-40" y="-1" width="80" height="2" className="fill-indigo-500/40 blur-[1px]" />
                <text y="-8" textAnchor="middle" className="text-[8px] fill-slate-500 font-bold uppercase tracking-widest">{zone.name}</text>
                <text y="16" textAnchor="middle" className="text-[7px] fill-amber-500/70 font-mono group-hover:fill-amber-400">{current.toFixed(1)}A | {power.toFixed(0)}W</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default StageCanvas;
