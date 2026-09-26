import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, getAdminProfile } from '../services/admin';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('gym_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('gym_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await getAdminProfile();
        setAdmin(profile);
        localStorage.setItem('gym_admin_user', JSON.stringify(profile));
      } catch (err) {
        console.error('Session expired', err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginAdmin({ email, password });
    if (res.token) {
      localStorage.setItem('gym_admin_token', res.token);
      localStorage.setItem('gym_admin_user', JSON.stringify(res.data));
      setToken(res.token);
      setAdmin(res.data);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('gym_admin_token');
    localStorage.removeItem('gym_admin_user');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}