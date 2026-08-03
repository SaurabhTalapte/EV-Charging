import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Calendar, Clock, Zap, Battery, Car, Plug, AlertCircle, CheckCircle2, ChevronLeft
} from 'lucide-react';

export default function BookingPage() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { stations, vehicles, addBooking } = useApp();
  
  const station = stations.find(s => s.id === stationId);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]?.id || '');
  const [selectedConnector, setSelectedConnector] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('30'); // minutes
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  if (!station) {
    return <div className="text-center py-20 text-[var(--color-text-dim)]">Station not found</div>;
  }

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !selectedConnector || !date || !time) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const v = vehicles.find(x => x.id === selectedVehicle);
    const c = station.connectors.find(x => x.type === selectedConnector);
    
    const bookingId = `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    addBooking({
      id: bookingId,
      stationId: station.id,
      vehicleId: v.id,
      connector: c.type,
      date,
      time,
      duration: parseInt(duration),
      status: 'confirmed',
      power: c.power,
      price: c.price
    });
    
    setLoading(false);
    navigate(`/charging/${bookingId}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[var(--color-text-dim)] hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Station
      </button>

      <div>
        <h1 className="text-2xl font-bold">Book Charging Slot</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">Reserve a connector at {station.name}</p>
      </div>

      <div className="glass rounded-2xl p-6 md:p-8 border border-white/5">
        {vehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car className="w-12 h-12 text-[var(--color-text-dim)] mx-auto mb-4 opacity-50" />
            <p className="text-[var(--color-text-dim)] mb-4">You need to register a vehicle first.</p>
            <button onClick={() => navigate('/vehicles')} className="px-6 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 font-medium">
              Add Vehicle
            </button>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-6">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-3">Select Vehicle</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVehicle(v.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      selectedVehicle === v.id
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-[var(--color-text-dim)] hover:bg-white/10'
                    }`}
                  >
                    <Car className={`w-5 h-5 ${selectedVehicle === v.id ? 'text-cyan-400' : ''}`} />
                    <div>
                      <p className="font-semibold text-sm">{v.make} {v.model}</p>
                      <p className="text-xs opacity-70">{v.licensePlate}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Connector Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-3">Select Connector</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {station.connectors.map(c => (
                  <button
                    key={c.type}
                    type="button"
                    onClick={() => setSelectedConnector(c.type)}
                    disabled={c.available === 0}
                    className={`flex flex-col gap-2 p-4 rounded-xl border text-left transition-all ${
                      c.available === 0
                        ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                        : selectedConnector === c.type
                          ? 'bg-violet-500/10 border-violet-500/50 text-white'
                          : 'bg-white/5 border-white/10 text-[var(--color-text-dim)] hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Plug className={`w-5 h-5 ${selectedConnector === c.type ? 'text-violet-400' : ''}`} />
                      {c.available > 0 ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Available</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">In Use</span>
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
                <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-dim)]" />
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Arrival Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-dim)]" />
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Estimated Duration</label>
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                {['15', '30', '45', '60'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2 text-sm rounded-lg transition-all ${
                      duration === d ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-[var(--color-text-dim)] hover:text-white'
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">
                Please arrive within 15 minutes of your booked time. Your slot will be automatically released if you fail to connect your vehicle.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedVehicle || !selectedConnector || !time}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-semibold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Confirm Booking <CheckCircle2 className="w-5 h-5" /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
