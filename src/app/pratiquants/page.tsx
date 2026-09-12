import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { MapPin, Calendar, Coins, Stethoscope, Lightbulb, ArrowRight, Activity, Heart, Brain, Bone, Eye, Dumbbell, Ribbon, PersonStanding, Apple, Users, Flower, Sun, HeartPulse } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Espace Pratiquants | Handiboost',
  description: 'Trouvez une activité physique adaptée, un événement, ou des aides financières pour votre pratique sportive.',
  alternates: {
    canonical: '/pratiquants',
  }
};

// Couleurs alternées pour les cartes pathologies (style ancien site)
const PATHO_COLORS = [
  { bg: 'bg-amber-400', hover: 'hover:bg-amber-500' },
  { bg: 'bg-pink-500', hover: 'hover:bg-pink-600' },
  { bg: 'bg-cyan-400', hover: 'hover:bg-cyan-500' },
  { bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
];

const getIconForPatho = (slug: string) => {
  if (slug.includes('sclerose')) return <Activity className="w-12 h-12 text-white" />;
  if (slug.includes('paralysie') || slug.includes('moteur')) return <PersonStanding className="w-12 h-12 text-white" />;
  if (slug.includes('tca') || slug.includes('alimentaire')) return <Apple className="w-12 h-12 text-white" />;
  if (slug.includes('neuromusculaire')) return <Dumbbell className="w-12 h-12 text-white" />;
  if (slug.includes('age') || slug.includes('senior')) return <Users className="w-12 h-12 text-white" />;
  if (slug.includes('endometriose')) return <Flower className="w-12 h-12 text-white" />;
  if (slug.includes('mentale') || slug.includes('psy')) return <Sun className="w-12 h-12 text-white" />;
  if (slug.includes('cancer')) return <Ribbon className="w-12 h-12 text-white" />;
  if (slug.includes('cardio')) return <Heart className="w-12 h-12 text-white" />;
  if (slug.includes('neuro')) return <Brain className="w-12 h-12 text-white" />;
  if (slug.includes('articu') || slug.includes('os')) return <Bone className="w-12 h-12 text-white" />;
  if (slug.includes('visu')) return <Eye className="w-12 h-12 text-white" />;
  return <HeartPulse className="w-12 h-12 text-white" />;
};

export default async function PratiquantsHubPage() {
  let rawPathologies: any[] = [];
  try {
    rawPathologies = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/pathologies.json'), 'utf8'));
  } catch {
    rawPathologies = [];
  }
  const pathologies = rawPathologies.filter((p: any) => p.validationStatus !== 'rejected');

  const cards = [
    {
      title: "Trouver une activité physique",
      description: "Clubs, maisons sport santé, enseignants en APA, kinés — trouvez le professionnel ou la structure adaptée près de chez vous.",
      href: "/pratiquants/ou-pratiquer",
      color: "#1566B1",
      icon: <MapPin className="w-7 h-7" />,
      buttonText: "Trouver une activité"
    },
    {
      title: "Événements sportifs adaptés",
      description: "Découvrez les événements et compétitions de sport adapté organisés près de chez vous.",
      href: "/pratiquants/evenements",
      color: "#ED1B5F",
      icon: <Calendar className="w-7 h-7" />,
      buttonText: "Voir l'agenda"
    },
    {
      title: "Conseils par pathologie",
      description: "Fiches pratiques pour mieux comprendre votre pathologie et adapter votre pratique d'activité physique en toute sécurité.",
      href: "/pratiquants/conseils-par-pathologie",
      color: "#FBA91C",
      icon: <Stethoscope className="w-7 h-7" />,
      buttonText: "Voir les fiches"
    },
    {
      title: "Aides financières",
      description: "Toutes les aides et dispositifs existants pour financer votre pratique sportive adaptée.",
      href: "/pratiquants/aides-financieres",
      color: "#654B9E",
      icon: <Coins className="w-7 h-7" />,
      buttonText: "Voir les aides"
    },
    {
      title: "Tester ses connaissances",
      description: "Quiz et auto-évaluations pour tout savoir sur l'APA, la sédentarité et les recommandations de pratique.",
      href: "/pratiquants/tester-ses-connaissances",
      color: "#38B2AC",
      icon: <Lightbulb className="w-7 h-7" />,
      buttonText: "Démarrer un quiz"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative overflow-hidden">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Pratiquants</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-16 relative z-10">
        
        {/* Hero Section */}
        <section className="mb-16 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Espace Pratiquants
          </h1>
          <p className="text-2xl text-slate-600 font-medium leading-relaxed">
            Trouvez rapidement une activité physique, un événement près de chez vous, ou des conseils pour bouger en toute sécurité.
          </p>
        </section>

        {/* Grille de Cartes Navigation */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {cards.map((card, idx) => (
              <Link 
                key={idx} 
                href={card.href}
                className="group bg-white flex flex-col justify-between p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
              >
                {/* Accent coloré en haut */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: card.color }} />
                
                <div>
                  {/* Icône */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${card.color}18`, color: card.color }}>
                    {card.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                    {card.title}
                  </h2>
                  <p className="text-base text-slate-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Bouton sobre */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: card.color }}>{card.buttonText}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* Section Pathologies — Grille colorée à la WordPress */}
        {/* ═══════════════════════════════════════════════ */}
        {pathologies && pathologies.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 text-center">
              Découvrez les activités physiques adaptées
            </h2>
            <p className="text-xl text-slate-600 font-medium text-center mb-10 max-w-3xl mx-auto">
              Sélectionnez votre pathologie pour découvrir des recommandations, des bénéfices et des conseils pour votre pratique d'activité physique.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pathologies.map((patho, idx) => {
                const colorSet = PATHO_COLORS[idx % PATHO_COLORS.length];
                const icon = getIconForPatho(patho.slug || '');

                return (
                  <Link
                    key={patho.id}
                    href={`/pratiquants/conseils-par-pathologie/${patho.slug}`}
                    className={`group relative rounded-3xl overflow-hidden shadow-lg ${colorSet.bg} ${colorSet.hover} transition-all hover:-translate-y-2 hover:shadow-2xl`}
                  >
                    {/* Icon area */}
                    <div className="flex items-center justify-center h-36 relative">
                      <div className="opacity-90 group-hover:scale-110 transition-transform">
                        {icon}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <div className="px-4 pb-5 text-center">
                      <h3 className="text-lg font-black text-white uppercase tracking-wide leading-tight">
                        {patho.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Illustration Footer */}
        <div className="flex justify-center mt-12 mb-8">
          <img src="/illustrations/7.png" alt="Illustration pratiquants" className="max-w-full h-auto md:h-64 object-contain" />
        </div>

      </div>
    </div>
  );
}
