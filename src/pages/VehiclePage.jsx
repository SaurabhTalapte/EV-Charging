import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EV_MAKES } from '../data/mockData';
import {
  Car, Plus, Trash2, Battery, Plug, Hash, ChevronDown, Sparkles
} from 'lucide-react';

export default function VehiclePage() {
  const { vehicles, addVehicle, removeVehicle } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [battery, setBattery] = useState('');
  const [plug, setPlug] = useState('');
  const [plate, setPlate] = useState('');

  const selectedMake = EV_MAKES.find(m => m.make === make);

  const handleMakeChange = (val) => {
    setMake(val);
    setModel('');
    setBattery('');
    setPlug('');
  };

  const handleModelChange = (val) => {
    setModel(val);
    const m = selectedMake?.models.find(x => x.model === val);
    if (m) { setBattery(m.battery.toString()); setPlug(m.plugType); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!make || !model || !battery || !plug || !plate) return;
    addVehicle({ make, model, battery: parseFloat(battery), plugType: plug, licensePlate: plate.toUpperCase() });
    setShowForm(false);
    setMake(''); setModel(''); setBattery(''); setPlug(''); setPlate('');
  };

  return (
    <div className="space-y-8 animate-fade-in-up max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Vehicles</h1>
          <p className="text-[var(--color-text-dim)] text-sm mt-1">Register and manage your EVs</p>
        </div>
        <button
          id="add-vehicle-btn"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-medium text-sm transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 border border-cyan-500/20 animate-fade-in-up">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" /> Register New EV
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Make */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Car Make</label>
              <div className="relative">
                <select id="vehicle-make" value={make} onChange={e => handleMakeChange(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all">
                  <option value="" className="bg-[var(--color-surface)]">Select Make</option>
                  {EV_MAKES.map(m => <option key={m.make} value={m.make} className="bg-[var(--color-surface)]">{m.make}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-dim)] pointer-events-none" />
              </div>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Model</label>
              <div className="relative">
                <select id="vehicle-model" value={model} onChange={e => handleModelChange(e.target.value)}
                  disabled={!make}
                  className="w-full appearance-none px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-40">
                  <option value="" className="bg-[var(--color-surface)]">Select Model</option>
                  {selectedMake?.models.map(m => <option key={m.model} value={m.model} className="bg-[var(--color-surface)]">{m.model}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-dim)] pointer-events-none" />
              </div>
            </div>

            {/* Battery */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Battery Capacity (kWh)</label>
              <div className="relative">
                <Battery className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-dim)]" />
                <input id="vehicle-battery" type="number" step="0.1" value={battery} onChange={e => setBattery(e.target.value)}
                  placeholder="e.g. 40.5"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all" />
              </div>
            </div>

            {/* Plug */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Plug Type</label>
              <div className="relative">
                <Plug className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-dim)]" />
                <select id="vehicle-plug" value={plug} onChange={e => setPlug(e.target.value)}
                  className="w-full appearance-none pl-11 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all">
                  <option value="" className="bg-[var(--color-surface)]">Select Plug</option>
                  <option value="CCS2" className="bg-[var(--color-surface)]">CCS2</option>
                  <option value="Type 2" className="bg-[var(--color-surface)]">Type 2</option>
                  <option value="CHAdeMO" className="bg-[var(--color-surface)]">CHAdeMO</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-dim)] pointer-events-none" />
              </div>
            </div>

            {/* License Plate */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">License Plate</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-dim)]" />
                <input id="vehicle-plate" type="text" value={plate} onChange={e => setPlate(e.target.value)}
                  placeholder="e.g. KA01AB1234"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all uppercase" />
              </div>
            </div>

            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-dim)] hover:text-white hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button id="vehicle-save" type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium text-sm transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
                Save Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle List */}
      {vehicles.length === 0 && !showForm ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <Car className="w-16 h-16 text-[var(--color-text-dim)] mx-auto mb-4 opacity-30" />
          <p className="text-xl font-medium text-[var(--color-text-dim)]">No vehicles registered</p>
          <p className="text-sm text-[var(--color-text-dim)] mt-2 opacity-60">Add your EV to get personalized charging recommendations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vehicles.map((v, i) => (
            <div key={v.id} className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group"
              style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                    <Car className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{v.make} {v.model}</h3>
                    <p className="text-xs text-[var(--color-text-dim)] font-mono mt-0.5">{v.licensePlate}</p>
                  </div>
                </div>
                <button onClick={() => removeVehicle(v.id)}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--color-text-dim)] hover:text-red-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-dim)]">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  {v.battery} kWh
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-dim)]">
                  <Plug className="w-4 h-4 text-amber-400" />
                  {v.plugType}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
