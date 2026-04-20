import { prisma } from '../../../lib/prisma';
import { createWorkLog, deleteWorkLog } from '../../actions/resourceActions';
import { formatDate } from '../../../lib/utils';

export default async function WorkLogsPage() {
  const sites = await prisma.site.findMany();
  const workLogs = await prisma.workLog.findMany({ include: { site: true } });
  const rules = await prisma.idealRule.findMany({ include: { material: true } });

  const enrichedWorkLogs = workLogs.map((log) => {
    const matched = rules.filter((rule) => rule.workType === log.workType && rule.unit === log.unit);
    const idealDetails = matched.map((rule) => ({
      materialName: rule.material.name,
      ideal: (log.quantity / rule.unitQuantity) * rule.idealQuantity
    }));
    return { log, idealDetails };
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Daily work logs</h1>
        <p className="mt-2 text-sm text-slate-400">Add updates and compare actual material usage to ideal consumption.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Add work log</h2>
          <form action={createWorkLog} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Site
              <select name="siteId" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                <option value="">Select site</option>
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
              Work type
              <input name="workType" required placeholder="Wall, slab, plaster" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Unit type
              <input name="unit" required placeholder="sq.ft, cubic meter" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Quantity
              <input name="quantity" type="number" step="0.1" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Description
              <textarea name="description" rows={3} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Progress %
              <input name="progress" type="number" min="0" max="100" defaultValue="0" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Image
              <input name="image" type="file" accept="image/*" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Save log</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Recent logs</h2>
          <div className="mt-6 space-y-4">
            {enrichedWorkLogs.length ? (
              enrichedWorkLogs.map(({ log, idealDetails }) => (
                <div key={log.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold text-white">{log.workType} – {log.quantity} {log.unit}</p>
                      <p className="text-sm text-slate-400">{formatDate(log.date)} • {log.site.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-2xl bg-slate-800 px-3 py-1 text-sm text-slate-200">{log.progress}%</span>
                      <form action={deleteWorkLog}>
                        <input type="hidden" name="id" value={log.id} />
                        <button type="submit" className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-400">Delete</button>
                      </form>
                    </div>
                  </div>
                  {idealDetails.length ? (
                    <div className="mt-4 grid gap-2 text-sm text-slate-300">
                      {idealDetails.map((detail) => (
                        <p key={detail.materialName}>{detail.materialName}: ideal {detail.ideal.toFixed(1)}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">No ideal rules match this work type and unit yet.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No work logs yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
