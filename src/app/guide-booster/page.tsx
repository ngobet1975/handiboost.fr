import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Compass } from 'lucide-react';
import { GuideBoosterClient, GuideEntry } from '@/components/GuideBoosterClient';

import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Guide Booster — Annuaire APA & Parasport | Handiboost',
  description: 'Trouvez rapidement un club, un enseignant en APA ou une Maison Sport-Santé pour orienter vos patients vers une activité physique adaptée.',
  alternates: {
    canonical: '/guide-booster',
  }
};

export default async function GuideBoosterPage() {
  const annuairePath = path.join(process.cwd(), 'src/data/annuaire.json');
  let rawEntries: any[] = [];
  try {
    rawEntries = JSON.parse(fs.readFileSync(annuairePath, 'utf8'));
  } catch {
    rawEntries = [];
  }

  const filePath = path.join(process.cwd(), 'src/data/structures.json');
  let structures = [];
  if (fs.existsSync(filePath)) {
    structures = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  const activitesPath = path.join(process.cwd(), 'src/data/activites.json');
  let activites: string[] = [];
  if (fs.existsSync(activitesPath)) {
    activites = JSON.parse(fs.readFileSync(activitesPath, 'utf8'));
  }

  const entries: GuideEntry[] = rawEntries
    .filter((e: any) => e.status === 'published')
    .sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))
    .map((e: any) => ({
      id: e.id,
      name: e.name,
      provider: e.provider,
      description: e.description,
      url: e.url,
      scope: e.scope,
      type: e.type,
      verified_at: null,
    }));

  const cookieStore = await cookies();
  const isLogged = cookieStore.has('pro_session') || cookieStore.has('admin_session');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Breadcrumb & Logout */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-500">
            <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
            <span>&gt;</span>
            <span className="text-slate-800">Guide Booster</span>
          </div>
          {isLogged && (
            <div className="flex items-center gap-3">
              <Link href="/profil" className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-blue-200">
                👤 Mon Profil
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                  Se déconnecter
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        {/* Hero */}
        <section className="mb-12 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-800 px-5 py-2.5 rounded-full font-bold text-sm mb-6">
            <Compass className="w-5 h-5" />
            Outil pour les professionnels de santé
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Trouvez une structure <span className="text-blue-700">APA</span> pour votre patient
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-10">
            Le Guide Booster centralise les annuaires officiels pour vous aider à orienter rapidement vos patients vers une pratique adaptée.
          </p>

          {/* 3-step process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-black text-xl mx-auto mb-3">1</div>
              <p className="text-lg font-bold text-slate-800">Cherchez</p>
              <p className="text-sm text-slate-500">Trouvez un annuaire adapté</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-black text-xl mx-auto mb-3">2</div>
              <p className="text-lg font-bold text-slate-800">Identifiez</p>
              <p className="text-sm text-slate-500">Repérez la structure la plus proche</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-black text-xl mx-auto mb-3">3</div>
              <p className="text-lg font-bold text-slate-800">Orientez</p>
              <p className="text-sm text-slate-500">Transmettez les coordonnées au patient</p>
            </div>
          </div>
        </section>

        {/* Search + Results */}
        <GuideBoosterClient entries={entries} structures={structures} activites={activites} />
      </div>
    </div>
  );
}
