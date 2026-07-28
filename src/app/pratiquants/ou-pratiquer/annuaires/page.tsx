import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { OuPratiquerClient } from '@/components/OuPratiquerClient';
import { DirectoryData } from '@/components/DirectoryCard';
import fs from 'fs';
import path from 'path';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Annuaires partenaires — Handiboost',
  description: 'Consultez tous les annuaires nationaux et régionaux partenaires de Handiboost pour trouver un club, un enseignant APA ou un kiné.',
  alternates: { canonical: '/pratiquants/ou-pratiquer/annuaires' },
};

export default async function AnnuairesPage() {
  let rawDirectories: any[] = [];
  try {
    rawDirectories = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/annuaire.json'), 'utf8'));
  } catch { rawDirectories = []; }

  const data: DirectoryData[] = rawDirectories
    .filter((item: any) => item.status === 'published')
    .map((item: any) => ({
      id: item.id,
      title: item.name,
      description: item.description || '',
      category: 'club',
      resourceType: item.scope === 'national' ? 'annuaire-national' : 'ressource-locale',
      regions: item.scope === 'national' ? ['Toutes les régions'] : [item.scope || 'Auvergne-Rhône-Alpes'],
      publics: ['tous publics'],
      externalUrl: item.url,
    }));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>›</span>
          <Link href="/pratiquants" className="hover:text-blue-800 hover:underline transition-all">Pratiquants</Link>
          <span>›</span>
          <Link href="/pratiquants/ou-pratiquer" className="hover:text-blue-800 hover:underline transition-all">Trouver une activité</Link>
          <span>›</span>
          <span className="text-slate-800">Annuaires</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-8">
          <Link href="/pratiquants/ou-pratiquer" className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-bold text-base hover:underline">
            <ArrowLeft className="w-4 h-4" /> Retour à HandiAssistant
          </Link>
        </div>
        <section className="mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">Annuaires partenaires</h1>
          <p className="text-2xl text-slate-700 font-medium leading-relaxed">
            Retrouvez tous les annuaires nationaux et régionaux pour pratiquer une activité sportive adaptée.
          </p>
        </section>
        <OuPratiquerClient data={data} />
      </div>
    </div>
  );
}
