import { createContext, useContext, useState, useEffect } from 'react';
import { STATIONS } from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEY = 'ev-chargehub-state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function AppProvider({ children }) {
  const saved = loadState();

  const [user, setUser] = useState(saved?.user || null);
  const [vehicles, setVehicles] = useState(saved?.vehicles || []);
  const [bookings, setBookings] = useState(saved?.bookings || []);
  const [reviews, setReviews] = useState(saved?.reviews || []);
  const [receipts, setReceipts] = useState(saved?.receipts || []);
  const [stations, setStations] = useState(STATIONS);

  // Persist state changes
  useEffect(() => {
    saveState({ user, vehicles, bookings, reviews, receipts });
  }, [user, vehicles, bookings, reviews, receipts]);

  // Auth
  const login = (email, password) => {
    const u = { id: 'u-' + Date.now(), email, name: email.split('@')[0], avatar: null };
    setUser(u);
    return u;
  };

  const signup = (name, email, password) => {
    const u = { id: 'u-' + Date.now(), email, name, avatar: null };
    setUser(u);
    return u;
  };

  const loginWithGoogle = () => {
    const u = { id: 'u-google-' + Date.now(), email: 'user@gmail.com', name: 'Google User', avatar: null };
    setUser(u);
    return u;
  };

  const logout = () => {
    setUser(null);
    setVehicles([]);
    setBookings([]);
    setReviews([]);
    setReceipts([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Vehicles
  const addVehicle = (vehicle) => {
    const v = { ...vehicle, id: 'v-' + Date.now() };
    setVehicles(prev => [...prev, v]);
    return v;
  };

  const removeVehicle = (id) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  // Bookings
  const createBooking = (booking) => {
    const b = {
      ...booking,
      id: 'b-' + Date.now(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [...prev, b]);
    return b;
  };

  const completeBooking = (bookingId) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: 'completed' } : b
    ));
  };

  // Reviews
  const addReview = (review) => {
    const r = {
      ...review,
      id: 'r-' + Date.now(),
      user: user?.name || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [...prev, r]);
    // Also add to the station
    setStations(prev => prev.map(s =>
      s.id === review.stationId
        ? { ...s, reviews: [...s.reviews, r], totalReviews: s.totalReviews + 1 }
        : s
    ));
    return r;
  };

  // Receipts
  const addReceipt = (receipt) => {
    const rc = { ...receipt, id: 'rc-' + Date.now(), date: new Date().toISOString() };
    setReceipts(prev => [...prev, rc]);
    return rc;
  };

  const value = {
    user, login, signup, loginWithGoogle, logout,
    vehicles, addVehicle, removeVehicle,
    stations,
    bookings, createBooking, completeBooking,
    reviews, addReview,
    receipts, addReceipt,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
