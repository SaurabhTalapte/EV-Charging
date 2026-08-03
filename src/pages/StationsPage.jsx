import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { PulseBadge } from '../components/ModernAnimations';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin, List, Map, Zap, Star, Navigation,
  Clock, ChevronRight, Search
} from 'lucide-react';

const createIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="
    width:36px; height:36px; border-radius:50%; background:${color};
    border:3px solid rgba(255,255,255,0.9); display:flex; align-items:center;
    justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,0.4);
  "><svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const ICONS = {
  available: createIcon('linear-gradient(135deg, #34d399, #06b6d4)'),
  occupied: createIcon('linear-gradient(135deg, #fbbf24, #f59e0b)'),
  out_of_service: createIcon('linear-gradient(135deg, #f87171, #ef4444)'),
};

const STATUS_CONFIG = {
  available: { label: 'Available', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  occupied: { label: 'Occupied', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  out_of_service: { label: 'Out of Service', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export default function StationsPage() {
  const { stations } = useApp();
  const [viewMode, setViewMode] = useState('map');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = stations;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
    }
    if (filter === 'dc') {
      list = list.filter(s => s.connectors.some(c => c.power >= 50));
    } else if (filter === 'ac') {
      list = list.filter(s => s.connectors.some(c => c.power < 50));
    }
    return list;
  }, [stations, filter, search]);

  const center = [12.9716, 77.5946];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Charging Stations</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">Find and book nearby charging points</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-dim)]" />
          <input
            id="station-search"
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search stations by name or address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/5 p-1 gap-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'dc', label: '⚡ DC Fast' },
            { key: 'ac', label: '🔌 AC Regular' },
          ].map(f => (
            <motion.button
              key={f.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f.key
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-[var(--color-text-dim)] hover:text-white'
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/5 p-1 gap-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-[var(--color-text-dim)] hover:text-white'}`}
          >
            <Map className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-[var(--color-text-dim)] hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          style={{ height: '450px' }}
        >
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            {filtered.map(s => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={ICONS[s.status]}>
                <Popup>
                  <div className="min-w-[200px] p-1">
                    <h3 className="font-bold text-base mb-1">{s.name}</h3>
                    <p className="text-xs opacity-70 mb-2">{s.address}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <PulseBadge status={s.status}>
                        <span className="text-xs font-semibold">{STATUS_CONFIG[s.status].label}</span>
                      </PulseBadge>
                      <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400 ml-auto">
                        <Star className="w-3 h-3 fill-amber-400" /> {s.rating}
                      </span>
                    </div>
                    <Link to={`/stations/${s.id}`}
                      className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-xs font-semibold transition-colors">
                      View Details <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>
      )}

      {/* List View */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-[var(--color-text-dim)] uppercase tracking-wider">{filtered.length} Station{filtered.length !== 1 ? 's' : ''} Found</p>
        <AnimatePresence>
          {filtered.map((s, i) => {
            const bestConnector = s.connectors.reduce((a, b) => a.power > b.power ? a : b);
            const cheapest = s.connectors.reduce((a, b) => a.price < b.price ? a : b);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link to={`/stations/${s.id}`}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="glass rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 flex flex-col sm:flex-row gap-4 transition-all group shadow-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          s.status === 'available' ? 'bg-emerald-500/10' : s.status === 'occupied' ? 'bg-amber-500/10' : 'bg-red-500/10'
                        }`}>
                          <Zap className={`w-5 h-5 ${
                            s.status === 'available' ? 'text-emerald-400 animate-electric' : s.status === 'occupied' ? 'text-amber-400' : 'text-red-400'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors truncate">{s.name}</h3>
                          <p className="text-sm text-[var(--color-text-dim)] truncate">{s.address}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <PulseBadge status={s.status}>
                          <span className="text-xs font-semibold text-white">{STATUS_CONFIG[s.status].label}</span>
                        </PulseBadge>
                        <span className="flex items-center gap-1 text-xs text-[var(--color-text-dim)]">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {s.rating} ({s.totalReviews})
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[var(--color-text-dim)]">
                          <Navigation className="w-3 h-3 text-cyan-400" /> {s.distance} km
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[var(--color-text-dim)]">
                          <Clock className="w-3 h-3" /> {s.operatingHours}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">Starting At</p>
                        <p className="text-sm font-bold text-emerald-400">₹{cheapest.price}/kWh</p>
                      </div>
                      {s.status === 'available' ? (
                        <Link
                          to={`/book/${s.id}`}
                          onClick={e => e.stopPropagation()}
                          className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold text-xs transition-colors border border-cyan-500/30 flex items-center gap-1 mt-1"
                        >
                          <Zap className="w-3.5 h-3.5" /> Book Slot
                        </Link>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[var(--color-text-dim)] text-xs mt-1">
                          Full
                        </span>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
