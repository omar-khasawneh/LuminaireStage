
import React, { useState, useMemo } from 'react';
import { Project, LEDStrip, PSU, Subsystem, Controller, EthernetSwitch } from '../types';
import { GeminiService } from '../services/geminiService';
import { DEFAULT_CONTROLLERS, DEFAULT_SWITCHES } from '../constants';
import { Bot, Sparkles, FileText, Loader2, ListChecks, Printer, ShieldAlert } from 'lucide-react';

interface Props {
  project: Project;
  strips: LEDStrip[];
  psus: PSU[];
}

const AIDashboard: React.FC<Props> = ({ project, strips, psus }) => {
  const [loading, setLoading] = useState(false);
  const [techDocs, setTechDocs] = useState('');
  const gemini = new GeminiService();

  const bom = useMemo(() => {
    const counts = {
      strips: new Map<string, number>(),
      psus: new Map<string, number>(),
      controllers: new Map<string, number>(),
      switches: new Map<string, number>()
    };

    // FIX: Zones don't have stripId directly; lookup via fixtureDefinitions
    project.zones.forEach(z => {
      const fix = project.fixtureDefinitions.find(f => f.id === z.fixtureDefinitionId);
      if (fix) {
        counts.strips.set(fix.stripId, (counts.strips.get(fix.stripId) || 0) + fix.length);
      }
    });

    project.subsystems.forEach(s => {
      counts.psus.set(s.psuId, (counts.psus.get(s.psuId) || 0) + 1);
      counts.controllers.set(s.controllerId, (counts.controllers.get(s.controllerId) || 0) + 1);
    });

    // FIX: Properly check for optional ethernetSwitches and populate counts
    project.ethernetSwitches?.forEach(sw => counts.switches.set(sw.id || 'sw1', (counts.switches.get(sw.id || 'sw1') || 0) + 1));

    let total = 0;
    const lines: { name: string, qty: string, cost: number }[] = [];

    counts.strips.forEach((len, id) => {
      const s = strips.find(x => x.id === id);
      if (s) {
        const c = s.pricePerMeter * len;
        lines.push({ name: s.name, qty: `${len.toFixed(1)}m`, cost: c });
        total += c;
      }
    });

    counts.psus.forEach((qty, id) => {
      const p = psus.find(x => x.id === id);
      if (p) {
        const c = p.price * qty;
        lines.push({ name: p.name, qty: `x${qty}`, cost: c });
        total += c;
      }
    });

    counts.controllers.forEach((qty, id) => {
      const con = DEFAULT_CONTROLLERS.find(x => x.id === id);
      if (con) {
        const c = con.price * qty;
        lines.push({ name: con.name, qty: `x${qty}`, cost: c });
        total += c;
      }
    });

    // FIX: Implemented missing switch BOM line calculation
    counts.switches.forEach((qty, id) => {
      const sw = DEFAULT_SWITCHES.find(x => x.id === id);
      if (sw) {
        const c = sw.price * qty;
        lines.push({ name: sw.name, qty: `x${qty}`, cost: c });
        total += c;
      }
    });

    return { lines, total };
  }, [project, strips, psus]);

  const generateDocs = async () => {
    setLoading(true);
    const result = await gemini.generateTechnicalDocs(project);
    setTechDocs(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-indigo-900/30 p-8 rounded-3xl border border-indigo-500/30 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white">System Documentation</h2>
          <p className="text-indigo-200">Generating detailed multi-node engineering reports.</p>
        </div>
        <button onClick={generateDocs} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
          {loading ? <Loader2 className="animate-spin"/> : <FileText/>} Generate Site Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800 p-8 rounded-3xl border border-slate-700 min-h-[400px]">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Generated Engineering Text</h3>
          {techDocs ? (
             <div className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">{techDocs}</div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-600">
               <Bot size={64} className="mb-4 opacity-20"/>
               <p>Analysis for redundancy, Ethernet topology, and fuse coordination ready.</p>
             </div>
          )}
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-emerald-400 font-bold flex items-center gap-2"><ListChecks size={20}/> Global BOM</h3>
            <Printer className="text-slate-600"/>
          </div>
          <div className="space-y-4">
            {bom.lines.map((l, i) => (
              <div key={i} className="flex justify-between items-end border-b border-slate-700 pb-2">
                <div className="text-sm">
                  <p className="font-bold text-slate-300">{l.name}</p>
                  <p className="text-[10px] text-slate-500">{l.qty}</p>
                </div>
                <p className="font-mono text-emerald-500 text-sm">${l.cost.toFixed(2)}</p>
              </div>
            ))}
            <div className="pt-4 flex justify-between items-center">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Value</span>
              <span className="text-2xl font-black">${bom.total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;