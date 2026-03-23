'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CalendarDays,
  Home,
  Layers3,
} from 'lucide-react';

const items = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/planner', label: 'Planner', icon: CalendarDays },
  { href: '/subjects', label: 'Subjects', icon: Layers3 },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium transition-colors',
              active
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70',
            ].join(' ')}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}