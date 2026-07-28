"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';

export function Header() {
  const pathname = usePathname() || '';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClass = (path: string, activeColorClass: string) => {
    const isActive = pathname.startsWith(path);
    return `text-xl xl:text-2xl font-bold underline-offset-8 decoration-4 transition-all ${
      isActive 
        ? `${activeColorClass} underline` 
        : `text-slate-800 hover:${activeColorClass} hover:underline`
    }`;
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="sticky top-0 z-[100] flex flex-col w-full">
      <div className="bg-red-600 text-white text-center py-1.5 px-3 md:py-2 md:px-4 text-xs md:text-sm lg:text-base font-bold shadow-sm flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        Site en maintenance, attention informations non vérifiées pour le moment
      </div>
      <header className="px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between bg-white border-b-4 border-slate-200 shadow-sm relative">
      <div className="flex items-center gap-4 lg:gap-5">
        <Link href="/" onClick={closeMenu}>
          <img src="/logo-handiboost.png" alt="Handiboost" className="h-16 lg:h-24 w-auto object-contain" />
        </Link>
      </div>
      <nav className="hidden xl:flex items-center gap-10 pr-10 border-r-4 border-slate-200">
        <Link href="/association" className={getLinkClass('/association', 'text-blue-800')}>L'Association</Link>
        <Link href="/pratiquants" className={getLinkClass('/pratiquants', 'text-blue-800')}>Pratiquants</Link>
        <Link href="/professionnels" className={getLinkClass('/professionnels', 'text-purple-800')}>Professionnels</Link>
        <Link href="/actualites" className={getLinkClass('/actualites', 'text-pink-700')}>Actualités</Link>
        <Link href="/contact" className={getLinkClass('/contact', 'text-blue-800')}>Contact</Link>
      </nav>
      <div className="hidden xl:flex items-center gap-6 pl-2">
        <Button nativeButton={false} render={<Link href="/dons" />} variant="outline" className="text-xl font-extrabold border-4 border-pink-600 text-pink-700 hover:bg-pink-100 h-16 px-8 rounded-2xl transition-all">
          ❤️ Faire un don
        </Button>
        <Button nativeButton={false} render={<Link href="/login" />} className="bg-purple-700 hover:bg-purple-800 text-xl font-extrabold h-16 px-8 shadow-xl rounded-2xl transition-all text-white">
          Accès Guide Booster
        </Button>
      </div>
      {/* Mobile menu button */}
      <button 
        className="xl:hidden p-2 text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 border-2 border-slate-300 transition-colors z-50" 
        aria-label="Menu"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-8 h-8" strokeWidth={2.5} />
        ) : (
          <Menu className="w-8 h-8" strokeWidth={2.5} />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop sombre — clic ferme le menu */}
          <div
            className="fixed inset-0 bg-slate-900/50 z-40 xl:hidden animate-in fade-in duration-200"
            onClick={closeMenu}
            aria-hidden="true"
          />
          {/* Menu déroulant scrollable */}
          <div className="absolute top-full left-0 right-0 bg-white border-b-4 border-slate-200 shadow-xl p-6 flex flex-col gap-6 xl:hidden z-50 max-h-[calc(100vh-100px)] overflow-y-auto animate-in slide-in-from-top-4">
            <nav className="flex flex-col gap-6">
              <Link href="/association" onClick={closeMenu} className={getLinkClass('/association', 'text-blue-800')}>L'Association</Link>
              <Link href="/pratiquants" onClick={closeMenu} className={getLinkClass('/pratiquants', 'text-blue-800')}>Pratiquants</Link>
              <Link href="/professionnels" onClick={closeMenu} className={getLinkClass('/professionnels', 'text-purple-800')}>Professionnels</Link>
              <Link href="/actualites" onClick={closeMenu} className={getLinkClass('/actualites', 'text-pink-700')}>Actualités</Link>
              <Link href="/contact" onClick={closeMenu} className={getLinkClass('/contact', 'text-blue-800')}>Contact</Link>
            </nav>
            <div className="flex flex-col gap-4 mt-4 pt-6 border-t-2 border-slate-100">
              <Button nativeButton={false} render={<Link href="/dons" onClick={closeMenu} />} variant="outline" className="w-full text-xl font-extrabold border-4 border-pink-600 text-pink-700 hover:bg-pink-100 h-16 rounded-2xl transition-all">
                ❤️ Faire un don
              </Button>
              <Button nativeButton={false} render={<Link href="/login" onClick={closeMenu} />} className="w-full bg-purple-700 hover:bg-purple-800 text-xl font-extrabold h-16 shadow-xl rounded-2xl transition-all text-white">
                Accès Guide Booster
              </Button>
            </div>
          </div>
        </>
      )}
      </header>
    </div>
  );
}
