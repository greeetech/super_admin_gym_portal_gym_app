import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Building2,
  Users,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  MoreVertical,
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { getTenants, updateTenantStatus } from '../services/admin';
import StatusBadge from '../components/StatusBadge';
import TenantModal from '../components/TenantModal';
import ManualSubModal from '../components/ManualSubModal';

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [tenantForSub, setTenantForSub] = useState(null);

  const fetchTenants = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await getTenants({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        plan: planFilter !== 'all' ? planFilter : undefined,
      });
      setTenants(res.data || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants(1);
  }, [statusFilter, planFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTenants(1);
  };

  const handleQuickStatusToggle = async (tenant) => {
    const newStatus = tenant.status === 'suspended' ? 'active' : 'suspended';
    const confirmMsg =
      newStatus === 'suspended'
        ? `Are you sure you want to suspend "${tenant.gymName || tenant.name}"? Their dashboard access will be immediately blocked.`
        : `Reactivate "${tenant.gymName || tenant.name}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await updateTenantStatus(tenant._id, {
        status: newStatus,
        suspensionReason: newStatus === 'suspended' ? 'Administrative suspension' : '',
      });
      fetchTenants(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Gym Tenants Management</h1>
          <p className="mt-1 text-xs text-slate-400">
            Monitor, inspect, provision subscriptions, and enforce access controls across all gym accounts.
          </p>
        </div>
        <button
          onClick={() => fetchTenants(pagination.page)}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by gym name, owner name, or email..."
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Tier:</span>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="pro">Pro</option>
              <option value="basic">Basic</option>
              <option value="free">Free</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-slate-950/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Gym & Brand</th>
                <th className="px-6 py-4">Owner Contact</th>
                <th className="px-6 py-4">Current SaaS Plan</th>
                <th className="px-6 py-4">Platform Members</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                      <span>Loading tenants...</span>
                    </div>
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No gym tenants found matching current criteria.
                  </td>
                </tr>
              ) : (
                tenants.map((t) => {
                  const isSuspended = t.status === 'suspended';
                  const tier = t.activeSubscription?.tier || 'free';
                  return (
                    <tr key={t._id} className="transition hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {t.logo ? (
                            <img
                              src={t.logo}
                              alt={t.gymName}
                              className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20 font-bold text-xs uppercase">
                              {t.gymName ? t.gymName.slice(0, 2) : 'GY'}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white">{t.gymName || 'Unnamed Gym'}</div>
                            {t.websiteSlug ? (
                              <a
                                href={`http://localhost:5173/g/${t.websiteSlug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
                              >
                                <span>/g/{t.websiteSlug}</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-500">No public page slug</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-200">{t.name}</div>
                        <div className="text-[11px] text-slate-400">{t.email}</div>
                        {t.phone && <div className="text-[11px] text-slate-500">{t.phone}</div>}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              tier === 'pro'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : tier === 'basic'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-slate-700/50 text-slate-300'
                            }`}
                          >
                            {t.activeSubscription?.planName || 'Free'}
                          </span>
                          {t.activeSubscription?.billingCycle && t.activeSubscription?.billingCycle !== 'none' && (
                            <span className="text-[10px] text-slate-400 capitalize">
                              ({t.activeSubscription.billingCycle})
                            </span>
                          )}
                        </div>
                        {t.activeSubscription?.endDate && (
                          <div className="mt-1 text-[10px] text-slate-500">
                            Renews: {new Date(t.activeSubscription.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          <span>{t.memberCount || 0} members</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={t.status || 'active'} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTenantId(t._id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer transition"
                          >
                            <Eye className="h-3 w-3 text-blue-400" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => setTenantForSub(t)}
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-blue-300 hover:bg-blue-500/20 cursor-pointer transition"
                          >
                            <Award className="h-3 w-3" />
                            <span>Grant Plan</span>
                          </button>

                          <button
                            onClick={() => handleQuickStatusToggle(t)}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold cursor-pointer transition ${
                              isSuspended
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            }`}
                          >
                            {isSuspended ? (
                              <>
                                <ShieldCheck className="h-3 w-3" />
                                <span>Reactivate</span>
                              </>
                            ) : (
                              <>
                                <ShieldAlert className="h-3 w-3" />
                                <span>Suspend</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-slate-400">
            <div>
              Showing page <span className="font-semibold text-white">{pagination.page}</span> of{' '}
              <span className="font-semibold text-white">{pagination.pages}</span> ({pagination.total} total gyms)
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchTenants(pagination.page - 1)}
                className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchTenants(pagination.page + 1)}
                className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedTenantId && (
        <TenantModal
          tenantId={selectedTenantId}
          onClose={() => setSelectedTenantId(null)}
          onRefresh={() => fetchTenants(pagination.page)}
          onOpenManualSub={(tenant) => {
            setSelectedTenantId(null);
            setTenantForSub(tenant);
          }}
        />
      )}

      {tenantForSub && (
        <ManualSubModal
          tenant={tenantForSub}
          onClose={() => setTenantForSub(null)}
          onSuccess={() => {
            setTenantForSub(null);
            fetchTenants(pagination.page);
          }}
        />
      )}
    </div>
  );
}