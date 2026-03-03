import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminDatabase from './pages/SuperAdminDatabase';
import UserManagement from './pages/UserManagement';
import SchoolsManagement from './pages/SchoolsManagement';
import FinanceBilling from './pages/FinanceBilling';
import SystemAlerts from './pages/SystemAlerts';
import GlobalSetup from './pages/GlobalSetup';
import LoginPage from './pages/LoginPage';
import AttendancePage from './pages/AttendancePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageTransition from './components/ui/PageTransition';
import RGBToast from './components/ui/RGBToast';

function AppContent() {
  const location = useLocation();
  const { toast, hideToast } = useAuth();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/super-admin" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <PageTransition><SuperAdminDashboard /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/database" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <PageTransition><SuperAdminDatabase /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <PageTransition><UserManagement /></PageTransition>
            </ProtectedRoute>
          } />
          {/* ─────────────────────────────────────────────── */}
          {/* 📝 Author: Narco / Arth                        */}
          {/* 🔗 GitHub: https://github.com/ArthOfficial      */}
          {/* 🌐 Website: https://arth-hub.vercel.app         */}
          {/* © 2026 Arth — All rights reserved.              */}
          {/* ─────────────────────────────────────────────── */}
          <Route path="/schools" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <PageTransition><SchoolsManagement /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/finance" element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <PageTransition><FinanceBilling /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/alerts" element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <PageTransition><SystemAlerts /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <PageTransition><GlobalSetup /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/attendance" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <PageTransition><AttendancePage /></PageTransition>
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>

      <RGBToast
        show={toast.show}
        message={toast.message}
        onClose={hideToast}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
