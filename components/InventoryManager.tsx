
import React, { useState } from 'react';
import { LEDStrip, PSU, Voltage, LEDType, Controller, EthernetSwitch, MountingStructure, Cable, Fuse } from '../types';
import { Plus, Trash2, Package, Zap, DollarSign, Database, Search, Shield, Cpu, Waves, Hammer, Layers } from 'lucide-react';

interface Props {
  strips: LEDStrip[]; setStrips: any;
  psus: PSU[]; setPsus: any;
  controllers: Controller[]; setControllers: any;
  mountings: MountingStructure[]; setMountings: any;
  cables: Cable[]; setCables: any;
  fuses: Fuse[]; setFuses: any;
}

const InventoryManager: React.FC<Props> = ({ strips, setStrips, psus, setPsus, controllers, setControllers, mountings, setMountings, cables, setCables, fuses, setFuses }) => {
  const [activeSubTab, setActiveSubTab] = useState<'strips' | 'psus' | 'controllers' | 'mountings' | 'cables' | 'fuses'>('strips');
  const [search, setSearch] = useState('');

  const renderTabs = () => (
    <div className="flex flex-wrap gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-700 w-fit">
      {[
        { id: 'strips', label: 'LED Strips', icon: Package },
        { id: 'psus', label: 'Power Supplies', icon: Zap },
        { id: 'controllers', label: 'Controllers', icon: Cpu },
        { id: 'mountings', label: 'Mounting', icon: Hammer },
        { id: 'cables', label: 'Cables', icon: Waves },
        { id: 'fuses', label: 'Fuses', icon: Shield },
      ].map(tab => (
        <button 
          key={tab.id}
          onClick={() => setActiveSubTab(tab.id as any)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <tab.icon size={14}/> {tab.label}
        </button>
      ))}
    </div>
  );

  const addItem = () => {
    const id = crypto.randomUUID();
    switch(activeSubTab) {
      case 'strips': setStrips([...strips, { id, name: 'New Strip', voltage: Voltage.V24, type: LEDType.RGB, wattsPerMeter: 14.4, ledsPerMeter: 60, pricePerMeter: 10, brand: 'Generic', ipRating: 'IP20' }]); break;
      case 'psus': setPsus([...psus, { id, name: 'New PSU', voltage: Voltage.V24, maxWatts: 350, efficiency: 0.9, price: 50, brand: 'Generic', ipRating: 'IP20' }]); break;
      case 'controllers': setControllers([...controllers, { id, name: 'New Controller', type: 'ArtNet', ports: 8, maxPixelsPerPort: 680, price: 200, brand: 'Generic', ipRating: 'IP20' }]); break;
      case 'mountings': setMountings([...mountings, { id, name: 'New Profile', material: 'Aluminum', pricePerMeter: 12, weightPerMeter: 0.5, ipRating: 'IP20' }]); break;
      case 'cables': setCables([...cables, { id, name: 'New Cable', gauge: 18, maxAmps: 10, pricePerMeter: 1.5, ipRating: 'IP20' }]); break;
      case 'fuses': setFuses([...fuses, { id, name: 'New Fuse', rating: 10, type: 'Fast', price: 1.0 }]); break;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {renderTabs()}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search catalog..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={addItem} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
            <Plus size={20} /> Add Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeSubTab === 'strips' && strips.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(s => (
          <div key={s.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex flex-col group">
            <div className="flex justify-between mb-4">
              <input className="bg-transparent font-bold text-lg outline-none w-full" value={s.name} onChange={e => setStrips(strips.map(x => x.id === s.id ? {...x, name: e.target.value} : x))} />
              <button onClick={() => setStrips(strips.filter(x => x.id !== s.id))} className="text-slate-600 hover:text-red-400 p-1"><Trash2 size={18}/></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
               <div className="space-y-1">
                 <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">Voltage</span>
                 <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" value={s.voltage} onChange={e => setStrips(strips.map(x => x.id === s.id ? {...x, voltage: parseInt(e.target.value)} : x))}>
                   <option value={5}>5V</option><option value={12}>12V</option><option value={24}>24V</option><option value={48}>48V</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">Watts/m</span>
                 <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" value={s.wattsPerMeter} onChange={e => setStrips(strips.map(x => x.id === s.id ? {...x, wattsPerMeter: parseFloat(e.target.value) || 0} : x))} />
               </div>
               <div className="space-y-1">
                 <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">Price/m</span>
                 <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" value={s.pricePerMeter} onChange={e => setStrips(strips.map(x => x.id === s.id ? {...x, pricePerMeter: parseFloat(e.target.value) || 0} : x))} />
               </div>
               <div className="space-y-1">
                 <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">IP Rating</span>
                 <input className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white uppercase" value={s.ipRating} onChange={e => setStrips(strips.map(x => x.id === s.id ? {...x, ipRating: e.target.value} : x))} />
               </div>
            </div>
          </div>
        ))}

        {activeSubTab === 'psus' && psus.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
          <div key={p.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 group">
            <div className="flex justify-between mb-4">
              <input className="bg-transparent font-bold text-lg outline-none w-full" value={p.name} onChange={e => setPsus(psus.map(x => x.id === p.id ? {...x, name: e.target.value} : x))} />
              <button onClick={() => setPsus(psus.filter(x => x.id !== p.id))} className="text-slate-600 hover:text-red-400 p-1"><Trash2 size={18}/></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
               <div className="space-y-1">
                 <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">Output Watts</span>
                 <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" value={p.maxWatts} onChange={e => setPsus(psus.map(x => x.id === p.id ? {...x, maxWatts: parseFloat(e.target.value) || 0} : x))} />
               </div>
               <div className="space-y-1">
                 <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">IP Rating</span>
                 <input className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" value={p.ipRating} onChange={e => setPsus(psus.map(x => x.id === p.id ? {...x, ipRating: e.target.value} : x))} />
               </div>
            </div>
          </div>
        ))}

        {activeSubTab === 'mountings' && mountings.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map(m => (
          <div key={m.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 group">
            <div className="flex justify-between mb-4">
              <input className="bg-transparent font-bold text-lg outline-none w-full" value={m.name} onChange={e => setMountings(mountings.map(x => x.id === m.id ? {...x, name: e.target.value} : x))} />
              <button onClick={() => setMountings(mountings.filter(x => x.id !== m.id))} className="text-slate-600 hover:text-red-400 p-1"><Trash2 size={18}/></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
               <div className="space-y-1">
                 <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">Price/m</span>
                 <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" value={m.pricePerMeter} onChange={e => setMountings(mountings.map(x => x.id === m.id ? {...x, pricePerMeter: parseFloat(e.target.value) || 0} : x))} />
               </div>
               <div className="space-y-1">
                 <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">kg/m</span>
                 <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" value={m.weightPerMeter} onChange={e => setMountings(mountings.map(x => x.id === m.id ? {...x, weightPerMeter: parseFloat(e.target.value) || 0} : x))} />
               </div>
            </div>
          </div>
        ))}

        {/* Similar maps for controllers, cables, fuses can go here */}
      </div>
    </div>
  );
};

export default InventoryManager;
