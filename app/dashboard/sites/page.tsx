import { prisma } from '../../../lib/prisma';
import { createSite, deleteSite } from '../../actions/resourceActions';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../../lib/utils';

export default async function SitesPage() {
  const sites = await prisma.site.findMany({ include: { supervisor: true } });
  const supervisors = await prisma.user.findMany({ where: { role: 'SUPERVISOR' } });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Site management</h1>
        <p className="mt-2 text-sm text-slate-400">Create, review, and delete construction sites.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">New site</h2>
          <form action={createSite} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Name
              <input name="name" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Location
              <input name="location" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Start date
              <input name="startDate" type="date" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Status
              <select name="status" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                <option value="PLANNED">Planned</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              Assigned supervisor
              <select name="supervisorId" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                <option value="">None</option>
                {supervisors.map((supervisor) => (
                  <option key={supervisor.id} value={supervisor.id}>{supervisor.name}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Create site</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Sites list</h2>
          <div className="mt-6 space-y-4">
            {sites.length ? (
              sites.map((site) => (
                <div key={site.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-white">{site.name}</p>
                      <p className="text-sm text-slate-400">{site.location} • Start {formatDate(site.startDate)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={site.status} />
                      <a href={`/dashboard/sites/${site.id}`} className="rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700">Edit</a>
                      <form action={deleteSite} className="inline-block">
                        <input type="hidden" name="id" value={site.id} />
                        <button type="submit" className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-400">Delete</button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No sites added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
