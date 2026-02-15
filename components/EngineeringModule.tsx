
import React, { useMemo, useState } from 'react';
import { Project, LEDStrip, PSU, Subsystem, Controller, Cable, Fuse } from '../types';
import { WIRE_RESISTANCE } from '../constants';
import { GeminiService } from '../services/geminiService';
import { Zap, Shield, Ruler, BrainCircuit, AlertCircle, TrendingDown, DollarSign, Package } from 'lucide-react';

interface Props {
  project: Project;
  strips: LEDStrip[];
  psus: PSU[];
  cables: Cable[];
  fuses: Fuse[];
}

const EngineeringModule: React.FC<Props> = ({ project, strips, psus, cables, fuses }) => {
  const gemini = new GeminiService();
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [aiTips, setAiTips] = useState<Record<string, string>>({});

  const handleAiSuggest = async (zoneId: string, current: number, length: number, voltage: number) => {
    setLoadingAi(zoneId);
    const result = await gemini.suggestWireGauge(current, length, voltage);
    setAiTips(prev => ({ ...prev, [zoneId]: result }));
    setLoadingAi(null);
  };

  const engineeringData = useMemo(() => {
    return project.zones.map(zone => {
      const fix = project.fixtureDefinitions.find(f => f.id === zone.fixtureDefinitionId);
      const strip = strips.find(s => s.id === fix?.stripId);
      const subsystem = project.subsystems.find(s => s.id === zone.subsystemId);
      const psu = psus.find(p => p.id === subsystem?.psuId);
      
      if (!strip || !fix) return null;

      const power = strip.wattsPerMeter * fix.length;
      const current = power / strip.voltage;
      const resistance = (WIRE_RESISTANCE[zone.wireGauge] || 0) * zone.wireLength * 2;
      const vDrop = current * resistance;
      const vDropPercent = (vDrop / strip.voltage) * 100;

      return { zone, fix, strip, power, current, vDropPercent, psu };
    });
  }, [project, strips, psus]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 shadow-xl overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 text-indigo-500/10 group-hover:scale-110 transition-transform"><Zap size={100}/></div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Zap size={12}/> Global Draw</h4>
          <p className="text-3xl font-black text-white">{engineeringData.reduce((acc, d) => acc + (d?.power || 0), 0).toFixed(0)}W</p>
          <p className="text-[10px] text-indigo-400 font-bold mt-1">PEAK LOAD AGGREGATED</p>
        </div>
        <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 shadow-xl overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 text-emerald-500/10 group-hover:scale-110 transition-transform"><DollarSign size={100}/></div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><DollarSign size={12}/> Project Value</h4>
          <p className="text-3xl font-black text-white">$2,450</p>
          <p className="text-[10px] text-emerald-400 font-bold mt-1">ESTIMATED BOM COST</p>
        </div>
      </div>

      <div className="space-y-6">
        {engineeringData.map((data, idx) => data && (
          <div key={data.zone.id} className="bg-slate-800/40 backdrop-blur-md p-8 rounded-[3rem] border border-slate-700/50 flex flex-col lg:flex-row gap-8 items-start hover:border-indigo-500/30 transition-all">
            <div className="lg:w-1/4">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{data.zone.name}</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Profile: {data.fix.name}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-xl font-bold border border-indigo-500/20">{data.strip.voltage}V System</span>
                <span className="text-[9px] bg-slate-900 text-slate-400 px-3 py-1 rounded-xl font-bold border border-slate-700">{data.strip.type}</span>
              </div>
            </div>

            <div className="lg:flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-700/30">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Peak Current</span>
                <span className="text-xl font-black text-white">{data.current.toFixed(2)}A</span>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-700/30">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Power</span>
                <span className="text-xl font-black text-white">{data.power.toFixed(1)}W</span>
              </div>
              <div className={`p-4 rounded-3xl border ${data.vDropPercent > 4 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">V-Drop</span>
                <span className={`text-xl font-black ${data.vDropPercent > 4 ? 'text-red-400' : 'text-emerald-400'}`}>{data.vDropPercent.toFixed(1)}%</span>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-700/30">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1 flex items-center gap-1"><TrendingDown size={10}/> Voltage @ End</span>
                <span className="text-xl font-black text-white">{(data.strip.voltage * (1 - data.vDropPercent/100)).toFixed(2)}V</span>
              </div>
            </div>

            <div className="lg:w-1/3 bg-slate-900/80 p-6 rounded-[2.5rem] border border-indigo-500/20 space-y-4 w-full">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Shield size={14}/> Physics Overrides</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Wire Gauge (AWG)</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    value={data.zone.wireGauge}
                    onChange={e => project.zones.find(z => z.id === data.zone.id)!.wireGauge = parseInt(e.target.value)}
                  >
                    <option value={24}>24 AWG</option><option value={20}>20 AWG</option><option value={18}>18 AWG</option><option value={14}>14 AWG</option><option value={10}>10 AWG</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Fused Protection</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    value={data.zone.fuseId}
                    onChange={e => project.zones.find(z => z.id === data.zone.id)!.fuseId = e.target.value}
                  >
                    <option value="">Auto Select</option>
                    {fuses.map(f => <option key={f.id} value={f.id}>{f.name} ({f.rating}A)</option>)}
                  </select>
                </div>
              </div>
              <button 
                onClick={() => handleAiSuggest(data.zone.id, data.current, data.zone.wireLength, data.strip.voltage)}
                className="w-full bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-indigo-500/20"
                disabled={loadingAi === data.zone.id}
              >
                <BrainCircuit size={14}/> {loadingAi === data.zone.id ? 'Optimizing...' : 'AI Optimization'}
              </button>
              {aiTips[data.zone.id] && (
                <div className="bg-indigo-950/40 p-3 rounded-2xl border border-indigo-500/20 text-[9px] text-indigo-200 leading-relaxed animate-in fade-in slide-in-from-top-1">
                  {aiTips[data.zone.id]}
                </div>
              )}
            </div>
          </div>
        ))}

        {engineeringData.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-[3rem] bg-slate-900/30">
            <TrendingDown className="mx-auto text-slate-700 mb-4 opacity-20" size={80} />
            <p className="text-slate-500 font-black uppercase tracking-widest text-lg">No endpoints detected</p>
            <p className="text-slate-600 text-sm mt-2">Finish your stage placement to view electrical calculations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineeringModule;
