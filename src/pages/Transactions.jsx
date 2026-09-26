import { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  DollarSign,
  Copy,
  Check,
} from 'lucide-react';
import { getTransactions } from '../services/admin';
import StatusBadge from '../components/StatusBadge';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [summary, setSummary] = useState({ totalRevenueCollected: 0 });
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [billingCycle, setBillingCycle] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await getTransactions({
        page,
        limit: 15,
        search: search.trim() || undefined,
        paymentStatus: paymentStatus !== 'all' ? paymentStatus : undefined,
        billingCycle: billingCycle !== 'all' ? billingCycle : undefined,
      });
      setTransactions(res.data || []);
      setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
      if (res.summary) setSummary(res.summary);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, [paymentStatus, billingCycle]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTransactions(1);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Tx ID', 'Owner Name', 'Owner Email', 'Plan', 'Cycle', 'Amount', 'Payment Status', 'Razorpay Payment ID', 'Created At'];
    const rows = transactions.map((t) => [
      t._id,
      `"${t.ownerId?.name || 'N/A'}"`,
      t.ownerId?.email || 'N/A',
      t.planSnapshot?.displayName || t.planSnapshot?.name || 'N/A',
      t.billingCycle || 'N/A',
      t.amount || 0,
      t.paymentStatus || t.status || 'N/A',
      t.razorpay?.paymentId || 'Manual/None',
      new Date(t.createdAt).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saas_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h1 className="text-2xl font-bold tracking-tight text-white">SaaS Revenue Ledger</h1>
          <p className="mt-1 text-xs text-slate-400">
            Audit payment receipts, Razorpay order IDs, recurring subscription renewals, and manual overrides.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-40 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => fetchTransactions(pagination.page)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Total Invoiced Revenue
            </span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {formatCurrency(summary.totalRevenueCollected)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Total settled across all tenant subscription cycles</p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Total Transaction Records
            </span>
            <CreditCard className="h-5 w-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {pagination.total} Records
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Includes active subscriptions, manual grants, and renewals</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Razorpay Order ID, Payment ID, or Plan Name..."
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Payment:</span>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Cycle:</span>
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Cycles</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
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
                <th className="px-6 py-4">Transaction / Date</th>
                <th className="px-6 py-4">Gym Owner</th>
                <th className="px-6 py-4">Plan & Cycle</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Gateway Reference</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                      <span>Loading transactions ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No transactions matching current criteria.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isPaid = tx.paymentStatus === 'paid' || tx.status === 'active';
                  const dateStr = new Date(tx.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={tx._id} className="transition hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="font-mono text-[11px] text-slate-300">{dateStr}</div>
                        <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-slate-500">
                          <span>ID: {tx._id.slice(-8)}</span>
                          <button
                            onClick={() => copyToClipboard(tx._id, tx._id)}
                            className="hover:text-white cursor-pointer"
                          >
                            {copiedId === tx._id ? (
                              <Check className="h-2.5 w-2.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-2.5 w-2.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{tx.ownerId?.name || 'Gym Owner'}</div>
                        <div className="text-[11px] text-slate-400">{tx.ownerId?.email || 'N/A'}</div>
                        {tx.ownerId?.phone && (
                          <div className="text-[10px] text-slate-500">{tx.ownerId.phone}</div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-200">
                          {tx.planSnapshot?.displayName || tx.planSnapshot?.name || 'SaaS Plan'}
                        </div>
                        <span className="inline-block mt-0.5 rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase font-semibold text-slate-400">
                          {tx.billingCycle || 'none'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-white">{formatCurrency(tx.amount)}</span>
                      </td>

                      <td className="px-6 py-4 font-mono text-[11px]">
                        {tx.razorpay?.paymentId ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-blue-400">
                              <span>PayID: {tx.razorpay.paymentId.slice(-10)}</span>
                              <button
                                onClick={() => copyToClipboard(tx.razorpay.paymentId, `pay_${tx._id}`)}
                                className="hover:text-white cursor-pointer"
                              >
                                {copiedId === `pay_${tx._id}` ? (
                                  <Check className="h-2.5 w-2.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-2.5 w-2.5" />
                                )}
                              </button>
                            </div>
                            {tx.razorpay.orderId && (
                              <div className="text-[10px] text-slate-500">
                                Ord: {tx.razorpay.orderId.slice(-10)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                            Admin Manual Grant
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                            isPaid
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : tx.paymentStatus === 'failed'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {isPaid ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : tx.paymentStatus === 'failed' ? (
                            <XCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          <span>{tx.paymentStatus || tx.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-slate-400">
            <div>
              Showing page <span className="font-semibold text-white">{pagination.page}</span> of{' '}
              <span className="font-semibold text-white">{pagination.totalPages}</span> ({pagination.total} total)
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchTransactions(pagination.page - 1)}
                className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchTransactions(pagination.page + 1)}
                className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}