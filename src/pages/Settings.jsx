import { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  ShieldCheck,
  Server,
  Database,
  Key,
  LogOut,
  Sparkles,
  Terminal,
  CheckCircle,
  Copy,
  Check,
  AlertTriangle,
  Globe,
} from 'lucide-react';

export default function Settings() {
  const { admin, logout } = useAdminAuth();
  const [copiedCmd, setCopiedCmd] = useState(false);

  const seedCommand = 'npm run seed:demo';

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(seedCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to end your SuperAdmin session?')) {
      logout();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Settings & Infrastructure</h1>
        <p className="mt-1 text-xs text-slate-400">
          SuperAdmin credentials, platform gateway integrations, database connectivity, and SaaS deployment status.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg text-white font-black text-xl">
              {admin?.name ? admin.name.slice(0, 2).toUpperCase() : 'SA'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{admin?.name || 'Super Admin'}</h3>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                  Master Root
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{admin?.email || 'admin@gymflow.io'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 cursor-pointer transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl bg-slate-950/40 p-4 border border-white/5">
            <span className="text-slate-500 block mb-1">Administrative Role</span>
            <span className="font-semibold text-white uppercase">{admin?.role || 'super_admin'}</span>
          </div>
          <div className="rounded-xl bg-slate-950/40 p-4 border border-white/5">
            <span className="text-slate-500 block mb-1">Authentication Method</span>
            <span className="font-semibold text-white">x-admin-token (JWT isolated)</span>
          </div>
          <div className="rounded-xl bg-slate-950/40 p-4 border border-white/5">
            <span className="text-slate-500 block mb-1">Member Since</span>
            <span className="font-semibold text-white">
              {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'Platform Inception'}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
        <h2 className="text-sm font-semibold text-white mb-1">Integrated Cloud Infrastructure</h2>
        <p className="text-xs text-slate-400 mb-6">Backend services and third-party SaaS integrations</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 flex items-start gap-3">
            <Database className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">MongoDB Multi-Tenant Database</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Isolated tenant scopes by gymOwnerId with indexing across members, memberships, and billing.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 flex items-start gap-3">
            <Key className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Razorpay Payment Gateway</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Automated order generation, HMAC SHA256 webhook signature verification, and automated renewals.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 flex items-start gap-3">
            <Server className="h-5 w-5 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Cloudinary CDN Storage</span>
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Optimized asset delivery for gym logos, trainer portfolios, and member verification photos.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 flex items-start gap-3">
            <Globe className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Public Landing Pages</span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Dynamic SEO-ready microsites for every tenant at <code className="text-amber-300">/g/:slug</code> with lead capture forms.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-sm font-bold">Instant Demo Seeder</h2>
        </div>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Need to demonstrate the SaaS platform to investors or prospects? Run our pre-packaged seeder script to populate:
          SuperAdmin, SaaS Starter/Pro plans, a complete demo gym (&quot;PowerPulse Fitness Hub&quot; at <code>/g/power-pulse</code>),
          trainers, testimonials, CRM leads, and 8 active member accounts.
        </p>

        <div className="flex items-center justify-between rounded-xl bg-slate-950/80 p-3 border border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="h-4 w-4 text-blue-400" />
            <span>cd gym_management_solution-backend && npm run seed:demo</span>
          </div>
          <button
            onClick={handleCopyCommand}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600/20 px-2.5 py-1 text-[11px] font-semibold text-blue-400 hover:bg-blue-600/30 cursor-pointer transition"
          >
            {copiedCmd ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}