import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { GlassTiltCard, AnimatedCounter } from '../components/ModernAnimations';
import {
  Zap, Car, MapPin, Battery, Clock, Receipt,
  TrendingUp, ChevronRight, Sparkles
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { user, vehicles, bookings, stations, receipts } = useApp();

  const totalSessions = bookings.filter(b => b.status === 'completed').length;
  const totalSpent = receipts.reduce((sum, r) => sum + (r.total || 0), 0);
  const availableStations = stations.filter(s => s.status === 'available').length;

  const stats = [
    { label: 'My Vehicles', value: vehicles.length, icon: Car, color: 'from-cyan-500 to-blue-500', link: '/vehicles', prefix: '', suffix: '' },
    { label: 'Sessions', value: totalSessions, icon: Zap, color: 'from-violet-500 to-purple-500', link: '/history', prefix: '', suffix: '' },
    { label: 'Available Stations', value: availableStations, icon: MapPin, color: 'from-emerald-500 to-teal-500', link: '/stations', prefix: '', suffix: '' },
    { label: 'Total Spent', value: Math.round(totalSpent), icon: Receipt, color: 'from-amber-500 to-orange-500', link: '/history', prefix: '₹', suffix: '' },
  ];

  const recentBookings = bookings.slice(-3).reverse();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">{user?.name}</span> 👋
        </h1>
        <p className="text-[var(--color-text-dim)] mt-1">Here&apos;s your EV charging overview</p>
      </motion.div>

      {/* 3D Glass Tilt Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, link, prefix, suffix }) => (
          <Link key={label} to={link}>
            <GlassTiltCard className="rounded-2xl p-5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-dim)] uppercase tracking-wider">{label}</p>
                  <p className="text-3xl font-extrabold mt-2 font-mono tracking-tight text-white">
                    <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-xs text-[var(--color-text-dim)] group-hover:text-cyan-400 transition-colors">
                View details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassTiltCard>
          </Link>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/stations">
            <GlassTiltCard className="rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-white/10 hover:border-cyan-500/40 group shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <p className="font-semibold">Find Stations</p>
                <p className="text-xs text-[var(--color-text-dim)] mt-1">Browse nearby charging stations</p>
              </div>
            </GlassTiltCard>
          </Link>

          <Link to="/vehicles">
            <GlassTiltCard className="rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-white/10 hover:border-violet-500/40 group shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Car className="w-7 h-7 text-violet-400" />
              </div>
              <div>
                <p className="font-semibold">Add Vehicle</p>
                <p className="text-xs text-[var(--color-text-dim)] mt-1">Register your EV details</p>
              </div>
            </GlassTiltCard>
          </Link>

          <Link to="/history">
            <GlassTiltCard className="rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-white/10 hover:border-emerald-500/40 group shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold">View History</p>
                <p className="text-xs text-[var(--color-text-dim)] mt-1">Past sessions & receipts</p>
              </div>
            </GlassTiltCard>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" /> Recent Activity
        </h2>
        {recentBookings.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center border border-white/5">
            <Battery className="w-12 h-12 text-[var(--color-text-dim)] mx-auto mb-3 opacity-40 animate-pulse" />
            <p className="text-[var(--color-text-dim)]">No charging sessions yet</p>
            <Link to="/stations" className="inline-flex items-center gap-1 mt-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              Find a station to get started <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map(b => {
              const station = stations.find(s => s.id === b.stationId);
              return (
                <motion.div
                  key={b.id}
                  whileHover={{ x: 6, scale: 1.01 }}
                  className="glass rounded-xl p-4 flex items-center gap-4 border border-white/5 hover:border-cyan-500/30 shadow-md"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                    <Zap className="w-5 h-5 animate-electric" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{station?.name || 'Unknown Station'}</p>
                    <p className="text-xs text-[var(--color-text-dim)]">{b.duration} min • {b.connector}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    b.status === 'confirmed' ? 'bg-cyan-500/10 text-cyan-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {b.status}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
