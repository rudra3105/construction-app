import { prisma } from '../../../../lib/prisma';
import ReportTools from './ReportTools';

export default async function AccountingReportsPage() {
  const incomes = await prisma.income.findMany({ include: { site: true } });
  const expenses = await prisma.expense.findMany({ include: { site: true } });

  const serializableIncomes = incomes.map((income) => ({
    amount: income.amount,
    date: income.date.toISOString().slice(0, 10),
    source: income.source,
    paymentMethod: income.paymentMethod,
    site: income.site?.name || 'None',
    reference: income.reference || ''
  }));

  const serializableExpenses = expenses.map((expense) => ({
    amount: expense.amount,
    date: expense.date.toISOString().slice(0, 10),
    category: expense.category,
    paymentMethod: expense.paymentMethod,
    site: expense.site?.name || 'None',
    notes: expense.notes || ''
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Accounting reports</h1>
        <p className="mt-2 text-sm text-slate-400">Export income, expense, and profit/loss reports.</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <ReportTools incomes={serializableIncomes} expenses={serializableExpenses} />
      </div>
    </div>
  );
}
