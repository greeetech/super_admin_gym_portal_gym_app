import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Plans from './pages/Plans';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-xs text-slate-400">
        Authenticating SuperAdmin...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="plans" element={<Plans />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}