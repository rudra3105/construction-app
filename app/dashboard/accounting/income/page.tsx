import { prisma } from '../../../../lib/prisma';
import { createIncome } from '../../../actions/accountingActions';
import { formatDate } from '../../../../lib/utils';

export default async function IncomePage() {
  const sites = await prisma.site.findMany();
  const incomes = await prisma.income.findMany({ include: { site: true }, orderBy: { date: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Income management</h1>
        <p className="mt-2 text-sm text-slate-400">Record payments and link them to sites.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.5fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Add income</h2>
          <form action={createIncome} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Amount
              <input name="amount" type="number" step="0.01" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Date
              <input name="date" type="date" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Site
              <select name="siteId" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                <option value="">None</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              Source
              <input name="source" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" placeholder="Client or payment source" />
            </label>
            <label className="block text-sm text-slate-300">
              Payment method
              <select name="paymentMethod" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              Reference number
              <input name="reference" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Notes
              <textarea name="notes" rows={3} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Save income</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Recent income</h2>
          <div className="mt-6 space-y-4">
            {incomes.length ? (
              incomes.map((income) => (
                <div key={income.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white">₹{income.amount.toFixed(2)}</p>
                  <p className="text-sm text-slate-400">{formatDate(income.date)} • {income.site?.name ?? 'No site'}</p>
                  <p className="text-sm text-slate-300">{income.source || 'Source not provided'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No income recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
