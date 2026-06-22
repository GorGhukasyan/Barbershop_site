'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface NavLink {
  href: string;
  label: string;
}

export function MobileMenu({ links, bookingHref, bookingLabel }: { links: NavLink[]; bookingHref: string; bookingLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden text-cream-muted hover:text-cream p-2"
        onClick={() => setOpen(!open)}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {open
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          }
        </svg>
      </button>

      {open && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-dark/95 backdrop-blur-md border-b border-gold/10 py-4 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-cream-muted hover:text-gold transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a href={bookingHref}>
            <Button className="mt-4 w-full">{bookingLabel}</Button>
          </a>
        </div>
      )}
    </>
  );
}
