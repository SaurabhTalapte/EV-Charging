import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
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
    { label: 'My Vehicles', value: vehicles.length, icon: Car, color: 'from-cyan-500 to-blue-500', link: '/vehicles' },
    { label: 'Sessions', value: totalSessions, icon: Zap, color: 'from-violet-500 to-purple-500', link: '/history' },
    { label: 'Available Stations', value: availableStations, icon: MapPin, color: 'from-emerald-500 to-teal-500', link: '/stations' },
    { label: 'Total Spent', value: `₹${totalSpent.toFixed(0)}`, icon: Receipt, color: 'from-amber-500 to-orange-500', link: '/history' },
  ];

  const recentBookings = bookings.slice(-3).reverse();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative"
    >
      {/* Ambient background particles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none animate-float-slow" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none animate-float-reverse" />

      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">{user?.name}</span> 👋
        </h1>
        <p className="text-[var(--color-text-dim)] mt-1">Here&apos;s your EV charging overview</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link}>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-dim)]">{label}</p>
                  <p className="text-3xl font-bold mt-2 font-mono">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-[var(--color-text-dim)] group-hover:text-cyan-400 transition-colors">
                View details <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
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
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-white/5 hover:border-cyan-500/40 group shadow-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <p className="font-semibold">Find Stations</p>
                <p className="text-xs text-[var(--color-text-dim)] mt-1">Browse nearby charging stations</p>
              </div>
            </motion.div>
          </Link>

          <Link to="/vehicles">
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-white/5 hover:border-violet-500/40 group shadow-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Car className="w-7 h-7 text-violet-400" />
              </div>
              <div>
                <p className="font-semibold">Add Vehicle</p>
                <p className="text-xs text-[var(--color-text-dim)] mt-1">Register your EV details</p>
              </div>
            </motion.div>
          </Link>

          <Link to="/history">
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-white/5 hover:border-emerald-500/40 group shadow-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold">View History</p>
                <p className="text-xs text-[var(--color-text-dim)] mt-1">Past sessions & receipts</p>
              </div>
            </motion.div>
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
                  whileHover={{ x: 4 }}
                  className="glass rounded-xl p-4 flex items-center gap-4 border border-white/5 hover:border-white/10"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                    <Zap className="w-5 h-5 animate-pulse" />
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
