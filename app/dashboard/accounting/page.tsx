import Link from 'next/link';
import { prisma } from '../../../lib/prisma';

export default async function AccountingPage() {
  const incomes = await prisma.income.findMany();
  const expenses = await prisma.expense.findMany();
  const recentIncome = incomes.slice(-3).reverse();
  const recentExpense = expenses.slice(-3).reverse();
  const totalIncome = incomes.reduce((sum, row) => sum + row.amount, 0);
  const totalExpense = expenses.reduce((sum, row) => sum + row.amount, 0);
  const net = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Accounting dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">View income, expense, and net profit metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Total Income</p>
          <p className="mt-3 text-3xl font-semibold text-white">₹{totalIncome.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Total Expense</p>
          <p className="mt-3 text-3xl font-semibold text-white">₹{totalExpense.toFixed(2)}</p>
        </div>
        <div className={`rounded-3xl border p-5 ${net >= 0 ? 'border-emerald-600 bg-emerald-950/30' : 'border-rose-600 bg-rose-950/30'}`}>
          <p className="text-sm text-slate-400">Net {net >= 0 ? 'Profit' : 'Loss'}</p>
          <p className="mt-3 text-3xl font-semibold text-white">₹{net.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-lg font-semibold text-white">Quick links</h2>
          <div className="mt-4 grid gap-3">
            {['/dashboard/accounting/income', '/dashboard/accounting/expense', '/dashboard/accounting/lpo', '/dashboard/accounting/reports'].map((href) => (
              <Link key={href} href={href} className="block rounded-2xl bg-slate-950/70 px-4 py-4 text-sm text-slate-200 transition hover:bg-slate-900">
                {href.replace('/dashboard/accounting/', '').replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-lg font-semibold text-white">Recent transactions</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Recent income</p>
              {recentIncome.length ? (
                recentIncome.map((item) => (
                  <p key={item.id} className="mt-2 text-sm text-slate-200">₹{item.amount.toFixed(2)} • {new Date(item.date).toISOString().slice(0, 10)} • {item.source || 'Source'}</p>
                ))
              ) : (
                <p className="mt-2 text-sm text-slate-400">No income entries yet.</p>
              )}
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Recent expense</p>
              {recentExpense.length ? (
                recentExpense.map((item) => (
                  <p key={item.id} className="mt-2 text-sm text-slate-200">₹{item.amount.toFixed(2)} • {new Date(item.date).toISOString().slice(0, 10)} • {item.category}</p>
                ))
              ) : (
                <p className="mt-2 text-sm text-slate-400">No expense entries yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
