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
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 md:flex-row md:px-6">
            <aside className="w-full shrink-0 md:w-[260px]">
              <div className="sticky top-5">
                <div className="ui-card p-5">
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <p className="ui-eyebrow">Student OS</p>
                      <h1 className="mt-1 text-[2rem] font-bold tracking-tight leading-none">
                        Seminární práce
                      </h1>
                    </div>
                    <ThemeToggle />
                  </div>

                  <MainNav />
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