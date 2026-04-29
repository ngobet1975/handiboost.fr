import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { OuPratiquerClient } from '@/components/OuPratiquerClient';
import { DirectoryData } from '@/components/DirectoryCard';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Où pratiquer ? Annuaire Handiboost',
  description: 'Trouvez un club sportif, un enseignant en Activité Physique Adaptée (APA) ou une ressource pour pratiquer près de chez vous.',
  alternates: {
    canonical: '/pratiquants/ou-pratiquer',
  }
};

export default async function OuPratiquerPage() {
  const supabase = await createClient();
  const { data: rawDirectories } = await supabase
    .from("directories")
    .select("*")
    .eq("status", "published");

  const data: DirectoryData[] = (rawDirectories ?? []).map((item) => ({
    id: item.id,
    title: item.name,
    description: item.description || '',
    category: "club",
    resourceType: item.scope === "national" ? "annuaire-national" : "ressource-locale",
    regions: item.scope === "national" ? ["Toutes les régions"] : [item.scope || "Auvergne-Rhône-Alpes"],
    publics: ["tous publics"],
    externalUrl: item.url,
  }));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <Link href="/pratiquants" className="hover:text-blue-800 hover:underline transition-all">Pratiquants</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Où pratiquer</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-16">
        {/* Hero Section */}
        <section className="mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Où pratiquer ?
          </h1>
          <p className="text-2xl text-slate-700 font-medium leading-relaxed">
            Recherchez une activité sportive en club, une pratique à la maison ou un professionnel de l'Activité Physique Adaptée.
          </p>
        </section>

        {/* Composant Client (Moteur de recherche + Grille) */}
        <OuPratiquerClient data={data} />
      </div>
    </div>
  );
}
