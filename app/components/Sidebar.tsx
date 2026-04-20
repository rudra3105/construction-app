import Link from 'next/link';
import { logoutAction } from '../actions/authActions';
import { getCurrentUser } from '../../lib/auth';

const menu = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Sites', href: '/dashboard/sites' },
  { label: 'Work Logs', href: '/dashboard/work-logs' },
  { label: 'Materials', href: '/dashboard/materials' },
  { label: 'Ideal Rules', href: '/dashboard/ideal-rules' },
  { label: 'Labour', href: '/dashboard/labours' },
  { label: 'Attendance', href: '/dashboard/attendance' },
  { label: 'Payroll', href: '/dashboard/payroll' },
  { label: 'Reports', href: '/dashboard/reports' }
];

const accountingMenu = [
  { label: 'Accounting', href: '/dashboard/accounting' },
  { label: 'Income', href: '/dashboard/accounting/income' },
  { label: 'Expense', href: '/dashboard/accounting/expense' },
  { label: 'LPO', href: '/dashboard/accounting/lpo' },
  { label: 'Accounting Reports', href: '/dashboard/accounting/reports' }
];

export default async function Sidebar() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950 p-5 md:block">
      <div className="mb-8">
        <Link href="/dashboard" className="text-xl font-semibold text-white">
          SiteSutra
        </Link>
        <p className="mt-2 text-sm text-slate-400">SiteSutra construction management tool</p>
      </div>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900/80 hover:text-white">
            {item.label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div className="mt-6 border-t border-slate-800 pt-4">
              {accountingMenu.map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900/80 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-800 pt-4">
              <Link href="/dashboard/users" className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900/80 hover:text-white">
                Users
              </Link>
            </div>
          </>
        )}
      </nav>

      <form action={logoutAction} className="mt-8">
        <button type="submit" className="w-full rounded-2xl bg-slate-800 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-700">
          Sign out
        </button>
      </form>
    </aside>
  );
}
