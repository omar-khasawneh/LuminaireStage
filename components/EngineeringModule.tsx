
import React, { useMemo, useState } from 'react';
import { Project, LEDStrip, PSU, Subsystem, Controller } from '../types';
import { WIRE_RESISTANCE, DEFAULT_CONTROLLERS } from '../constants';
import { GeminiService } from '../services/geminiService';
import { Zap, AlertTriangle, Shield, Cpu, Network, Info, BrainCircuit } from 'lucide-react';

interface Props {
  project: Project;
  strips: LEDStrip[];
  psus: PSU[];
}

const EngineeringModule: React.FC<Props> = ({ project, strips, psus }) => {
  const gemini = new GeminiService();
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});

  const subsystemReports = useMemo(() => {
    return project.subsystems.map(sub => {
      const psu = psus.find(p => p.id === sub.psuId);
      const controller = DEFAULT_CONTROLLERS.find(c => c.id === sub.controllerId);
      const zones = project.zones.filter(z => z.subsystemId === sub.id);
      
      const zoneCalcs = zones.map(zone => {
        const strip = strips.find(s => s.id === zone.stripId);
        if (!strip) return null;
        const power = strip.wattsPerMeter * zone.length;
        const current = power / strip.voltage;
        const resistance = (WIRE_RESISTANCE[zone.wireGauge] || 0) * zone.wireLength * 2;
        const vDrop = current * resistance;
        const vDropPercent = (vDrop / strip.voltage) * 100;
        return { zone, power, current, vDropPercent };
      });

      const totalPower = zoneCalcs.reduce((acc, curr) => acc + (curr?.power || 0), 0);
      const psuLoad = psu ? (totalPower / psu.maxWatts) * 100 : 0;

      return { sub, psu, controller, zoneCalcs, totalPower, psuLoad };
    });
  }, [project, strips, psus]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h4 className="text-[10px] font-black text-slate-500 uppercase mb-2 flex items-center gap-1"><Network size={12}/> Net Topology</h4>
          <p className="text-2xl font-black">{project.subsystems.length} Hubs</p>
          <p className="text-xs text-slate-500 mt-1">{project.zones.length} Total Fixtures</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h4 className="text-[10px] font-black text-slate-500 uppercase mb-2 flex items-center gap-1"><Zap size={12}/> Global Power</h4>
          <p className="text-2xl font-black">{subsystemReports.reduce((a, b) => a + b.totalPower, 0).toFixed(0)}W</p>
          <p className="text-xs text-slate-500 mt-1">Aggregated peak load</p>
        </div>
      </div>

      <div className="space-y-6">
        {subsystemReports.map(report => (
          <div key={report.sub.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full -mr-16 -mt-16"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-black text-white">{report.sub.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold">{report.psu?.name}</span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">{report.controller?.name}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">{report.totalPower.toFixed(1)}W</p>
                <div className="w-32 bg-slate-900 h-2 rounded-full overflow-hidden mt-1 ml-auto">
                  <div className={`h-full ${report.psuLoad > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(report.psuLoad, 100)}%` }} />
                </div>
                <p className="text-[10px] font-black text-slate-500 mt-1">LOAD: {report.psuLoad.toFixed(1)}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.zoneCalcs.map(calc => calc && (
                <div key={calc.zone.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-300">{calc.zone.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${calc.vDropPercent > 3 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {calc.vDropPercent.toFixed(1)}% Drop
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-bold uppercase">
                    <div>Fuse: {(calc.current * project.safetyFactor).toFixed(1)}A</div>
                    <div className="text-right">I: {calc.current.toFixed(2)}A</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngineeringModule;
