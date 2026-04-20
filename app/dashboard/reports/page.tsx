import { prisma } from '../../../lib/prisma';
import ReportTools from './ReportTools';

export default async function ReportsPage() {
  const sites = await prisma.site.findMany();
  const materialLogs = await prisma.materialLog.findMany({ include: { material: true, site: true } });
  const payrolls = await prisma.payroll.findMany({ include: { labour: true } });

  const serializableSites = sites.map((site) => ({ id: site.id, name: site.name, location: site.location, startDate: site.startDate.toISOString().slice(0, 10), status: site.status }));
  const serializableMaterialLogs = materialLogs.map((log) => ({ siteName: log.site.name, materialName: log.material.name, purchasedQuantity: log.purchasedQuantity, usedQuantity: log.usedQuantity, date: log.date.toISOString().slice(0, 10) }));
  const serializablePayrolls = payrolls.map((entry) => ({ labourName: entry.labour.name, amount: entry.amount, date: entry.date.toISOString().slice(0, 10), notes: entry.notes || '' }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Reports</h1>
        <p className="mt-2 text-sm text-slate-400">Export construction data as CSV or PDF.</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <ReportTools sites={serializableSites} materialLogs={serializableMaterialLogs} payrolls={serializablePayrolls} />
      </div>
    </div>
  );
}
