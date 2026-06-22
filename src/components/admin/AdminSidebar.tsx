'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface Props {
  barberName: string;
  role: string;
  locale: string;
}

export function AdminSidebar({ barberName, role, locale }: Props) {
  const pathname = usePathname();
  const isAdmin = role === 'admin';

  const links = [
    { href: `/${locale}/admin`, label: 'Dashboard' },
    { href: `/${locale}/admin/appointments`, label: 'Appointments' },
    ...(isAdmin ? [
      { href: `/${locale}/admin/barbers`, label: 'Barbers' },
      { href: `/${locale}/admin/services`, label: 'Services' },
    ] : []),
  ];

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/${locale}/admin/login`;
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-2 border-r border-gold/15 flex flex-col">
      <div className="p-6 border-b border-gold/15">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-dark font-bold text-sm">GA</div>
          <div>
            <p className="text-cream font-medium text-sm">{barberName}</p>
            <p className="text-cream-dim text-xs capitalize">{role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all',
              pathname === link.href
                ? 'bg-gold/20 text-gold'
                : 'text-cream-muted hover:text-cream hover:bg-dark-3'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gold/15">
        <button
          onClick={signOut}
          className="w-full text-left px-4 py-3 text-cream-muted hover:text-red-400 text-sm rounded-xl hover:bg-dark-3 transition-all"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
