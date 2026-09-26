import { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Check,
  Edit2,
  Trash2,
  RefreshCw,
  Power,
  Users,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { getSaaSPlans, toggleSaaSPlanStatus, archiveSaaSPlan } from '../services/admin';
import PlanModal from '../components/PlanModal';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getSaaSPlans();
      setPlans(res || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load SaaS plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleToggleStatus = async (planId) => {
    try {
      setActionLoading(planId);
      await toggleSaaSPlanStatus(planId);
      await fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to toggle plan status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePlan = async (plan) => {
    if (!window.confirm(`Are you sure you want to archive "${plan.displayName || plan.name}"?`)) {
      return;
    }
    try {
      setActionLoading(plan._id);
      await archiveSaaSPlan(plan._id);
      await fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to archive plan');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenCreate = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SaaS Subscription Plans</h1>
          <p className="mt-1 text-xs text-slate-400">
            Define pricing packages, member quotas, feature access, and trial parameters offered to gym owners.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPlans}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-indigo-500 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-sm font-medium">Loading SaaS plans...</span>
          </div>
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center backdrop-blur-xl">
          <Layers className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-4 text-sm font-bold text-white">No Subscription Plans Configured</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            You have not created any SaaS tiers yet. Click &quot;Create New Plan&quot; to configure pricing.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Configure First Plan</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => {
            const isHighlight = !!p.highlight;
            const isAct = p.isActive !== false;

            return (
              <div
                key={p._id}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 transition duration-200 backdrop-blur-xl ${
                  isHighlight
                    ? 'border-blue-500/50 bg-gradient-to-b from-blue-900/20 via-slate-900/80 to-slate-950 shadow-xl shadow-blue-500/10'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isAct
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-white/10'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isAct ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {isAct ? 'Active' : 'Inactive'}
                  </span>

                  {p.tag && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-3 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-500/30">
                      <Sparkles className="h-3 w-3" />
                      {p.tag}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{p.displayName || p.name}</h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 min-h-[32px]">
                    {p.description || 'Standard platform tier subscription.'}
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/5 bg-slate-950/50 p-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {formatCurrency(p.pricing?.monthly?.price || 0)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/ month</span>
                    </div>

                    {p.pricing?.yearly?.price ? (
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                        <span>Yearly: {formatCurrency(p.pricing.yearly.price)} / yr</span>
                        {p.pricing.yearly.discountPercentage > 0 && (
                          <span className="font-semibold text-emerald-400">
                            Save {p.pricing.yearly.discountPercentage}%
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/[0.03] px-3.5 py-2 text-xs text-slate-300">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span>
                      Quota:{' '}
                      <strong className="text-white">
                        {p.pricing?.monthly?.isUnlimited
                          ? 'Unlimited Members'
                          : `${p.pricing?.monthly?.memberLimit || 250} Members`}
                      </strong>
                    </span>
                  </div>

                  <div className="mt-6 space-y-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Included Modules:
                    </span>
                    {p.features && p.features.length > 0 ? (
                      p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                            <Check className="h-2.5 w-2.5" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No custom feature bullets listed.</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStatus(p._id)}
                    disabled={actionLoading === p._id}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer transition ${
                      isAct
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    }`}
                  >
                    <Power className="h-3 w-3" />
                    <span>{isAct ? 'Deactivate' : 'Activate'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer transition"
                    >
                      <Edit2 className="h-3 w-3 text-blue-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePlan(p)}
                      disabled={actionLoading === p._id}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 cursor-pointer transition"
                      title="Archive Plan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <PlanModal
          plan={selectedPlan}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPlans();
          }}
        />
      )}
    </div>
  );
}