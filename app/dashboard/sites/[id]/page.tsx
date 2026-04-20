import { prisma } from '../../../../lib/prisma';
import { updateSite } from '../../../actions/resourceActions';
import StatusBadge from '../../../components/StatusBadge';
import { formatDate } from '../../../../lib/utils';

interface PageProps {
  params: { id: string };
}

export default async function SiteDetailPage({ params }: PageProps) {
  const site = await prisma.site.findUnique({
    where: { id: params.id },
    include: { supervisor: true }
  });
  const supervisors = await prisma.user.findMany({ where: { role: 'SUPERVISOR' } });
  if (!site) return <p className="text-slate-300">Site not found.</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-400">Site details</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{site.name}</h1>
            <p className="mt-2 text-sm text-slate-400">Update the site information and status.</p>
          </div>
          <StatusBadge status={site.status} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <form action={updateSite} className="grid gap-4">
          <input type="hidden" name="id" value={site.id} />
          <label className="block text-sm text-slate-300">
            Name
            <input name="name" defaultValue={site.name} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>
          <label className="block text-sm text-slate-300">
            Location
            <input name="location" defaultValue={site.location} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>
          <label className="block text-sm text-slate-300">
            Start date
            <input name="startDate" type="date" defaultValue={formatDate(site.startDate)} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>
          <label className="block text-sm text-slate-300">
            Status
            <select name="status" defaultValue={site.status} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
              <option value="PLANNED">Planned</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </label>
          <label className="block text-sm text-slate-300">
            Supervisor
            <select name="supervisorId" defaultValue={site.supervisorId ?? ''} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
              <option value="">None</option>
              {supervisors.map((supervisor) => (
                <option key={supervisor.id} value={supervisor.id}>{supervisor.name}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Save changes</button>
        </form>
      </div>
    </div>
  );
}
