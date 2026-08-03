import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap, BatteryCharging, Clock, StopCircle, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function ChargingSessionPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, stations, updateBookingStatus } = useApp();
  
  const booking = bookings.find(b => b.id === bookingId);
  const station = stations.find(s => s.id === booking?.stationId);

  const [progress, setProgress] = useState(0);
  const [sessionActive, setSessionActive] = useState(booking?.status === 'confirmed');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (sessionActive && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + (Math.random() * 2 + 1), 100));
      }, 1000);
    } else if (progress >= 100 && sessionActive) {
      handleStop();
    }
    return () => clearInterval(interval);
  }, [sessionActive, progress]);

  if (!booking || !station) {
    return <div className="text-center py-20 text-[var(--color-text-dim)]">Session not found</div>;
  }

  const handleStop = async () => {
    setLoading(true);
    setSessionActive(false);
    await new Promise(r => setTimeout(r, 1000));
    updateBookingStatus(booking.id, 'completed');
    navigate(`/payment/${booking.id}`);
  };

  const energyDelivered = (progress * 0.4).toFixed(1); // dummy calculation
  const estimatedCost = (energyDelivered * booking.price).toFixed(2);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in-up">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Charging Session</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">{station.name} • {booking.connector}</p>
      </div>

      <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent transition-opacity duration-1000 ${sessionActive ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Progress Circle */}
        <div className="relative w-48 h-48 mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="88" className="stroke-white/10" strokeWidth="12" fill="none" />
            <circle
              cx="96"
              cy="96"
              r="88"
              className={`stroke-cyan-400 transition-all duration-500 ${sessionActive ? 'animate-pulse-glow' : ''}`}
              strokeWidth="12"
              fill="none"
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold font-mono">{Math.round(progress)}%</span>
            <span className="text-xs text-[var(--color-text-dim)] flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> {sessionActive ? 'Charging' : 'Stopped'}
            </span>
          </div>
        </div>

        {/* Live Stats */}
        <div className="w-full grid grid-cols-3 gap-4 text-center divide-x divide-white/10 border-t border-white/10 pt-6">
          <div>
            <p className="text-xs text-[var(--color-text-dim)] mb-1">Energy</p>
            <p className="font-semibold">{energyDelivered} kWh</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-dim)] mb-1">Power</p>
            <p className="font-semibold text-emerald-400">{sessionActive ? `${booking.power} kW` : '0 kW'}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-dim)] mb-1">Est. Cost</p>
            <p className="font-semibold text-amber-400">₹{estimatedCost}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {sessionActive ? (
          <button
            onClick={handleStop}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold transition-all border border-red-500/30"
          >
            {loading ? <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <><StopCircle className="w-5 h-5" /> Stop Charging</>}
          </button>
        ) : (
          <button
            onClick={() => navigate(`/payment/${booking.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 font-semibold transition-all border border-cyan-500/30"
          >
            Proceed to Payment <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
