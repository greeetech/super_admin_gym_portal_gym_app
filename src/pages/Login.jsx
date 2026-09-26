import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Invalid credentials or network failure.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@gym.com');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Header Branding */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/20 ring-1 ring-white/20 mb-4">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            GymFlow <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">SuperAdmin</span>
          </h1>
          <p className="mt-2 text-xs text-slate-400 tracking-wide uppercase font-semibold">
            Central Multi-Tenant SaaS Control Center
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gym.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Master Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition duration-200 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to SuperAdmin</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 text-xs text-slate-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-semibold text-blue-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Instant Demo Access</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-300 hover:text-white underline cursor-pointer"
                >
                  <KeyRound className="h-3 w-3" />
                  Auto-fill Demo
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-400 space-y-0.5">
                <div>Email: <span className="text-slate-200">admin@gym.com</span></div>
                <div>Pass: <span className="text-slate-200">Admin@123</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Footer note */}
        <p className="mt-8 text-center text-[11px] text-slate-500">
          Protected by Dual-Layer Administrative Authentication • GymFlow Platform Engine v2.4
        </p>
      </div>
    </div>
  );
}