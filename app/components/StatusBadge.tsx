export default function StatusBadge({ status }: { status: string }) {
  const colors =
    status === 'COMPLETED'
      ? 'bg-emerald-100 text-emerald-900'
      : status === 'ONGOING'
      ? 'bg-sky-100 text-sky-900'
      : 'bg-slate-100 text-slate-900';
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors}`}>{status.toLowerCase()}</span>;
}
