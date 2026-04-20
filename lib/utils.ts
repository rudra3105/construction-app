export function formatDate(date: string | Date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
}

export function statusLabel(status: string) {
  switch (status) {
    case 'ONGOING':
      return 'Ongoing';
    case 'COMPLETED':
      return 'Completed';
    default:
      return 'Planned';
  }
}

export function statusColor(status: string) {
  if (status === 'COMPLETED') return 'bg-green-100 text-green-800';
  if (status === 'ONGOING') return 'bg-blue-100 text-blue-800';
  return 'bg-slate-100 text-slate-800';
}
