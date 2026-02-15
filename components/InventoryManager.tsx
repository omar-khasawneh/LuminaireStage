
import React, { useState } from 'react';
import { LEDStrip, PSU, Voltage, LEDType } from '../types';
import { Plus, Trash2, Edit3, Package, Zap, DollarSign, Database, Search } from 'lucide-react';

interface Props {
  strips: LEDStrip[];
  setStrips: React.Dispatch<React.SetStateAction<LEDStrip[]>>;
  psus: PSU[];
  setPsus: React.Dispatch<React.SetStateAction<PSU[]>>;
}

const InventoryManager: React.FC<Props> = ({ strips, setStrips, psus, setPsus }) => {
  const [activeSubTab, setActiveSubTab] = useState<'strips' | 'psus'>('strips');
  const [search, setSearch] = useState('');

  const addStrip = () => {
    // Added missing ipRating property to satisfy LEDStrip interface
    const newStrip: LEDStrip = {
      id: crypto.randomUUID(),
      name: 'New LED Strip',
      voltage: Voltage.V24,
      type: LEDType.RGB,
      wattsPerMeter: 14.4,
      ledsPerMeter: 60,
      pricePerMeter: 10,
      brand: 'Generic',
      ipRating: 'IP20'
    };
    setStrips([...strips, newStrip]);
  };

  const addPSU = () => {
    const newPSU: PSU = {
      id: crypto.randomUUID(),
      name: 'New PSU',
      voltage: Voltage.V24,
      maxWatts: 150,
      efficiency: 0.9,
      price: 30,
      brand: 'Generic',
      ipRating: 'IP20'
    };
    setPsus([...psus, newPSU]);
  };

  const removeStrip = (id: string) => setStrips(strips.filter(s => s.id !== id));
  const removePSU = (id: string) => setPsus(psus.filter(p => p.id !== id));

  const updateStrip = (id: string, updates: Partial<LEDStrip>) => {
    setStrips(strips.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const updatePSU = (id: string, updates: Partial<PSU>) => {
    setPsus(psus.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const filteredStrips = strips.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.brand.toLowerCase().includes(search.toLowerCase()));
  const filteredPsus = psus.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button 
              onClick={() => setActiveSubTab('strips')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'strips' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <div className="flex items-center gap-2"><Package size={16}/> LED Strips</div>
            </button>
            <button 
              onClick={() => setActiveSubTab('psus')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'psus' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <div className="flex items-center gap-2"><Zap size={16}/> Power Supplies</div>
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search catalog..." 
            className="bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button 
          onClick={activeSubTab === 'strips' ? addStrip : addPSU}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-colors"
        >
          <Plus size={18} /> Add New {activeSubTab === 'strips' ? 'Strip' : 'PSU'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {activeSubTab === 'strips' ? (
          filteredStrips.map(strip => (
            <div key={strip.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 group hover:border-indigo-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Package size={20} />
                  </div>
                  <input 
                    className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-indigo-500 outline-none text-lg font-bold"
                    value={strip.name}
                    onChange={(e) => updateStrip(strip.id, { name: e.target.value })}
                  />
                </div>
                <button onClick={() => removeStrip(strip.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><Trash2 size={18}/></button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold tracking-tighter">Voltage</span>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5"
                    value={strip.voltage}
                    onChange={(e) => updateStrip(strip.id, { voltage: parseInt(e.target.value) })}
                  >
                    {[5, 12, 24, 48].map(v => <option key={v} value={v}>{v}V</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold tracking-tighter">Type</span>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5"
                    value={strip.type}
                    onChange={(e) => updateStrip(strip.id, { type: e.target.value as LEDType })}
                  >
                    {Object.values(LEDType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold tracking-tighter">W/m</span>
                  <input 
                    type="number" 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5"
                    value={strip.wattsPerMeter}
                    onChange={(e) => updateStrip(strip.id, { wattsPerMeter: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold tracking-tighter">IP Rating</span>
                  <input 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5"
                    value={strip.ipRating}
                    onChange={(e) => updateStrip(strip.id, { ipRating: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold tracking-tighter">Price/m</span>
                  <div className="relative">
                    <DollarSign size={12} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                    <input 
                      type="number" 
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 pl-5"
                      value={strip.pricePerMeter}
                      onChange={(e) => updateStrip(strip.id, { pricePerMeter: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          filteredPsus.map(psu => (
            <div key={psu.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 group hover:border-emerald-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <Zap size={20} />
                  </div>
                  <input 
                    className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-emerald-500 outline-none text-lg font-bold"
                    value={psu.name}
                    onChange={(e) => updatePSU(psu.id, { name: e.target.value })}
                  />
                </div>
                <button onClick={() => removePSU(psu.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><Trash2 size={18}/></button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold tracking-tighter">Voltage</span>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5"
                    value={psu.voltage}
                    onChange={(e) => updatePSU(psu.id, { voltage: parseInt(e.target.value) })}
                  >
                    {[5, 12, 24, 48].map(v => <option key={v} value={v}>{v}V</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold tracking-tighter">Rating (W)</span>
                  <input 
                    type="number" 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5"
                    value={psu.maxWatts}
                    onChange={(e) => updatePSU(psu.id, { maxWatts: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold tracking-tighter">IP Rating</span>
                  <input 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5"
                    value={psu.ipRating}
                    onChange={(e) => updatePSU(psu.id, { ipRating: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold tracking-tighter">Unit Price</span>
                  <div className="relative">
                    <DollarSign size={12} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                    <input 
                      type="number" 
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 pl-5"
                      value={psu.price}
                      onChange={(e) => updatePSU(psu.id, { price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {(activeSubTab === 'strips' ? filteredStrips : filteredPsus).length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
          <Database className="mx-auto text-slate-700 mb-2" size={40} />
          <p className="text-slate-500">No matching materials found in the local database.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
