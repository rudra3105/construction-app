import { prisma } from '../../../../lib/prisma';
import { createLpo, updateLpoStatus, deleteLpo } from '../../../actions/accountingActions';
import { formatDate } from '../../../../lib/utils';

export default async function LpoPage() {
  const sites = await prisma.site.findMany();
  const lpos = await prisma.lPO.findMany({ include: { site: true, items: true }, orderBy: { date: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">LPO management</h1>
        <p className="mt-2 text-sm text-slate-400">Create local purchase orders and approve material orders.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.5fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Create LPO</h2>
          <form action={createLpo} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Vendor name
              <input name="vendorName" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
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
              Date
              <input name="date" type="date" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Status
              <select name="status" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block text-sm text-slate-300">
                Material name
                <input name="itemName" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
              </label>
              <label className="block text-sm text-slate-300">
                Quantity
                <input name="itemQuantity" type="number" step="0.1" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
              </label>
              <label className="block text-sm text-slate-300">
                Rate
                <input name="itemRate" type="number" step="0.01" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
              </label>
            </div>
            <label className="block text-sm text-slate-300">
              Notes
              <textarea name="notes" rows={2} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Create LPO</button>
          </form>
        </div>

        <div className="space-y-5">
          {lpos.length ? (
            lpos.map((lpo) => (
              <div key={lpo.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{lpo.number} • {lpo.vendorName}</p>
                    <p className="text-sm text-slate-400">{formatDate(lpo.date)} • {lpo.site?.name ?? 'No site'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={updateLpoStatus} className="inline-flex gap-2">
                      <input type="hidden" name="id" value={lpo.id} />
                      <select name="status" defaultValue={lpo.status} className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-400">
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                      <button type="submit" className="rounded-2xl bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">Update</button>
                    </form>
                    <form action={deleteLpo}>
                      <input type="hidden" name="id" value={lpo.id} />
                      <button type="submit" className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-400">Delete</button>
                    </form>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  {lpo.items.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-slate-900/70 p-3">
                      <p>{item.materialName}: {item.quantity} × ₹{item.rate.toFixed(2)} = ₹{item.total.toFixed(2)}</p>
                    </div>
                  ))}
                  <p className="font-semibold text-slate-100">Total: ₹{lpo.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">No LPOs created yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
