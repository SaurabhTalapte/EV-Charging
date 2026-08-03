import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin, List, Map, Filter, Zap, Star, Navigation,
  Clock, ChevronRight, Search
} from 'lucide-react';

// Custom marker icons
const createIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="
    width:36px; height:36px; border-radius:50%; background:${color};
    border:3px solid rgba(255,255,255,0.9); display:flex; align-items:center;
    justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.3);
  "><svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>`,
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
  const [filter, setFilter] = useState('all'); // all | dc | ac
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
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Charging Stations</h1>
        <p className="text-[var(--color-text-dim)] text-sm mt-1">Find and book nearby charging points</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-dim)]" />
          <input
            id="station-search"
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search stations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          {[
            { key: 'all', label: 'All' },
            { key: 'dc', label: '⚡ DC Fast' },
            { key: 'ac', label: '🔌 AC Regular' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 text-xs font-medium transition-all ${
                filter === f.key
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-[var(--color-text-dim)] hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          <button onClick={() => setViewMode('map')}
            className={`p-2.5 transition-all ${viewMode === 'map' ? 'bg-cyan-500/20 text-cyan-400' : 'text-[var(--color-text-dim)] hover:bg-white/5'}`}>
            <Map className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')}
            className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-[var(--color-text-dim)] hover:bg-white/5'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="rounded-2xl overflow-hidden border border-white/5" style={{ height: '450px' }}>
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {filtered.map(s => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={ICONS[s.status]}>
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-bold text-base mb-1">{s.name}</h3>
                    <p className="text-xs opacity-70 mb-2">{s.address}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_CONFIG[s.status].class}`}>
                        {STATUS_CONFIG[s.status].label}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {s.rating}
                      </span>
                    </div>
                    <Link to={`/stations/${s.id}`}
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                      View Details <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* List View */}
      <div className={viewMode === 'list' ? 'space-y-4' : 'space-y-4 mt-2'}>
        <p className="text-sm text-[var(--color-text-dim)]">{filtered.length} station{filtered.length !== 1 ? 's' : ''} found</p>
        {filtered.map((s, i) => {
          const bestConnector = s.connectors.reduce((a, b) => a.power > b.power ? a : b);
          const cheapest = s.connectors.reduce((a, b) => a.price < b.price ? a : b);
          return (
            <Link key={s.id} to={`/stations/${s.id}`}
              className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 flex flex-col sm:flex-row gap-4 transition-all group block"
              style={{ animationDelay: `${i * 50}ms` }}>
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    s.status === 'available' ? 'bg-emerald-500/10' : s.status === 'occupied' ? 'bg-amber-500/10' : 'bg-red-500/10'
                  }`}>
                    <Zap className={`w-5 h-5 ${
                      s.status === 'available' ? 'text-emerald-400' : s.status === 'occupied' ? 'text-amber-400' : 'text-red-400'
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors truncate">{s.name}</h3>
                    <p className="text-sm text-[var(--color-text-dim)] truncate">{s.address}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[s.status].class}`}>
                    {STATUS_CONFIG[s.status].label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--color-text-dim)]">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {s.rating} ({s.totalReviews})
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--color-text-dim)]">
                    <Navigation className="w-3 h-3" /> {s.distance} km
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--color-text-dim)]">
                    <Clock className="w-3 h-3" /> {s.operatingHours}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-dim)]">Up to</p>
                  <p className="text-lg font-bold text-cyan-400">{bestConnector.power} kW</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-dim)]">From</p>
                  <p className="text-sm font-semibold">₹{cheapest.price}/kWh</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
