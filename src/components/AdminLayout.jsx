import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  Building2,
  Layers,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Platform Analytics', icon: LayoutDashboard },
  { to: '/tenants', label: 'Gym Tenants', icon: Building2 },
  { to: '/plans', label: 'SaaS Plans', icon: Layers },
  { to: '/transactions', label: 'Revenue Ledger', icon: CreditCard },
  { to: '/settings', label: 'System Settings', icon: Settings },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl lg:flex">
        {/* Branding */}
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white">GYMFLOW</h1>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
              SuperAdmin
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Tenant Portal Link */}
        <div className="my-4 rounded-xl border border-white/5 bg-slate-950/40 p-3">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Tenant App</span>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            <span>Launch Gym Portal</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Admin User Footer */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs uppercase">
                {admin?.name ? admin.name.slice(0, 2) : 'SA'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{admin?.name || 'SuperAdmin'}</p>
                <p className="text-[10px] text-slate-400 truncate">{admin?.email || 'admin@gymflow.io'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-white text-sm">GymFlow SuperAdmin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-white/10 bg-slate-900 p-4 lg:hidden space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}