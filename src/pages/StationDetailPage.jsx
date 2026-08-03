import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft, Star, MapPin, Clock, Zap, Plug, DollarSign,
  Navigation, Wifi, ParkingSquare, Coffee, Shield, ChevronRight, MessageSquare
} from 'lucide-react';

const AMENITY_ICONS = {
  'Wi-Fi': Wifi, 'Parking': ParkingSquare, 'Café': Coffee,
  'Security': Shield, 'Restroom': Shield, 'Lounge': Coffee,
  'Lighting': Zap, 'Vending Machine': Coffee, 'Premium Lounge': Coffee,
  'Kids Play Area': Star,
};

const STATUS_CONFIG = {
  available: { label: 'Available', dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  occupied: { label: 'Occupied', dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  out_of_service: { label: 'Out of Service', dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function StationDetailPage() {
  const { id } = useParams();
  const { stations } = useApp();
  const navigate = useNavigate();
  const station = stations.find(s => s.id === id);

  if (!station) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-[var(--color-text-dim)]">Station not found</p>
        <Link to="/stations" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">← Back to Stations</Link>
      </div>
    );
  }

  const sc = STATUS_CONFIG[station.status];
  const allReviews = station.reviews || [];

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[var(--color-text-dim)] hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Stations
      </button>

      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${sc.dot} animate-pulse`} />
              <span className={`text-sm font-medium ${sc.text}`}>{sc.label}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">{station.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[var(--color-text-dim)]">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {station.address}</span>
              <span className="flex items-center gap-1.5"><Navigation className="w-4 h-4" /> {station.distance} km away</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {station.operatingHours}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(station.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                ))}
              </div>
              <span className="text-sm font-medium">{station.rating}</span>
              <span className="text-sm text-[var(--color-text-dim)]">({station.totalReviews} reviews)</span>
            </div>
          </div>

          {station.status === 'available' && (
            <div className="shrink-0">
              <Link to={`/book/${station.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-semibold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40">
                <Zap className="w-5 h-5" /> Book Slot
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Connectors */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Connectors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {station.connectors.map((c, i) => (
            <Link
              key={i}
              to={c.available > 0 ? `/book/${station.id}?connector=${c.type}` : '#'}
              className={`glass rounded-xl p-5 border border-white/5 transition-all block ${
                c.available > 0 ? 'hover:border-cyan-500/40 hover:bg-white/5 cursor-pointer' : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Plug className="w-5 h-5 text-cyan-400" />
                  <span className="font-semibold">{c.type}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  c.available > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {c.available}/{c.total} free
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-dim)]">Power Output</span>
                  <span className="font-medium">{c.power} kW</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-dim)]">Price</span>
                  <span className="font-medium text-emerald-400">₹{c.price}/kWh</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-dim)]">Type</span>
                  <span className={`font-medium ${c.power >= 50 ? 'text-amber-400' : 'text-blue-400'}`}>
                    {c.power >= 50 ? '⚡ DC Fast' : '🔌 AC'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {station.amenities.map(a => {
            const Icon = AMENITY_ICONS[a] || Zap;
            return (
              <span key={a} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-[var(--color-text-dim)]">
                <Icon className="w-4 h-4 text-cyan-400" /> {a}
              </span>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-400" /> Community Reviews
          </h2>
          <Link to={`/feedback/${station.id}`}
            className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Write Review <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {allReviews.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center border border-white/5">
            <p className="text-[var(--color-text-dim)]">No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allReviews.map(r => (
              <div key={r.id} className="glass rounded-xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                      {r.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{r.user}</p>
                      <p className="text-xs text-[var(--color-text-dim)]">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    ))}
                  </div>
                </div>
                {r.tags && r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {r.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-[var(--color-text-dim)] leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
