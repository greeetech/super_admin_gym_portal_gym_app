import { useState, useEffect } from 'react';
import { X, Building2, User, Phone, Mail, Calendar, ExternalLink, AlertTriangle } from 'lucide-react';
import { getTenantById, updateTenantStatus } from '../services/admin';
import StatusBadge from './StatusBadge';

export default function TenantModal({ tenantId, onClose, onRefresh, onOpenManualSub }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getTenantById(tenantId);
        setData(res);
        setSuspensionReason(res?.tenant?.suspensionReason || '');
      } catch (err) {
        setError(err.message || 'Failed to load tenant details');
      } finally {
        setLoading(false);
      }
    }
    if (tenantId) load();
  }, [tenantId]);

  const handleToggleStatus = async (newStatus) => {
    try {
      setUpdating(true);
      setError('');
      await updateTenantStatus(tenantId, {
        status: newStatus,
        suspensionReason: newStatus === 'suspended' ? suspensionReason || 'Suspended by admin' : '',
      });
      const res = await getTenantById(tenantId);
      setData(res);
      onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to update tenant status');
    } finally {
      setUpdating(false);
    }
  };

  const tenant = data?.tenant;
  const profile = data?.profile;
  const metrics = data?.metrics || {};
  const activeSub = data?.activeSubscription;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {profile?.business?.gymName || tenant?.name || 'Gym Details'}
              </h2>
              <p className="text-xs text-slate-400">{tenant?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading tenant profile...</div>
        ) : error ? (
          <div className="my-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        ) : (
          <div className="mt-6 space-y-6 text-xs text-slate-300">
            {/* Status & Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Status:</span>
                <StatusBadge status={tenant?.status || 'active'} />
              </div>
              <div className="flex items-center gap-2">
                {tenant?.status === 'suspended' ? (
                  <button
                    onClick={() => handleToggleStatus('active')}
                    disabled={updating}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-400 hover:bg-emerald-500/20"
                  >
                    Reactivate Account
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleStatus('suspended')}
                    disabled={updating}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-semibold text-red-400 hover:bg-red-500/20"
                  >
                    Suspend Account
                  </button>
                )}
                <button
                  onClick={() => onOpenManualSub(tenant)}
                  className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 font-semibold text-blue-400 hover:bg-blue-500/20"
                >
                  Grant SaaS Plan
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                <span className="text-slate-500 block mb-1">Total Members</span>
                <span className="text-lg font-bold text-white">{metrics.totalMembers || 0}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                <span className="text-slate-500 block mb-1">Active Passes</span>
                <span className="text-lg font-bold text-emerald-400">{metrics.activeMemberships || 0}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                <span className="text-slate-500 block mb-1">CRM Leads</span>
                <span className="text-lg font-bold text-blue-400">{metrics.totalLeads || 0}</span>
              </div>
            </div>

            {/* Active Subscription Details */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 space-y-2">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">Active SaaS Subscription</h3>
              {activeSub ? (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Plan:</span>
                    <span className="font-semibold text-white">
                      {activeSub.planSnapshot?.displayName || activeSub.planSnapshot?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Billing Cycle:</span>
                    <span className="capitalize text-slate-200">{activeSub.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-slate-200">₹{activeSub.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Renewal / Expiry Date:</span>
                    <span className="text-slate-200">
                      {activeSub.endDate ? new Date(activeSub.endDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic py-2">No active paid SaaS subscription (Free Tier: 100 members limit).</p>
              )}
            </div>

            {/* Public Website & Contact Details */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 space-y-2">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">Public Microsite & Profile</h3>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Website Slug:</span>
                {profile?.website?.slug ? (
                  <a
                    href={`http://localhost:5173/g/${profile.website.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    <span>/g/{profile.website.slug}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-slate-500">Not configured</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact Phone:</span>
                <span className="text-slate-200">{profile?.contact?.phone || tenant?.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered On:</span>
                <span className="text-slate-200">
                  {tenant?.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}