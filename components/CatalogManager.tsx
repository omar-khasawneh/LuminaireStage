
import React, { useState } from 'react';
import { LEDStrip, PSU, Controller, MountingStructure, Cable, Fuse, Voltage, LEDType } from '../types';
import { Package, Zap, Cpu, Hammer, Waves, Shield, Plus, Trash2, Search } from 'lucide-react';

interface Props {
  strips: LEDStrip[]; setStrips: (s: LEDStrip[]) => void;
  psus: PSU[]; setPsus: (p: PSU[]) => void;
  controllers: Controller[]; setControllers: (c: Controller[]) => void;
  mountings: MountingStructure[]; setMountings: (m: MountingStructure[]) => void;
  cables: Cable[]; setCables: (c: Cable[]) => void;
  fuses: Fuse[]; setFuses: (f: Fuse[]) => void;
}

const CatalogManager: React.FC<Props> = ({ strips, setStrips, psus, setPsus, controllers, setControllers, mountings, setMountings, cables, setCables, fuses, setFuses }) => {
  const [activeTab, setActiveTab] = useState<'strips' | 'psus' | 'controllers' | 'mountings' | 'cables' | 'fuses'>('strips');

  const addItem = () => {
    const id = crypto.randomUUID();
    if (activeTab === 'strips') setStrips([...strips, { id, name: 'New Strip', voltage: Voltage.V12, type: LEDType.Addressable, wattsPerMeter: 14.4, ledsPerMeter: 60, pricePerMeter: 10, brand: 'Generic', ipRating: 'IP20' }]);
    if (activeTab === 'psus') setPsus([...psus, { id, name: 'New PSU', voltage: Voltage.V12, maxWatts: 150, efficiency: 0.9, price: 30, brand: 'Generic', ipRating: 'IP20' }]);
    if (activeTab === 'controllers') setControllers([...controllers, { id, name: 'New Controller', type: 'ArtNet', ports: 4, maxPixelsPerPort: 680, price: 120, brand: 'Generic' }]);
    if (activeTab === 'mountings') setMountings([...mountings, { id, name: 'New Profile', material: 'Aluminum', pricePerMeter: 8, weightPerMeter: 0.3 }]);
    if (activeTab === 'cables') setCables([...cables, { id, name: 'New Cable', gauge: 18, maxAmps: 10, pricePerMeter: 1.2 }]);
    if (activeTab === 'fuses') setFuses([...fuses, { id, name: 'New Fuse', rating: 10, type: 'Blade', price: 0.5 }]);
  };

  const updateItem = (list: any[], setter: any, id: string, key: string, val: any) => {
    setter(list.map(item => item.id === id ? { ...item, [key]: val } : item));
  };

  const removeItem = (list: any[], setter: any, id: string) => {
    setter(list.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-800 p-2 rounded-3xl border border-slate-700 flex flex-wrap gap-1 shadow-xl">
        {[
          { id: 'strips', label: 'LED Strips', icon: Package },
          { id: 'psus', label: 'Power Units', icon: Zap },
          { id: 'controllers', label: 'Controllers', icon: Cpu },
          { id: 'mountings', label: 'Mounting', icon: Hammer },
          { id: 'cables', label: 'Cabling', icon: Waves },
          { id: 'fuses', label: 'Safety', icon: Shield },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Manage {activeTab} Inventory</h2>
        <button onClick={addItem} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
          <Plus size={18} /> New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(activeTab === 'strips' ? strips : activeTab === 'psus' ? psus : activeTab === 'controllers' ? controllers : activeTab === 'mountings' ? mountings : activeTab === 'cables' ? cables : fuses).map((item: any) => (
          <div key={item.id} className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 group hover:border-indigo-500/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <input
                className="bg-transparent text-lg font-bold outline-none border-b border-transparent focus:border-indigo-500 w-full"
                value={item.name}
                onChange={e => updateItem(activeTab === 'strips' ? strips : activeTab === 'psus' ? psus : activeTab === 'controllers' ? controllers : activeTab === 'mountings' ? mountings : activeTab === 'cables' ? cables : fuses, activeTab === 'strips' ? setStrips : activeTab === 'psus' ? setPsus : activeTab === 'controllers' ? setControllers : activeTab === 'mountings' ? setMountings : activeTab === 'cables' ? setCables : setFuses, item.id, 'name', e.target.value)}
              />
              <button onClick={() => removeItem(activeTab === 'strips' ? strips : activeTab === 'psus' ? psus : activeTab === 'controllers' ? controllers : activeTab === 'mountings' ? mountings : activeTab === 'cables' ? cables : fuses, activeTab === 'strips' ? setStrips : activeTab === 'psus' ? setPsus : activeTab === 'controllers' ? setControllers : activeTab === 'mountings' ? setMountings : activeTab === 'cables' ? setCables : setFuses, item.id)} className="text-slate-600 hover:text-red-400 p-2"><Trash2 size={18} /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(item).filter(([k]) => k !== 'id' && k !== 'name').map(([key, val]) => (
                <div key={key}>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">{key}</label>
                  <input
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    type={typeof val === 'number' ? 'number' : 'text'}
                    value={val}
                    onChange={e => updateItem(activeTab === 'strips' ? strips : activeTab === 'psus' ? psus : activeTab === 'controllers' ? controllers : activeTab === 'mountings' ? mountings : activeTab === 'cables' ? cables : fuses, activeTab === 'strips' ? setStrips : activeTab === 'psus' ? setPsus : activeTab === 'controllers' ? setControllers : activeTab === 'mountings' ? setMountings : activeTab === 'cables' ? setCables : setFuses, item.id, key, typeof val === 'number' ? parseFloat(e.target.value) : e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogManager;
