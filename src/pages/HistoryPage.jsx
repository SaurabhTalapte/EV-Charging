import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Zap, Receipt, CheckCircle2, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HistoryPage() {
  const { bookings, stations, receipts } = useApp();

  const history = bookings.filter(b => b.status === 'completed' || b.status === 'confirmed').sort((a,b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="w-6 h-6 text-cyan-400" /> Charging History & Receipts
          </h1>
          <p className="text-[var(--color-text-dim)] text-sm mt-1">Review your past charging sessions, energy logs, and receipts</p>
        </div>
        <Link to="/stations" className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/30 transition-all flex items-center gap-1">
          Book New Charging <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5 space-y-3">
          <Receipt className="w-16 h-16 text-[var(--color-text-dim)] mx-auto mb-4 opacity-30" />
          <p className="text-xl font-medium text-white">No history found</p>
          <p className="text-sm text-[var(--color-text-dim)]">You haven't completed any EV charging sessions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(b => {
            const station = stations.find(s => s.id === b.stationId);
            const receipt = receipts.find(r => r.bookingId === b.id);
            const isCompleted = b.status === 'completed';

            return (
              <motion.div 
                whileHover={{ y: -2 }}
                key={b.id} 
                className="glass rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{b.stationName || station?.name || 'Charging Station'}</h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse'
                      }`}>
                        {isCompleted ? 'Completed' : 'Active Session'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[var(--color-text-dim)]">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> {b.date || 'Today'} • {b.time || '12:00'}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-violet-400" /> {b.stationAddress || station?.address || 'City Center'}</span>
                      <span className="flex items-center gap-1 font-mono text-slate-300">Connector: {b.connector || 'CCS2'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t border-white/10 sm:border-0 flex sm:flex-col justify-between items-center sm:items-end">
                  {receipt ? (
                    <div>
                      <p className="text-xl font-bold text-emerald-400 font-mono">₹{receipt.total.toFixed(2)}</p>
                      <p className="text-xs text-[var(--color-text-dim)] mt-0.5">{receipt.energy} kWh • Paid via {receipt.method?.toUpperCase() || 'CARD'}</p>
                    </div>
                  ) : isCompleted ? (
                    <div>
                      <p className="text-lg font-bold text-emerald-400 font-mono">₹{(24.5 * (b.price || 15)).toFixed(2)}</p>
                      <p className="text-xs text-[var(--color-text-dim)] mt-0.5">24.5 kWh Delivered</p>
                    </div>
                  ) : (
                    <Link to={`/charging/${b.id}`} className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold text-xs border border-cyan-500/30 flex items-center gap-1">
                      Resume Session <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
