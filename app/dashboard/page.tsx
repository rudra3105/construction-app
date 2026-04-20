import { prisma } from '../../lib/prisma';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../../lib/utils';

export default async function DashboardPage() {
  const sites = await prisma.site.findMany({ include: { supervisor: true } });
  const workLogs = await prisma.workLog.findMany();
  const materialLogs = await prisma.materialLog.findMany({ include: { material: true } });
  const payrolls = await prisma.payroll.findMany();
  const labours = await prisma.labour.findMany();
  const rules = await prisma.idealRule.findMany({ include: { material: true } });

  const totalSites = sites.length;
  const activeSites = sites.filter((site) => site.status === 'ONGOING').length;
  const totalMaterialUsage = materialLogs.reduce((sum, log) => sum + log.usedQuantity, 0);
  const totalLabourCost = payrolls.reduce((sum, payroll) => sum + payroll.amount, 0);

  const idealTotals: Record<string, number> = {};
  const actualTotals: Record<string, number> = {};

  workLogs.forEach((log) => {
    const keyBase = `${log.siteId}::${log.workType}::${log.unit}`;
    rules
      .filter((rule) => rule.workType === log.workType && rule.unit === log.unit)
      .forEach((rule) => {
        const key = `${log.siteId}::${rule.materialId}`;
        const ideal = (log.quantity / rule.unitQuantity) * rule.idealQuantity;
        idealTotals[key] = (idealTotals[key] || 0) + ideal;
      });
  });

  materialLogs.forEach((log) => {
    const key = `${log.siteId}::${log.materialId}`;
    actualTotals[key] = (actualTotals[key] || 0) + log.usedQuantity;
  });

  const alerts = Object.keys(idealTotals)
    .map((key) => {
      const actual = actualTotals[key] || 0;
      const ideal = idealTotals[key] || 0;
      const diff = actual - ideal;
      const variance = ideal ? (diff / ideal) * 100 : 0;
      return { key, actual, ideal, diff, variance };
    })
    .filter((item) => item.diff > 0);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-400">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Construction overview</h1>
            <p className="mt-2 text-sm text-slate-400">Track sites, materials, labour and cost in one place.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Total sites</p>
          <p className="mt-3 text-3xl font-semibold text-white">{totalSites}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Active sites</p>
          <p className="mt-3 text-3xl font-semibold text-white">{activeSites}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Total labour cost</p>
          <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(totalLabourCost)}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Material usage</p>
          <p className="mt-3 text-3xl font-semibold text-white">{totalMaterialUsage.toFixed(1)}</p>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white">Site progress</h2>
          <div className="mt-6 space-y-4">
            {sites.map((site) => (
              <div key={site.id} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <p>{site.name}</p>
                  <StatusBadge status={site.status} />
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-sky-500" style={{ width: `${site.status === 'COMPLETED' ? 100 : site.status === 'ONGOING' ? 50 : 15}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white">Alerts</h2>
          <div className="mt-5 space-y-3">
            {alerts.length ? (
              alerts.map((alert) => (
                <div key={alert.key} className="rounded-2xl border border-red-700 bg-red-950/40 p-4 text-sm text-slate-100">
                  <p className="font-semibold text-rose-300">Over usage detected</p>
                  <p>Ideal: {alert.ideal.toFixed(1)}, Actual: {alert.actual.toFixed(1)}, Variance: {alert.variance.toFixed(1)}%</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-emerald-700 bg-emerald-950/40 p-4 text-sm text-slate-100">No over-usage alerts. Material consumption is within expected ranges.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
