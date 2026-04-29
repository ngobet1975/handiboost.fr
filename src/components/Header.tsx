"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname() || '';

  const getLinkClass = (path: string, activeColorClass: string) => {
    const isActive = pathname.startsWith(path);
    return `text-2xl font-bold underline-offset-8 decoration-4 transition-all ${
      isActive 
        ? `${activeColorClass} underline` 
        : `text-slate-800 hover:${activeColorClass} hover:underline`
    }`;
  };

  return (
    <header className="px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between bg-white border-b-4 border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4 lg:gap-5">
        <Link href="/">
          <img src="/logo-handiboost.png" alt="Handiboost" className="h-16 lg:h-24 w-auto object-contain" />
        </Link>
      </div>
      <nav className="hidden xl:flex items-center gap-10">
        <Link href="/association" className={getLinkClass('/association', 'text-blue-800')}>L'Association</Link>
        <Link href="/pratiquants" className={getLinkClass('/pratiquants', 'text-blue-800')}>Pratiquants</Link>
        <Link href="/professionnels" className={getLinkClass('/professionnels', 'text-purple-800')}>Professionnels</Link>
        <Link href="/actualites" className={getLinkClass('/actualites', 'text-pink-700')}>Actualités</Link>
        <Link href="/contact" className={getLinkClass('/contact', 'text-blue-800')}>Contact</Link>
      </nav>
      <div className="flex items-center gap-6 hidden xl:flex">
        <Link href="/don">
          <Button variant="outline" className="text-xl font-extrabold border-4 border-pink-600 text-pink-700 hover:bg-pink-100 h-16 px-8 rounded-2xl transition-all">❤️ Faire un don</Button>
        </Link>
        <Link href="/login">
          <Button className="bg-purple-700 hover:bg-purple-800 text-xl font-extrabold h-16 px-8 shadow-xl rounded-2xl transition-all text-white">Accès Guide Booster</Button>
        </Link>
      </div>
      {/* Mobile menu button */}
      <button className="xl:hidden p-2 text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 border-2 border-slate-300 transition-colors" aria-label="Menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </header>
  );
}
