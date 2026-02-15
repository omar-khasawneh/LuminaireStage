
import React, { useState } from 'react';
import { LEDStrip, PSU, Voltage, LEDType, Controller, Cable, Fuse, Mounting } from '../types';
import { Plus, Trash2, Package, Zap, DollarSign, Database, Search, Shield, Cpu, Waves, Hammer } from 'lucide-react';

interface Props {
  strips: LEDStrip[]; setStrips: any;
  psus: PSU[]; setPsus: any;
  controllers: Controller[]; setControllers: any;
  cables: Cable[]; setCables: any;
  fuses: Fuse[]; setFuses: any;
  mountings: Mounting[]; setMountings: any;
}

const InventoryManager: React.FC<Props> = ({ strips, setStrips, psus, setPsus, controllers, setControllers, cables, setCables, fuses, setFuses, mountings, setMountings }) => {
  const [activeSubTab, setActiveSubTab] = useState<'strips' | 'psus' | 'controllers' | 'cables' | 'fuses' | 'mountings'>('strips');
  const [search, setSearch] = useState('');

  const addStrip = () => setStrips([...strips, { id: crypto.randomUUID(), name: 'New Strip', voltage: Voltage.V24, type: LEDType.RGB, wattsPerMeter: 14.4, ledsPerMeter: 60, pricePerMeter: 10, brand: 'Generic', ipRating: 'IP20', maxRunLength: 5 }]);
  const addPSU = () => setPsus([...psus, { id: crypto.randomUUID(), name: 'New PSU', voltage: Voltage.V24, maxWatts: 150, efficiency: 0.9, price: 30, brand: 'Generic', ipRating: 'IP20', formFactor: 'Enclosed' }]);
  const addController = () => setControllers([...controllers, { id: crypto.randomUUID(), name: 'New Controller', type: 'ArtNet', ports: 4, maxPixelsPerPort: 680, price: 100, brand: 'Generic', ipRating: 'IP20' }]);

  const updateItem = (list: any[], setList: any, id: string, updates: any) => {
    setList(list.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 bg-slate-800 p-4 rounded-3xl border border-slate-700">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'strips', label: 'LED Strips', icon: Package },
            { id: 'psus', label: 'Power Units', icon: Zap },
            { id: 'controllers', label: 'Controllers', icon: Cpu },
            { id: 'cables', label: 'Cabling', icon: Waves },
            { id: 'fuses', label: 'Protection', icon: Shield },
            { id: 'mountings', label: 'Structures', icon: Hammer }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeSubTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
            >
              <tab.icon size={14}/> {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              className="bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm w-full outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder={`Search ${activeSubTab}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={addStrip} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <Plus size={16}/> New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeSubTab === 'strips' && strips.map(s => (
          <div key={s.id} className="bg-slate-800 p-5 rounded-3xl border border-slate-700 group">
             <div className="flex justify-between items-center mb-4">
               <input className="bg-transparent font-bold outline-none flex-1" value={s.name} onChange={e => updateItem(strips, setStrips, s.id, {name: e.target.value})} />
               <button onClick={() => setStrips(strips.filter(x => x.id !== s.id))} className="text-slate-600 hover:text-red-400"><Trash2 size={16}/></button>
             </div>
             <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                   <p className="text-slate-500 uppercase font-black tracking-widest mb-1">Volts</p>
                   <p className="font-bold text-slate-200">{s.voltage}V DC</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                   <p className="text-slate-500 uppercase font-black tracking-widest mb-1">Consumption</p>
                   <p className="font-bold text-slate-200">{s.wattsPerMeter} W/m</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                   <p className="text-slate-500 uppercase font-black tracking-widest mb-1">IP Rating</p>
                   <p className="font-bold text-indigo-400">{s.ipRating}</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                   <p className="text-slate-500 uppercase font-black tracking-widest mb-1">Max Run</p>
                   <p className="font-bold text-slate-200">{s.maxRunLength}m</p>
                </div>
             </div>
          </div>
        ))}

        {activeSubTab === 'psus' && psus.map(p => (
          <div key={p.id} className="bg-slate-800 p-5 rounded-3xl border border-slate-700 group">
             <div className="flex justify-between items-center mb-4">
               <input className="bg-transparent font-bold outline-none flex-1" value={p.name} onChange={e => updateItem(psus, setPsus, p.id, {name: e.target.value})} />
             </div>
             <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                   <p className="text-slate-500 uppercase font-black tracking-widest mb-1">Capacity</p>
                   <p className="font-bold text-emerald-400">{p.maxWatts}W</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                   <p className="text-slate-500 uppercase font-black tracking-widest mb-1">Efficiency</p>
                   <p className="font-bold text-slate-200">{p.efficiency * 100}%</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                   <p className="text-slate-500 uppercase font-black tracking-widest mb-1">IP Rating</p>
                   <p className="font-bold text-indigo-400">{p.ipRating}</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                   <p className="text-slate-500 uppercase font-black tracking-widest mb-1">Price</p>
                   <p className="font-bold text-emerald-500">${p.price}</p>
                </div>
             </div>
          </div>
        ))}

        {/* Similar maps for cables, fuses, controllers... */}
      </div>
    </div>
  );
};

export default InventoryManager;
