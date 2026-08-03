import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Zap, BatteryCharging, StopCircle, ChevronRight, ShieldCheck, Sparkles
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
      }, 800);
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

  const energyDelivered = (progress * 0.4).toFixed(1);
  const estimatedCost = (energyDelivered * booking.price).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto space-y-6 relative"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2 border border-cyan-500/20"
        >
          <Zap className="w-3.5 h-3.5 animate-electric" /> LIVE SESSION #{booking.id}
        </motion.div>
        <h1 className="text-2xl font-bold">Charging Session</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">{station.name} • {booking.connector}</p>
      </div>

      <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center border border-cyan-500/20 relative overflow-hidden shadow-2xl">
        {/* Animated Neon Background Glow */}
        <motion.div
          animate={{
            scale: sessionActive ? [1, 1.1, 1] : 1,
            opacity: sessionActive ? [0.15, 0.35, 0.15] : 0.05
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-violet-500 to-transparent blur-3xl pointer-events-none"
        />

        {/* Floating Sparks */}
        {sessionActive && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 200, x: Math.random() * 300 - 150, opacity: 0 }}
                animate={{ y: -50, opacity: [0, 0.8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5 + Math.random() * 1.5,
                  delay: i * 0.4,
                  ease: 'easeOut'
                }}
                className="absolute bottom-0 w-2 h-2 rounded-full bg-cyan-400 blur-[1px]"
              />
            ))}
          </div>
        )}

        {/* Progress Circular Ring */}
        <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="112" cy="112" r="98" className="stroke-white/10" strokeWidth="14" fill="none" />
            <motion.circle
              cx="112"
              cy="112"
              r="98"
              className="stroke-cyan-400"
              strokeWidth="14"
              fill="none"
              strokeDasharray={615}
              initial={{ strokeDashoffset: 615 }}
              animate={{ strokeDashoffset: 615 - (615 * progress) / 100 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              strokeLinecap="round"
              style={{ filter: sessionActive ? 'drop-shadow(0 0 10px #22d3ee)' : 'none' }}
            />
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={Math.round(progress)}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"
            >
              {Math.round(progress)}%
            </motion.span>
            <span className="text-xs font-semibold text-[var(--color-text-dim)] flex items-center gap-1 mt-1">
              <Zap className={`w-3.5 h-3.5 ${sessionActive ? 'text-cyan-400 animate-electric' : 'text-slate-500'}`} />
              {sessionActive ? 'Charging Active' : 'Session Stopped'}
            </span>
          </div>
        </div>

        {/* Live Stats Row */}
        <div className="w-full grid grid-cols-3 gap-4 text-center divide-x divide-white/10 border-t border-white/10 pt-6">
          <div>
            <p className="text-xs text-[var(--color-text-dim)] mb-1">Energy Delivered</p>
            <p className="font-bold text-lg font-mono">{energyDelivered} <span className="text-xs font-normal text-slate-400">kWh</span></p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-dim)] mb-1">Power Rate</p>
            <p className="font-bold text-lg font-mono text-cyan-400">{sessionActive ? `${booking.power} kW` : '0 kW'}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-dim)] mb-1">Estimated Cost</p>
            <p className="font-bold text-lg font-mono text-amber-400">₹{estimatedCost}</p>
          </div>
        </div>
      </div>

      {/* Button Controls */}
      <div className="flex gap-4">
        {sessionActive ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStop}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold transition-all border border-red-500/30 shadow-lg shadow-red-500/10"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
            ) : (
              <><StopCircle className="w-5 h-5" /> Stop Charging</>
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/payment/${booking.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-semibold transition-all shadow-xl shadow-cyan-500/25"
          >
            Proceed to Payment <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
