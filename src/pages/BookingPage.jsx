import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { GlassTiltCard } from '../components/ModernAnimations';
import {
  Calendar, Clock, Zap, Battery, Car, Plug, AlertCircle, CheckCircle2, ChevronLeft, Plus
} from 'lucide-react';

export default function BookingPage() {
  const { stationId } = useParams();
  const [searchParams] = useSearchParams();
  const preSelectedConnector = searchParams.get('connector');

  const navigate = useNavigate();
  const { stations, vehicles, createBooking, addVehicle } = useApp();
  
  const station = stations.find(s => s.id === stationId);

  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedConnector, setSelectedConnector] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('30'); // minutes
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Set default date & time & vehicle & connector
  useEffect(() => {
    // 1. Default Date to Today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);

    // 2. Default Time to current time + 15 mins (HH:MM)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    setTime(`${hours}:${mins}`);
  }, []);

  // Sync selected vehicle if empty
  useEffect(() => {
    if (!selectedVehicle && vehicles.length > 0) {
      setSelectedVehicle(vehicles[0].id);
    }
  }, [vehicles, selectedVehicle]);

  // Sync selected connector
  useEffect(() => {
    if (station && !selectedConnector) {
      if (preSelectedConnector && station.connectors.some(c => c.type === preSelectedConnector && c.available > 0)) {
        setSelectedConnector(preSelectedConnector);
      } else {
        const availableConnector = station.connectors.find(c => c.available > 0);
        if (availableConnector) {
          setSelectedConnector(availableConnector.type);
        }
      }
    }
  }, [station, preSelectedConnector, selectedConnector]);

  if (!station) {
    return (
      <div className="text-center py-20 text-[var(--color-text-dim)]">
        <p className="text-lg">Station not found</p>
        <button onClick={() => navigate('/stations')} className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-sm">
          ← Back to Stations
        </button>
      </div>
    );
  }

  const handleQuickAddVehicle = () => {
    const newV = addVehicle({
      make: 'Tata',
      model: 'Nexon EV Max',
      year: 2024,
      licensePlate: 'MH-12-EV-9999',
      batteryCapacity: 40.5,
      connectorType: 'CCS2'
    });
    setSelectedVehicle(newV.id);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedVehicle) {
      setErrorMsg('Please select or add a vehicle.');
      return;
    }
    if (!selectedConnector) {
      setErrorMsg('Please select an available connector type.');
      return;
    }
    if (!date || !time) {
      setErrorMsg('Please select arrival date and time.');
      return;
    }

    setLoading(true);
    
    // Simulate booking API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const v = vehicles.find(x => x.id === selectedVehicle);
    const c = station.connectors.find(x => x.type === selectedConnector);

    if (!c) {
      setErrorMsg('Invalid connector selected.');
      setLoading(false);
      return;
    }
    
    // Call context function to persist booking
    const newBooking = createBooking({
      stationId: station.id,
      stationName: station.name,
      stationAddress: station.address,
      vehicleId: v ? v.id : 'v-demo',
      vehicleName: v ? `${v.make} ${v.model}` : 'EV Vehicle',
      connector: c.type,
      date,
      time,
      duration: parseInt(duration),
      power: c.power,
      price: c.price
    });
    
    setLoading(false);

    // Navigate using the returned booking ID
    navigate(`/charging/${newBooking.id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm text-[var(--color-text-dim)] hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Station
      </button>

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6 text-cyan-400" /> Book Charging Slot
        </h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">Reserve your fast charger at <span className="text-white font-medium">{station.name}</span></p>
      </div>

      <GlassTiltCard className="rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
        <form onSubmit={handleBook} className="space-y-6">
          
          {/* Error Banner */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vehicle Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-white/90">Select Vehicle</label>
              {vehicles.length === 0 && (
                <button
                  type="button"
                  onClick={handleQuickAddVehicle}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Quick Add Demo EV
                </button>
              )}
            </div>

            {vehicles.length === 0 ? (
              <div className="p-5 rounded-xl bg-white/5 border border-dashed border-white/20 text-center">
                <Car className="w-8 h-8 text-[var(--color-text-dim)] mx-auto mb-2 opacity-60" />
                <p className="text-sm text-[var(--color-text-dim)] mb-3">No registered vehicles found.</p>
                <button
                  type="button"
                  onClick={handleQuickAddVehicle}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 font-semibold text-xs hover:bg-cyan-500/30 transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Demo Nexon EV
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVehicle(v.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      selectedVehicle === v.id
                        ? 'bg-cyan-500/20 border-cyan-500/60 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                        : 'bg-white/5 border-white/10 text-[var(--color-text-dim)] hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${selectedVehicle === v.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-400'}`}>
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{v.make} {v.model}</p>
                      <p className="text-xs opacity-70">{v.licensePlate || 'EV Vehicle'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Connector Selection */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">Select Connector Port</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {station.connectors.map(c => (
                <button
                  key={c.type}
                  type="button"
                  onClick={() => c.available > 0 && setSelectedConnector(c.type)}
                  disabled={c.available === 0}
                  className={`flex flex-col gap-2 p-4 rounded-xl border text-left transition-all ${
                    c.available === 0
                      ? 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed'
                      : selectedConnector === c.type
                        ? 'bg-violet-500/20 border-violet-500/60 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                        : 'bg-white/5 border-white/10 text-[var(--color-text-dim)] hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Plug className={`w-5 h-5 ${selectedConnector === c.type ? 'text-violet-400' : 'text-slate-400'}`} />
                    {c.available > 0 ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {c.available} Available
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                        In Use
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{c.type}</p>
                    <p className="text-xs opacity-70">{c.power} kW • ₹{c.price}/kWh</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Arrival Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Arrival Time</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Estimated Duration</label>
            <div className="grid grid-cols-4 gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
              {['15', '30', '45', '60'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    duration === d ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm' : 'text-[var(--color-text-dim)] hover:text-white'
                  }`}
                >
                  {d} Mins
                </button>
              ))}
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 flex gap-3 items-center">
            <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0" />
            <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">
              Your slot will be reserved for 15 minutes past your arrival time.
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-semibold transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 text-base"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Confirm & Start Charging Session <CheckCircle2 className="w-5 h-5" /></>
            )}
          </motion.button>
        </form>
      </GlassTiltCard>
    </motion.div>
  );
}
