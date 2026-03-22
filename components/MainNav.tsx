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
    <nav className="space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
              active
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
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