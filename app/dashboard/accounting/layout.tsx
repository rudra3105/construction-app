import { requireAdmin } from '../../../lib/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounting - SiteSutra'
};

export default async function AccountingLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
