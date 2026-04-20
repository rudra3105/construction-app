import { prisma } from '../../../lib/prisma';
import { createAttendance, deleteAttendance } from '../../actions/resourceActions';
import { formatDate } from '../../../lib/utils';

export default async function AttendancePage() {
  const sites = await prisma.site.findMany();
  const labours = await prisma.labour.findMany();
  const attendance = await prisma.attendance.findMany({ include: { labour: true, site: true } });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Attendance</h1>
        <p className="mt-2 text-sm text-slate-400">Mark daily attendance for workers on site.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Add attendance</h2>
          <form action={createAttendance} className="mt-6 space-y-4">
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
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input name="present" type="checkbox" className="h-5 w-5 rounded border-slate-600 bg-slate-950 text-sky-500 focus:ring-sky-500" />
              Present
            </label>
            <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Record attendance</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Attendance records</h2>
          <div className="mt-6 space-y-4">
            {attendance.length ? (
              attendance.map((record) => (
                <div key={record.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-white">{record.labour.name}</p>
                      <p className="text-sm text-slate-400">{record.site.name} • {formatDate(record.date)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-2xl px-3 py-1 text-sm font-semibold ${record.present ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                        {record.present ? 'Present' : 'Absent'}
                      </span>
                      <form action={deleteAttendance}>
                        <input type="hidden" name="id" value={record.id} />
                        <button type="submit" className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-400">Delete</button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No attendance records yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
