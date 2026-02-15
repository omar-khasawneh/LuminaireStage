
import React, { useMemo, useState } from 'react';
import { Project, LEDStrip, PSU, Subsystem, Controller, FixtureDefinition, Cable, Fuse } from '../types';
import { WIRE_RESISTANCE, DEFAULT_CONTROLLERS, DEFAULT_FUSES, DEFAULT_CABLES } from '../constants';
import { GeminiService } from '../services/geminiService';
import { Zap, AlertTriangle, Shield, Cpu, Network, Info, BrainCircuit, Ruler, DollarSign, Hammer } from 'lucide-react';

interface Props {
  project: Project;
  strips: LEDStrip[];
  psus: PSU[];
}

const EngineeringModule: React.FC<Props> = ({ project, strips, psus }) => {
  const gemini = new GeminiService();
  const [loadingSuggestion, setLoadingSuggestion] = useState<string | null>(null);
  const [aiGauges, setAiGauges] = useState<Record<string, string>>({});

  const handleSuggest = async (zoneId: string, current: number, length: number, voltage: number) => {
    setLoadingSuggestion(zoneId);
    const suggestion = await gemini.suggestWireGauge(current, length, voltage);
    setAiGauges(prev => ({ ...prev, [zoneId]: suggestion }));
    setLoadingSuggestion(null);
  };

  const subsystemReports = useMemo(() => {
    return project.subsystems.map(sub => {
      const psu = psus.find(p => p.id === sub.psuId);
      const controller = DEFAULT_CONTROLLERS.find(c => c.id === sub.controllerId);
      const zones = project.zones.filter(z => z.subsystemId === sub.id);
      
      const zoneCalcs = zones.map(zone => {
        const fixtureDef = project.fixtureDefinitions.find(f => f.id === zone.fixtureDefinitionId);
        const strip = strips.find(s => s.id === fixtureDef?.stripId);
        if (!strip || !fixtureDef) return null;
        
        const power = strip.wattsPerMeter * fixtureDef.length;
        const current = power / strip.voltage;
        const resistance = (WIRE_RESISTANCE[zone.wireGauge] || 0) * zone.wireLength * 2;
        const vDrop = current * resistance;
        const vDropPercent = (vDrop / strip.voltage) * 100;
        
        // Suggest Fuse
        const safetyCurrent = current * project.safetyFactor;
        const suggestedFuse = DEFAULT_FUSES.find(f => f.rating >= safetyCurrent) || DEFAULT_FUSES[DEFAULT_FUSES.length-1];

        return { zone, fixtureDef, strip, power, current, vDropPercent, suggestedFuse };
      });

      const totalPower = zoneCalcs.reduce((acc, curr) => acc + (curr?.power || 0), 0);
      const psuLoad = psu ? (totalPower / psu.maxWatts) * 100 : 0;

      return { sub, psu, controller, zoneCalcs, totalPower, psuLoad };
    });
  }, [project, strips, psus]);

  const globalStats = useMemo(() => {
    const totalWatts = subsystemReports.reduce((acc, r) => acc + r.totalPower, 0);
    const totalCost = project.zones.reduce((acc, z) => {
        const f = project.fixtureDefinitions.find(fx => fx.id === z.fixtureDefinitionId);
        const s = strips.find(st => st.id === f?.stripId);
        const m = (f && f.mountingId) ? 10 : 0; // Simplified mounting logic for calc
        return acc + ((s?.pricePerMeter || 0) * (f?.length || 0)) + (z.wireLength * 2);
    }, 0);
    return { totalWatts, totalCost };
  }, [subsystemReports, project, strips]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-emerald-500/10 group-hover:scale-110 transition-transform"><DollarSign size={80}/></div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><DollarSign size={14}/> Est. Material Value</h4>
          <p className="text-3xl font-black text-white">${globalStats.totalCost.toFixed(0)}</p>
          <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase">Core System Inventory</p>
        </div>
        <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-amber-500/10 group-hover:scale-110 transition-transform"><Zap size={80}/></div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Zap size={14}/> Grid Power Req.</h4>
          <p className="text-3xl font-black text-white">{globalStats.totalWatts.toFixed(0)}W</p>
          <p className="text-[10px] text-amber-400 font-bold mt-2 uppercase">Aggregated Peak Load</p>
        </div>
        <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-indigo-500/10 group-hover:scale-110 transition-transform"><Network size={80}/></div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Network size={14}/> Topology Scope</h4>
          <p className="text-3xl font-black text-white">{project.subsystems.length} Hubs</p>
          <p className="text-[10px] text-indigo-400 font-bold mt-2 uppercase">{project.zones.length} Total Endpoints</p>
        </div>
        <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-blue-500/10 group-hover:scale-110 transition-transform"><Shield size={80}/></div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Shield size={14}/> Safety Grade</h4>
          <p className="text-3xl font-black text-white">{project.safetyFactor}x</p>
          <p className="text-[10px] text-blue-400 font-bold mt-2 uppercase">Fault Tolerance Factor</p>
        </div>
      </div>

      <div className="space-y-10">
        {subsystemReports.map(report => (
          <div key={report.sub.id} className="bg-slate-800/60 backdrop-blur-md p-10 rounded-[3.5rem] border border-slate-700/50 shadow-2xl relative">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
              <div>
                <h3 className="text-3xl font-black text-white flex items-center gap-4">
                  {report.sub.name}
                  <span className="text-xs bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-2xl font-black uppercase tracking-widest border border-indigo-500/20">Active Node</span>
                </h3>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-700">
                    <Zap className="text-amber-400" size={14}/>
                    <span className="text-xs font-bold text-slate-300">{report.psu?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-700">
                    <Cpu className="text-indigo-400" size={14}/>
                    <span className="text-xs font-bold text-slate-300">{report.controller?.name}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-[2rem] border border-slate-700/50 min-w-[200px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Load Status</span>
                  <span className={`text-xs font-black ${report.psuLoad > 90 ? 'text-red-400' : 'text-emerald-400'}`}>{report.psuLoad.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${report.psuLoad > 90 ? 'bg-red-500' : report.psuLoad > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(report.psuLoad, 100)}%` }} 
                  />
                </div>
                <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase text-center">{report.totalPower.toFixed(0)}W / {report.psu?.maxWatts}W MAX</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {report.zoneCalcs.map(calc => calc && (
                <div key={calc.zone.id} className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-700/30 group hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h5 className="font-black text-white text-sm">{calc.zone.name}</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{calc.fixtureDef.name}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${calc.vDropPercent > 4 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                      {calc.vDropPercent.toFixed(1)}% Drop
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                       <div className="flex items-center gap-2">
                          <Shield size={14} className="text-indigo-400"/>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Fuse</span>
                       </div>
                       <span className="text-xs font-black text-white bg-indigo-500/20 px-3 py-1 rounded-lg">{calc.suggestedFuse.rating}A {calc.suggestedFuse.type}</span>
                    </div>

                    <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                       <div className="flex items-center gap-2">
                          <BrainCircuit size={14} className="text-indigo-400"/>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Wire Optimizer</span>
                       </div>
                       <button 
                        onClick={() => handleSuggest(calc.zone.id, calc.current, calc.zone.wireLength, calc.strip.voltage)}
                        className="text-[10px] font-black text-indigo-400 hover:text-white transition-colors"
                        disabled={loadingSuggestion === calc.zone.id}
                       >
                         {loadingSuggestion === calc.zone.id ? 'Thinking...' : 'Suggested AWG?'}
                       </button>
                    </div>
                    {aiGauges[calc.zone.id] && (
                      <div className="text-[9px] text-indigo-200 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 animate-in slide-in-from-top-2">
                        {aiGauges[calc.zone.id]}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-700/50">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-500 uppercase">Load (I)</p>
                      <p className="text-sm font-black text-white">{calc.current.toFixed(2)}A</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-500 uppercase">Load (P)</p>
                      <p className="text-sm font-black text-white">{calc.power.toFixed(0)}W</p>
                    </div>
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
