import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap, LayoutDashboard, Car, MapPin, History, LogOut,
  Menu, X, ChevronRight, User
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vehicles', icon: Car, label: 'My Vehicles' },
  { to: '/stations', icon: MapPin, label: 'Stations' },
  { to: '/history', icon: History, label: 'History' },
];

export default function Layout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 flex flex-col
        glass border-r border-white/5
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center animate-pulse-glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              EV ChargeHub
            </h1>
            <p className="text-[10px] text-[var(--color-text-dim)] tracking-widest uppercase">Smart Charging</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 rounded-lg hover:bg-white/5 text-[var(--color-text-dim)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-violet-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-[var(--color-text-dim)] hover:bg-white/5 hover:text-white border border-transparent'
                }
              `}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Guest'}</p>
              <p className="text-xs text-[var(--color-text-dim)] truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--color-text-dim)] hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-white/5 glass shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-[var(--color-text-dim)]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-dim)]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
