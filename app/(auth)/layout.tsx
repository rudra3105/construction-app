import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'SiteSutra - Login'
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
}
