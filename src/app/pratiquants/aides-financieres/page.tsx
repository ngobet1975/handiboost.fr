import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { AideCard, AideData } from '@/components/AideCard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Aides Financières pour le Sport Adapté | Handiboost',
  description: 'Découvrez les aides de l\'État, de la MDPH, des mutuelles et des collectivités pour financer votre pratique sportive ou votre matériel adapté.',
  alternates: {
    canonical: '/pratiquants/aides-financieres',
  }
};

export default async function AidesFinancieresPage() {
  let rawAides: any[] = [];
  try {
    rawAides = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/aides-financieres.json'), 'utf8'));
  } catch {
    rawAides = [];
  }

  const allAides: AideData[] = rawAides.map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description ?? "",
    category: item.category || "etat",
    eligibility: item.conditions ?? [],
    amountLabel: item.amount,
    externalUrl: item.resources?.[0]?.url,
    officialSourceName: item.resources?.[0]?.label,
    status: "published"
  }));

  return (
    <div className="min-h-screen bg-[#FDF8F5] pb-20">
      
      {/* Container principal contraint comme sur la maquette */}
      <div className="max-w-4xl mx-auto bg-[#FDF8F5] px-4 md:px-8 pt-12">
        
        {/* Header (Titre + Sous-titre) */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="flex flex-col items-center relative w-full">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight z-10 relative">
              Aides financières à la pratique <br/>
              <span style={{ color: '#ED1B5F' }}>d'Activité Physique</span>
            </h1>
            {/* L'illustration se trouve en haut à gauche de ce bloc sur la maquette, je la mets en absolu */}
            <div className="absolute left-0 top-0 hidden md:block">
              <img src="/illustrations/7.png" alt="" className="h-24 w-auto object-contain" />
            </div>
          </div>
          
          <div className="mt-8 bg-blue-50/50 border border-blue-100 text-slate-700 p-6 rounded-xl max-w-2xl text-center shadow-sm">
            <p className="text-sm font-medium leading-relaxed">
              Selon votre situation, des aides et dispositifs peuvent vous permettre de réduire le coût de votre pratique d'activité physique.
            </p>
            <p className="text-sm font-medium leading-relaxed mt-4">
              Retrouvez les principales solutions et les démarches à connaître.
            </p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Accès rapide / Filtres */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Accès rapide :</h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="bg-[#ED1B5F] text-white px-2 py-0.5 rounded">N</span>
              Aides Nationales (État)
            </div>
            <div className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="bg-[#1566B1] text-white px-2 py-0.5 rounded">R</span>
              Aides régionales
            </div>
            <div className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="bg-[#FBA91C] text-white px-2 py-0.5 rounded">L</span>
              Aides locales
            </div>
          </div>
        </div>

        {/* Grille des cartes d'aides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allAides.map((aide) => (
            <AideCard key={aide.id} aide={aide} />
          ))}
        </div>

        {/* Call to action bas de page */}
        <div className="mt-16 bg-[#1566B1] text-white p-8 rounded-2xl text-center shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Vous ne trouvez pas la bonne aide ?</h3>
          <p className="text-sm mb-6 max-w-2xl mx-auto text-blue-50 font-medium leading-relaxed">
            Vous ne trouvez pas l'aide adaptée à votre situation ? La MDPH, votre CCAS ou un assistant social peuvent vous informer sur vos droits et vous accompagner dans vos démarches.
          </p>
          <Button nativeButton={false} render={<Link href="/contact" />} className="bg-white text-[#1566B1] hover:bg-slate-100 font-bold text-sm h-10 px-6 rounded-md">
            Nous contacter pour un conseil
          </Button>
        </div>

      </div>
    </div>
  );
}
