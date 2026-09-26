import { useState, useEffect } from 'react';
import { X, Layers, Save } from 'lucide-react';
import { createSaaSPlan, updateSaaSPlan } from '../services/admin';

export default function PlanModal({ plan, onClose, onSuccess }) {
  const isEdit = !!plan;

  const [formData, setFormData] = useState({
    name: 'basic',
    displayName: '',
    description: '',
    monthlyPrice: 999,
    isUnlimited: false,
    memberLimit: 250,
    yearlyPrice: 9990,
    yearlyPerMonthPrice: 832,
    discountPercentage: 17,
    features: '',
    highlight: false,
    tag: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || 'basic',
        displayName: plan.displayName || '',
        description: plan.description || '',
        monthlyPrice: plan.pricing?.monthly?.price || 0,
        isUnlimited: !!plan.pricing?.monthly?.isUnlimited,
        memberLimit: plan.pricing?.monthly?.memberLimit || 250,
        yearlyPrice: plan.pricing?.yearly?.price || 0,
        yearlyPerMonthPrice: plan.pricing?.yearly?.perMonthPrice || 0,
        discountPercentage: plan.pricing?.yearly?.discountPercentage || 0,
        features: (plan.features || []).join('\n'),
        highlight: !!plan.highlight,
        tag: plan.tag || '',
      });
    }
  }, [plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      const payload = {
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description,
        pricing: {
          monthly: {
            price: Number(formData.monthlyPrice),
            memberLimit: formData.isUnlimited ? null : Number(formData.memberLimit),
            isUnlimited: formData.isUnlimited,
          },
          yearly: {
            price: Number(formData.yearlyPrice),
            perMonthPrice: Number(formData.yearlyPerMonthPrice),
            discountPercentage: Number(formData.discountPercentage),
          },
        },
        features: formData.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
        highlight: formData.highlight,
        tag: formData.tag,
      };

      if (isEdit) {
        await updateSaaSPlan(plan._id, payload);
      } else {
        await createSaaSPlan(payload);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" />
            <h2 className="text-sm font-bold text-white">
              {isEdit ? 'Configure SaaS Plan Tier' : 'Create New SaaS Plan'}
            </h2>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Plan Identifier (Key)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase() })}
                required
                disabled={isEdit}
                placeholder="starter / pro / enterprise"
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Display Title</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
                placeholder="e.g. Starter Gym Growth"
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Short Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Perfect for single studio gyms with up to 250 members"
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white"
            />
          </div>

          {/* Monthly Pricing & Quota */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-3">
            <h4 className="font-semibold text-white">Monthly Billing & Quotas</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Monthly Price (INR ₹)</label>
                <input
                  type="number"
                  value={formData.monthlyPrice}
                  onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                  min={0}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Member Limit</label>
                <input
                  type="number"
                  value={formData.memberLimit}
                  onChange={(e) => setFormData({ ...formData, memberLimit: e.target.value })}
                  disabled={formData.isUnlimited}
                  min={1}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 p-2 text-white disabled:opacity-50"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={formData.isUnlimited}
                onChange={(e) => setFormData({ ...formData, isUnlimited: e.target.checked })}
                className="rounded border-white/20 bg-slate-900 text-blue-600"
              />
              <span>Unlimited Active Members Quota</span>
            </label>
          </div>

          {/* Yearly Pricing */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-3">
            <h4 className="font-semibold text-white">Yearly Billing Discount</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Yearly Total (₹)</label>
                <input
                  type="number"
                  value={formData.yearlyPrice}
                  onChange={(e) => setFormData({ ...formData, yearlyPrice: e.target.value })}
                  min={0}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Per Month (₹)</label>
                <input
                  type="number"
                  value={formData.yearlyPerMonthPrice}
                  onChange={(e) => setFormData({ ...formData, yearlyPerMonthPrice: e.target.value })}
                  min={0}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Discount %</label>
                <input
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                  min={0}
                  max={100}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 p-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Features list */}
          <div>
            <label className="text-slate-400 block mb-1">Plan Features (One per line)</label>
            <textarea
              rows={4}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Up to 250 Members&#10;WhatsApp Expiry Link&#10;CSV Exports"
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white font-mono text-[11px]"
            />
          </div>

          {/* Highlight & Tag */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="text-slate-400 block mb-1">Promotional Tag</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g. Popular / Recommended"
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white"
              />
            </div>
            <label className="flex items-center gap-2 pt-4 text-slate-300">
              <input
                type="checkbox"
                checked={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                className="rounded border-white/20 bg-slate-900 text-blue-600"
              />
              <span>Highlight Card (Glow outline)</span>
            </label>
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
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{submitting ? 'Saving...' : 'Save Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}