import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import MainNav from '@/components/MainNav';
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Student OS',
  description: 'Studentský plánovač, focus tracker a statistiky',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:flex-row md:p-6">
            <aside className="w-full shrink-0 md:w-72">
              <div className="sticky top-6 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        Student OS
                      </p>
                      <h1 className="text-2xl font-bold">Seminární práce</h1>
                    </div>
                    <ThemeToggle />
                  </div>

                  <MainNav />
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Co tím plníš
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li>• 4 smysluplné obrazovky</li>
                    <li>• tabulka termínů</li>
                    <li>• validace vstupů</li>
                    <li>• grafy a vlastní komponenta</li>
                  </ul>
                </div>
              </div>
            </aside>

            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}