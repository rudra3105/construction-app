import { prisma } from '../../../lib/prisma';
import { createMaterial, createMaterialLog, deleteMaterial } from '../../actions/resourceActions';
import { formatDate } from '../../../lib/utils';

export default async function MaterialsPage() {
  const sites = await prisma.site.findMany();
  const materials = await prisma.material.findMany();
  const materialLogs = await prisma.materialLog.findMany({ include: { material: true, site: true } });

  const stats = materials.map((material) => {
    const logs = materialLogs.filter((log) => log.materialId === material.id);
    const purchased = logs.reduce((sum, log) => sum + log.purchasedQuantity, 0);
    const used = logs.reduce((sum, log) => sum + log.usedQuantity, 0);
    return { ...material, purchased, used, remaining: Math.max(0, purchased - used) };
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Material management</h1>
        <p className="mt-2 text-sm text-slate-400">Add materials, record purchases and usage per site.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white">New material</h2>
            <form action={createMaterial} className="mt-6 space-y-4">
              <label className="block text-sm text-slate-300">
                Material name
                <input name="name" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
              </label>
              <label className="block text-sm text-slate-300">
                Unit
                <input name="unit" required placeholder="bags, kg, cubic meter" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
              </label>
              <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Add material</button>
            </form>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Material log</h2>
            <form action={createMaterialLog} className="mt-6 space-y-4">
              <label className="block text-sm text-slate-300">
                Site
                <select name="siteId" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                  <option value="">Choose site</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                Material
                <select name="materialId" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                  <option value="">Choose material</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>{material.name}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                Date
                <input name="date" type="date" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
              </label>
              <label className="block text-sm text-slate-300">
                Purchased quantity
                <input name="purchasedQuantity" type="number" step="0.1" defaultValue="0" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
              </label>
              <label className="block text-sm text-slate-300">
                Used quantity
                <input name="usedQuantity" type="number" step="0.1" defaultValue="0" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
              </label>
              <label className="block text-sm text-slate-300">
                Notes
                <textarea name="notes" rows={2} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
              </label>
              <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Record material</button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-lg font-semibold text-white">Material inventory</h2>
            <div className="mt-4 grid gap-4">
              {stats.length ? (
                stats.map((material) => (
                  <div key={material.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{material.name}</p>
                        <p className="text-sm text-slate-400">Unit {material.unit}</p>
                      </div>
                      <div className="text-sm text-slate-300">
                        <p>In: {material.purchased}</p>
                        <p>Used: {material.used}</p>
                        <p>Remaining: {material.remaining}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Create materials to see inventory.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-lg font-semibold text-white">Recent material logs</h2>
            <div className="mt-4 space-y-4">
              {materialLogs.length ? (
                materialLogs.map((log) => (
                  <div key={log.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-semibold text-white">{log.material.name} on {formatDate(log.date)}</p>
                        <p className="text-sm text-slate-400">{log.site.name}</p>
                      </div>
                      <div className="text-sm text-slate-300">
                        <p>Purchased: {log.purchasedQuantity}</p>
                        <p>Used: {log.usedQuantity}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No material activity recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
