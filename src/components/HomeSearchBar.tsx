'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function HomeSearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto bg-white p-5 rounded-2xl shadow-lg border-2 border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-2xl">
          🔍
        </div>
        <input 
          type="text" 
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl py-4 pl-14 pr-6 text-lg font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400" 
          placeholder="Activité, aide, événement, ressource..." 
        />
      </div>
      <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white text-lg font-bold rounded-xl px-8 h-14 sm:w-auto w-full transition-all shadow-md cursor-pointer">
        Chercher
      </Button>
    </form>
  );
}
