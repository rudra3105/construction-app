import { prisma } from '../../../lib/prisma';
import { createPayroll, deletePayroll } from '../../actions/resourceActions';
import { formatDate } from '../../../lib/utils';

export default async function PayrollPage() {
  const labours = await prisma.labour.findMany();
  const payrolls = await prisma.payroll.findMany({ include: { labour: true } });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Payroll</h1>
        <p className="mt-2 text-sm text-slate-400">Enter payments for workers and export cost data.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Add payment</h2>
          <form action={createPayroll} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Worker
              <select name="labourId" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                <option value="">Select worker</option>
                {labours.map((labour) => (
                  <option key={labour.id} value={labour.id}>{labour.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              Amount
              <input name="amount" type="number" step="0.1" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Date
              <input name="date" type="date" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Notes
              <textarea name="notes" rows={2} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Save payment</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Payroll history</h2>
          <div className="mt-6 space-y-4">
            {payrolls.length ? (
              payrolls.map((entry) => (
                <div key={entry.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-white">{entry.labour.name}</p>
                      <p className="text-sm text-slate-400">{formatDate(entry.date)} • {entry.notes || 'No notes'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-slate-300">₹{entry.amount.toFixed(2)}</p>
                      <form action={deletePayroll}>
                        <input type="hidden" name="id" value={entry.id} />
                        <button type="submit" className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-400">Delete</button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No payroll entries available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
