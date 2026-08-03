import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Star, MessageSquare, Heart, Send, CheckCircle2 } from 'lucide-react';

export default function FeedbackPage() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { addReview, stations } = useApp();

  const station = stations.find(s => s.id === stationId);

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setLoading(true);
    
    await new Promise(r => setTimeout(r, 800));

    addReview({
      stationId: stationId || station?.id || 'st-1',
      rating,
      text: review || 'Great EV charging experience! Fast speeds and clean amenities.',
      tags: ['Fast Charging', 'Clean Station', 'Great Amenities']
    });

    setLoading(false);
    setSubmitted(true);
    
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6 mt-6"
    >
      <div className="text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          <Heart className="w-8 h-8" />
        </motion.div>
        <h1 className="text-2xl font-bold">How was your charge?</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">
          {station ? `Rate your experience at ${station.name}` : 'Rate your charging experience'}
        </p>
      </div>

      {submitted ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-2xl p-8 border border-emerald-500/30 text-center space-y-3"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Thank You for Your Feedback!</h2>
          <p className="text-sm text-[var(--color-text-dim)]">Your review helps other EV drivers in the community.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 border border-white/10 space-y-6 shadow-xl">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="p-1 focus:outline-none transition-transform"
              >
                <Star className={`w-10 h-10 transition-colors ${
                  star <= (hover || rating) ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-white/20'
                }`} />
              </motion.button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Leave a review (optional)</label>
            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Tell us what you liked or how we can improve..."
              rows={4}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 transition-all resize-none text-sm"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !rating}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Submit Feedback</>}
          </motion.button>
          
          <button
            type="button"
            onClick={() => navigate('/history')}
            className="w-full py-2 text-sm text-[var(--color-text-dim)] hover:text-white transition-colors block text-center"
          >
            Skip to History
          </button>
        </form>
      )}
    </motion.div>
  );
}
