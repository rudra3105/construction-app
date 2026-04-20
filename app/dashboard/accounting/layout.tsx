import { requireAdmin } from '../../../lib/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounting - SiteSutra'
};

export default function AccountingLayout({ children }: { children: React.ReactNode }) {
  requireAdmin();
  return <>{children}</>;
}
