import { requireUser } from '../../lib/auth';
import Sidebar from '../components/Sidebar';
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'SiteSutra'
};

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
