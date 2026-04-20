'use client';

type IncomeRow = { amount: number; date: string; source: string; paymentMethod: string; site: string; reference: string };
type ExpenseRow = { amount: number; date: string; category: string; paymentMethod: string; site: string; notes: string };

function downloadFile(content: string, filename: string, mimeType = 'text/csv') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string | number) {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
}

export default function ReportTools({ incomes, expenses }: { incomes: IncomeRow[]; expenses: ExpenseRow[] }) {
  const exportCsv = (rows: any[], filename: string, headers: string[], keys: string[]) => {
    const csvRows = rows.map((row) => keys.map((key) => csvEscape(row[key] ?? '')).join(','));
    const csv = [headers.join(','), ...csvRows].join('\n');
    downloadFile(csv, filename);
  };

  const exportPdf = () => {
    const doc = document.implementation.createHTMLDocument('Report');
    const content = `Income rows: ${incomes.length}\nExpense rows: ${expenses.length}`;
    downloadFile(content, 'accounting-report.txt', 'text/plain');
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <button onClick={() => exportCsv(incomes, 'income-report.csv', ['Amount', 'Date', 'Source', 'PaymentMethod', 'Site', 'Reference'], ['amount', 'date', 'source', 'paymentMethod', 'site', 'reference'])} className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
        Export income CSV
      </button>
      <button onClick={() => exportCsv(expenses, 'expense-report.csv', ['Amount', 'Date', 'Category', 'PaymentMethod', 'Site', 'Notes'], ['amount', 'date', 'category', 'paymentMethod', 'site', 'notes'])} className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
        Export expense CSV
      </button>
      <button onClick={exportPdf} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
        Export PDF
      </button>
    </div>
  );
}
