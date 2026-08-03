import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import VehiclePage from './pages/VehiclePage';
import StationsPage from './pages/StationsPage';
import StationDetailPage from './pages/StationDetailPage';
import BookingPage from './pages/BookingPage';
import ChargingSessionPage from './pages/ChargingSessionPage';
import PaymentPage from './pages/PaymentPage';
import FeedbackPage from './pages/FeedbackPage';
import HistoryPage from './pages/HistoryPage';

function ProtectedRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="vehicles" element={<VehiclePage />} />
        <Route path="stations" element={<StationsPage />} />
        <Route path="stations/:id" element={<StationDetailPage />} />
        <Route path="book/:stationId" element={<BookingPage />} />
        <Route path="charging/:bookingId" element={<ChargingSessionPage />} />
        <Route path="payment/:bookingId" element={<PaymentPage />} />
        <Route path="feedback/:stationId" element={<FeedbackPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
