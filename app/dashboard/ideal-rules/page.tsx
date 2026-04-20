import { prisma } from '../../../lib/prisma';
import { createIdealRule, deleteIdealRule } from '../../actions/resourceActions';

export default async function IdealRulesPage() {
  const materials = await prisma.material.findMany();
  const rules = await prisma.idealRule.findMany({ include: { material: true } });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Ideal consumption rules</h1>
        <p className="mt-2 text-sm text-slate-400">Define dynamic material needs per work type and unit.</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="text-lg font-semibold text-white">Create rule</h2>
          <form action={createIdealRule} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Work type
              <input name="workType" required placeholder="Wall, slab, plaster" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Unit
              <input name="unit" required placeholder="sq.ft, cubic meter" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
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
              Unit quantity
              <input name="unitQuantity" type="number" step="0.1" defaultValue="100" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Ideal quantity
              <input name="idealQuantity" type="number" step="0.1" defaultValue="10" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Create rule</button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">Rules list</h2>
          <div className="mt-6 space-y-4">
            {rules.length ? (
              rules.map((rule) => (
                <div key={rule.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-white">{rule.workType} • {rule.unit}</p>
                      <p className="text-sm text-slate-400">{rule.material.name}: {rule.idealQuantity} per {rule.unitQuantity}</p>
                    </div>
                    <form action={deleteIdealRule}>
                      <input type="hidden" name="id" value={rule.id} />
                      <button type="submit" className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400">Delete</button>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No ideal consumption rules defined yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
