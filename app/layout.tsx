import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SiteSutra',
  description: 'SiteSutra construction site management progressive web app.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.svg" />
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-800 bg-slate-950/95 px-4 py-4 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} SiteSutra. Developed by <a href="https://www.webriseglobal.com/" target="_blank" rel="noreferrer" className="text-sky-300 hover:text-sky-200">Webrise Global</a>.</p>
        </footer>
      </body>
    </html>
  );
}
