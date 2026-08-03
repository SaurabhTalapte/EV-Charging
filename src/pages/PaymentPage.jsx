import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Receipt, CheckCircle2, ShieldCheck, ChevronRight, Zap } from 'lucide-react';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, addReceipt } = useApp();
  
  const booking = bookings.find(b => b.id === bookingId);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('card');

  if (!booking) return null;

  // Mock calculated amounts
  const energy = 24.5;
  const subtotal = energy * booking.price;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    addReceipt({
      id: `RC-${Date.now()}`,
      bookingId,
      date: new Date().toISOString(),
      energy,
      subtotal,
      tax,
      total,
      method
    });
    setLoading(false);
    navigate(`/feedback/${booking.stationId}`);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in-up">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Session Complete</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">Please complete your payment</p>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
        <div className="pb-4 border-b border-white/10 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-dim)]">Energy Consumed</span>
            <span className="font-semibold">{energy} kWh</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-dim)]">Rate</span>
            <span className="font-semibold">₹{booking.price}/kWh</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-dim)]">Subtotal</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-dim)]">Taxes & Fees (18%)</span>
            <span className="font-semibold">₹{tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Amount</span>
          <span className="text-emerald-400">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--color-text-dim)]">Payment Method</label>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setMethod('card')} className={`p-4 rounded-xl border text-center transition-all ${method === 'card' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-[var(--color-text-dim)]'}`}>Credit Card</button>
          <button onClick={() => setMethod('upi')} className={`p-4 rounded-xl border text-center transition-all ${method === 'upi' ? 'bg-violet-500/10 border-violet-500/50 text-violet-400' : 'bg-white/5 border-white/10 text-[var(--color-text-dim)]'}`}>UPI</button>
        </div>
      </div>

      <button onClick={handlePay} disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Pay Securely</>}
      </button>
    </div>
  );
}
