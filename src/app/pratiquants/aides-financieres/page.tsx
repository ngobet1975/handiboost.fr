import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { AideCard, AideData } from '@/components/AideCard';
import { Button } from '@/components/ui/button';
import { Landmark, ShieldPlus, Heart, Building, Users } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Aides Financières pour le Sport Adapté | Handiboost',
  description: 'Découvrez les aides de l\'État, de la MDPH, des mutuelles et des collectivités pour financer votre pratique sportive ou votre matériel adapté.',
  alternates: {
    canonical: '/pratiquants/aides-financieres',
  }
};

const CATEGORIES = [
  { id: 'etat', title: 'Aides Nationales (État)', icon: <Landmark className="w-8 h-8 text-blue-700" />, desc: "Aides forfaitaires versées par l'État pour tous." },
  { id: 'mdph', title: 'Aides liées au Handicap (MDPH)', icon: <ShieldPlus className="w-8 h-8 text-purple-700" />, desc: "Aides spécifiques pour le surcoût lié au handicap (matériel, aide humaine)." },
  { id: 'mutuelle', title: 'Mutuelles & Complémentaires Santé', icon: <Heart className="w-8 h-8 text-teal-700" />, desc: "Remboursements du Sport sur Ordonnance (APA)." },
  { id: 'collectivite', title: 'Aides Locales (Régions, Départements)', icon: <Building className="w-8 h-8 text-orange-700" />, desc: "Coupons sport et aides spécifiques à votre territoire." },
  { id: 'association', title: 'Aides Associatives et Clubs', icon: <Users className="w-8 h-8 text-pink-700" />, desc: "Fonds de dotation et aides internes des fédérations." }
];

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
    category: "etat",
    eligibility: item.conditions ?? [],
    amountLabel: item.amount,
    externalUrl: item.resources?.[0]?.url,
    officialSourceName: item.resources?.[0]?.label,
    status: "published"
  }));

  // Regroupement des aides par catégorie
  const aidesByCategory = CATEGORIES.map(cat => ({
    ...cat,
    aides: allAides.filter(aide => aide.category === cat.id && aide.status === 'published')
  })).filter(cat => cat.aides.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <Link href="/pratiquants" className="hover:text-blue-800 hover:underline transition-all">Pratiquants</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Aides Financières</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 md:mt-12 md:pt-16">
        {/* Hero Section */}
        <section className="mb-16 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Financer sa pratique <span className="text-blue-700">sportive adaptée</span>
          </h1>
          <div className="mt-8 bg-blue-50 border border-blue-200 text-slate-800 p-6 md:p-8 rounded-2xl text-left shadow-sm">
            <p className="text-xl md:text-2xl font-medium leading-relaxed">
              Certaines aides peuvent financer une activité physique adaptée. Les conditions changent selon votre situation. Vérifiez toujours les informations sur le site officiel.
            </p>
          </div>
        </section>

        {/* Sommaire des sections (Optionnel pour la V1 mais utile) */}
        <nav className="mb-16 bg-white p-6 md:p-8 rounded-2xl shadow-sm border-2 border-slate-100 hidden md:block">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Accès rapide :</h2>
          <div className="flex flex-wrap gap-4">
            {aidesByCategory.map((cat) => (
              <a 
                key={`link-${cat.id}`} 
                href={`#cat-${cat.id}`}
                className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {cat.icon}
                {cat.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Sections des aides */}
        <div className="space-y-16">
          {aidesByCategory.map((cat) => (
            <section key={`cat-${cat.id}`} id={`cat-${cat.id}`} className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  {cat.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900">{cat.title}</h2>
                  <p className="text-lg text-slate-600 font-medium mt-1">{cat.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
                {cat.aides.map((aide) => (
                  <AideCard key={aide.id} aide={aide} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Call to action bas de page */}
        <section className="mt-20 bg-blue-800 text-white p-8 md:p-12 rounded-3xl text-center shadow-xl">
          <h3 className="text-3xl font-bold mb-4">Vous ne trouvez pas la bonne aide ?</h3>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Les assistants sociaux de votre MDPH ou de votre Centre Communal d'Action Sociale (CCAS) peuvent vous accompagner gratuitement dans le montage d'un dossier de financement.
          </p>
          <Button nativeButton={false} render={<Link href="/contact" />} className="bg-white text-blue-900 hover:bg-slate-100 font-bold text-lg h-14 px-8 rounded-xl">
            Nous contacter pour un conseil
          </Button>
        </section>

      </div>
    </div>
  );
}
