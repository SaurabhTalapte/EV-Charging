import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { GlassTiltCard, AnimatedCounter } from '../components/ModernAnimations';
import { Receipt, CheckCircle2, ShieldCheck, ChevronRight, Zap, CreditCard, QrCode, Sparkles } from 'lucide-react';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, addReceipt } = useApp();
  
  // Safe booking lookup with fallback to prevent null/blank page rendering
  const booking = bookings.find(b => String(b.id) === String(bookingId)) || bookings[0] || {
    id: bookingId || 'b-demo',
    stationId: 'st-1',
    stationName: 'Tesla Supercharger - Bandra West',
    price: 18,
    connector: 'CCS2'
  };

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('upi'); // Set default to UPI (PhonePe)

  // Form states for payment
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  // Mock calculated amounts
  const energy = 24.5;
  const price = booking?.price || 18;
  const subtotal = energy * price;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment verification
    await new Promise(r => setTimeout(r, 1500));
    
    if (addReceipt) {
      addReceipt({
        id: `RC-${Date.now()}`,
        bookingId: booking?.id || bookingId || 'b-demo',
        date: new Date().toISOString(),
        energy,
        subtotal,
        tax,
        total,
        method: method === 'upi' ? 'PhonePe UPI' : 'Credit Card'
      });
    }
    setLoading(false);
    navigate(`/feedback/${booking?.stationId || 'st-1'}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6 relative"
    >
      <div className="text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>
        <h1 className="text-2xl font-bold">Session Complete</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">Complete your EV charging payment</p>
      </div>

      <GlassTiltCard className="rounded-2xl p-6 border border-white/10 space-y-6 shadow-xl">
        <div className="pb-4 border-b border-white/10 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-dim)]">Energy Consumed</span>
            <span className="font-semibold">{energy} kWh</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-dim)]">Rate</span>
            <span className="font-semibold">₹{price}/kWh</span>
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
          <span className="text-emerald-400 font-mono tracking-tight text-xl">
            ₹<AnimatedCounter value={total} duration={1} />
          </span>
        </div>
      </GlassTiltCard>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-white/80">Select Payment Method</label>
        <div className="grid grid-cols-2 gap-3">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setMethod('upi')} 
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${method === 'upi' ? 'bg-violet-600/30 border-violet-500 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 border-white/10 text-[var(--color-text-dim)] hover:bg-white/10'}`}
          >
            <QrCode className="w-6 h-6 text-purple-400" />
            <span className="text-sm font-semibold flex items-center gap-1">
              PhonePe UPI <Sparkles className="w-3 h-3 text-purple-400" />
            </span>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setMethod('card')} 
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-white/5 border-white/10 text-[var(--color-text-dim)] hover:bg-white/10'}`}
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-sm font-medium">Credit Card</span>
          </motion.button>
        </div>
      </div>

      <form onSubmit={handlePay} className="space-y-6">
        <AnimatePresence mode="wait">
          {method === 'upi' ? (
            <motion.div
              key="upi"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 p-5 rounded-2xl bg-black/60 border border-violet-500/30 text-center shadow-2xl relative overflow-hidden"
            >
              {/* PhonePe Header Branding */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                  पे
                </div>
                <span className="font-bold text-white text-base tracking-wide">PhonePe Accepted Here</span>
              </div>

              {/* Verified Owner PhonePe QR Code Container */}
              <div className="w-64 mx-auto bg-black p-3 rounded-2xl border border-violet-500/40 shadow-inner flex flex-col items-center">
                <img 
                  src="/phonepe_qr.jpg" 
                  alt="PhonePe QR Code - SAURBH PRASHANT TALAPTE" 
                  className="w-full h-auto rounded-xl object-contain shadow-lg hover:scale-105 transition-transform"
                />
                <p className="text-xs font-bold text-slate-200 mt-2 font-mono tracking-wider">
                  SAURBH PRASHANT TALAPTE
                </p>
                <p className="text-[10px] text-purple-400 mt-0.5">Scan & Pay Using Any UPI App</p>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-[var(--color-text-dim)] text-xs">OR ENTER VPA</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div className="text-left">
                <label className="block text-xs text-[var(--color-text-dim)] mb-1">Enter PhonePe / UPI VPA</label>
                <input 
                  type="text" 
                  placeholder="saurabh@ybl / mobile@upi" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60 transition-colors font-mono"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div>
                <label className="block text-xs text-[var(--color-text-dim)] mb-1">Card Number</label>
                <input 
                  type="text" 
                  placeholder="4532 •••• •••• 8899" 
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--color-text-dim)] mb-1">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="12/28" 
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-text-dim)] mb-1">CVV</label>
                  <input 
                    type="password" 
                    placeholder="•••" 
                    required
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading} 
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 relative overflow-hidden text-base"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><ShieldCheck className="w-5 h-5" /> Confirm Payment ₹{total.toFixed(2)}</>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
