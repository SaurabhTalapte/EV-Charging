import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Zap, Receipt, ChevronRight } from 'lucide-react';

export default function HistoryPage() {
  const { bookings, stations, receipts } = useApp();

  const history = bookings.filter(b => b.status === 'completed').sort((a,b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Charging History</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">Review your past sessions and receipts</p>
      </div>

      {history.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <Receipt className="w-16 h-16 text-[var(--color-text-dim)] mx-auto mb-4 opacity-30" />
          <p className="text-xl font-medium text-[var(--color-text-dim)]">No history found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(b => {
            const station = stations.find(s => s.id === b.stationId);
            const receipt = receipts.find(r => r.bookingId === b.id);
            return (
              <div key={b.id} className="glass rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{station?.name || 'Unknown Station'}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[var(--color-text-dim)]">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {b.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {station?.address}</span>
                  </div>
                </div>
                {receipt && (
                  <div className="text-right w-full sm:w-auto shrink-0 pt-4 sm:pt-0 border-t border-white/10 sm:border-0">
                    <p className="text-lg font-bold text-emerald-400">₹{receipt.total.toFixed(2)}</p>
                    <p className="text-xs text-[var(--color-text-dim)] mt-1">{receipt.energy} kWh delivered</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
