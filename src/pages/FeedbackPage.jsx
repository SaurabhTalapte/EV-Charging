import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Heart, Send } from 'lucide-react';

export default function FeedbackPage() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    // In a real app, save review
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in-up mt-10">
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">How was your charge?</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">Rate your experience at the station</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 border border-white/5 space-y-6">
        <div className="flex justify-center gap-2">
          {[1,2,3,4,5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star className={`w-10 h-10 transition-colors ${
                star <= (hover || rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20'
              }`} />
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Leave a review (optional)</label>
          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder="Tell us what you liked or how we can improve..."
            rows={4}
            className="w-full p-4 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !rating}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Submit Feedback</>}
        </button>
        
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full py-3 text-sm text-[var(--color-text-dim)] hover:text-white transition-colors"
        >
          Skip for now
        </button>
      </form>
    </div>
  );
}
