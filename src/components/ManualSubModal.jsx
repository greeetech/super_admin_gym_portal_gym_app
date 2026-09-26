import { useState, useEffect } from 'react';
import { X, Award, CheckCircle } from 'lucide-react';
import { getSaaSPlans, grantManualSubscription } from '../services/admin';

export default function ManualSubModal({ tenant, onClose, onSuccess }) {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [durationDays, setDurationDays] = useState(30);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await getSaaSPlans();
        setPlans(res);
        if (res.length > 0) setSelectedPlanId(res[0]._id);
      } catch (err) {
        setError('Failed to load plans');
      }
    }
    loadPlans();
  }, []);

  const handleCycleChange = (cycle) => {
    setBillingCycle(cycle);
    setDurationDays(cycle === 'yearly' ? 365 : 30);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) return;

    try {
      setSubmitting(true);
      setError('');
      await grantManualSubscription(tenant._id, {
        planId: selectedPlanId,
        billingCycle,
        durationDays: Number(durationDays),
        notes,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to grant subscription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" />
            <h2 className="text-sm font-bold text-white">Manual SaaS Subscription Grant</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Target Tenant</label>
            <div className="rounded-xl bg-slate-950/60 p-3 text-white font-medium border border-white/5">
              {tenant?.gymName || tenant?.name} ({tenant?.email})
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Select SaaS Plan Tier</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white"
            >
              {plans.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.displayName || p.name} (Limit: {p.pricing?.monthly?.memberLimit || 'Unlimited'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Billing Cycle</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleCycleChange('monthly')}
                className={`rounded-xl py-2 font-semibold border ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 text-slate-400 border-white/10'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => handleCycleChange('yearly')}
                className={`rounded-xl py-2 font-semibold border ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 text-slate-400 border-white/10'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Duration (Days)</label>
            <input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              min={1}
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Admin Audit Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. VIP offline enterprise client granted 1 year complimentary"
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {submitting ? 'Granting...' : 'Provision Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}