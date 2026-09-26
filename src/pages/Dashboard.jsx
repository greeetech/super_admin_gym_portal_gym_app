import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Activity,
  Award,
  RefreshCw,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getPlatformAnalytics } from '../services/admin';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      setError('');
      const res = await getPlatformAnalytics();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium">Aggregating platform metrics...</span>
        </div>
      </div>
    );
  }

  const { overview = {}, tierDistribution = {}, trends = {}, recentTenants = [], recentTransactions = [] } =
    data || {};

  const pieData = [
    { name: 'Pro Tier', value: tierDistribution.pro || 0 },
    { name: 'Basic Tier', value: tierDistribution.basic || 0 },
    { name: 'Free Tier', value: tierDistribution.free || 0 },
  ].filter((d) => d.value > 0);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Platform Analytics & Growth</h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time SaaS revenue performance, tenant health, and platform subscriber metrics.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={refreshing}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:bg-slate-800 hover:text-white disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Recurring (MRR)"
          value={formatCurrency(overview.mrr)}
          subtext={`ARR: ${formatCurrency(overview.arr)}`}
          icon={TrendingUp}
          gradient="blue"
        />
        <StatCard
          title="Total SaaS Revenue"
          value={formatCurrency(overview.totalSaaSRevenue)}
          subtext={`${overview.activePaidSubscribers || 0} active paying gyms`}
          icon={DollarSign}
          gradient="emerald"
        />
        <StatCard
          title="Total Gym Tenants"
          value={overview.totalTenants || 0}
          subtext={`${overview.activeTenants || 0} Active • ${overview.suspendedTenants || 0} Suspended`}
          icon={Building2}
          gradient="purple"
        />
        <StatCard
          title="Platform End-Users"
          value={(overview.totalPlatformMembers || 0).toLocaleString()}
          subtext={`${overview.totalActiveMemberships || 0} active memberships`}
          icon={Users}
          gradient="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Revenue Trend */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-white">SaaS Monthly Revenue (INR)</h2>
              <p className="text-xs text-slate-400">Aggregated payments across all tenant subscriptions</p>
            </div>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
              Live Invoiced
            </span>
          </div>

          <div className="h-64 w-full">
            {trends.revenueMonthly && trends.revenueMonthly.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends.revenueMonthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                    itemStyle={{ color: '#60a5fa', fontSize: '12px', fontWeight: 600 }}
                    formatter={(val) => [formatCurrency(val), 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">
                No revenue transaction data recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Tier Distribution Donut */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">Active Tier Distribution</h2>
            <p className="text-xs text-slate-400">Gym owner subscription tiers</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-500">No active tier data.</div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span>Pro Tier</span>
              </div>
              <span className="font-semibold text-white">{tierDistribution.pro || 0}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                <span>Basic Tier</span>
              </div>
              <span className="font-semibold text-white">{tierDistribution.basic || 0}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Free / Trial</span>
              </div>
              <span className="font-semibold text-white">{tierDistribution.free || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Gym Tenants */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recently Registered Tenants</h2>
            <Link
              to="/tenants"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTenants.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No tenants registered yet.</p>
            ) : (
              recentTenants.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/40 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold text-xs uppercase">
                      {t.name ? t.name.slice(0, 2) : 'GY'}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{t.name || 'Unnamed Gym'}</h4>
                      <p className="text-[11px] text-slate-400">{t.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.status || 'active'} />
                    <span className="text-[10px] text-slate-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Subscription Transactions</h2>
            <Link
              to="/transactions"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              <span>View Ledger</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No transactions recorded yet.</p>
            ) : (
              recentTransactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/40 p-3.5"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      {tx.planSnapshot?.displayName || tx.planSnapshot?.name || 'SaaS Plan'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {tx.ownerId?.name || tx.ownerId?.email || 'Tenant'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">{formatCurrency(tx.amount)}</div>
                    <span className="inline-block mt-0.5 text-[10px] uppercase font-semibold text-emerald-400">
                      {tx.paymentStatus || tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}