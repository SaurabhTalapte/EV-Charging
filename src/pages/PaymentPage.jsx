import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { GlassTiltCard, AnimatedCounter } from '../components/ModernAnimations';
import { Receipt, CheckCircle2, ShieldCheck, ChevronRight, Zap, CreditCard, QrCode } from 'lucide-react';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, addReceipt } = useApp();
  
  const booking = bookings.find(b => b.id === bookingId);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('card'); // 'card' or 'upi'

  // Form states for mock payment
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  if (!booking) return null;

  // Mock calculated amounts
  const energy = 24.5;
  const subtotal = energy * booking.price;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6 relative"
    >
      <div className="text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>
        <h1 className="text-2xl font-bold">Session Complete</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">Please complete your payment</p>
      </div>

      <GlassTiltCard className="rounded-2xl p-6 border border-white/10 space-y-6 shadow-xl">
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
          <span className="text-emerald-400 font-mono tracking-tight">
            ₹<AnimatedCounter value={total} duration={1} />
          </span>
        </div>
      </GlassTiltCard>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-white/80">Select Payment Method</label>
        <div className="grid grid-cols-2 gap-3">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setMethod('card')} 
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-white/5 border-white/10 text-[var(--color-text-dim)] hover:bg-white/10'}`}
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-sm font-medium">Credit Card</span>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setMethod('upi')} 
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${method === 'upi' ? 'bg-violet-500/20 border-violet-500/50 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.2)]' : 'bg-white/5 border-white/10 text-[var(--color-text-dim)] hover:bg-white/10'}`}
          >
            <QrCode className="w-6 h-6" />
            <span className="text-sm font-medium">UPI</span>
          </motion.button>
        </div>
      </div>

      <form onSubmit={handlePay} className="space-y-6">
        <AnimatePresence mode="wait">
          {method === 'card' ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div>
                <label className="block text-xs text-[var(--color-text-dim)] mb-1">Card Number</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--color-text-dim)] mb-1">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
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
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upi"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                {/* Mock QR Code */}
                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MockUPIPayment')] bg-cover opacity-80" />
              </div>
              <p className="text-xs text-[var(--color-text-dim)]">Scan with any UPI app</p>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-[var(--color-text-dim)] text-xs">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div className="text-left">
                <label className="block text-xs text-[var(--color-text-dim)] mb-1">Enter UPI ID</label>
                <input 
                  type="text" 
                  placeholder="username@upi" 
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading} 
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 relative overflow-hidden"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><ShieldCheck className="w-5 h-5" /> Pay Securely ₹{total.toFixed(2)}</>
          )}
          {/* Shine effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer" />
        </motion.button>
      </form>
    </motion.div>
  );
}
