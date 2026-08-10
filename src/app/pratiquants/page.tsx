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
      description: "Trouver un club, une maison sport santé, un enseignant en APA et/ou un kiné près de chez vous.",
      href: "/pratiquants/ou-pratiquer",
      bg: "#1566B1",
      buttonBg: "#3B89D1",
      buttonText: "Trouver une activité"
    },
    {
      title: "Trouver un événement sportif",
      description: "Découvrir les événements sportifs adaptés proche de chez vous.",
      href: "/pratiquants/evenements",
      bg: "#ED1B5F",
      buttonBg: "#E96282",
      buttonText: "Voir l'agenda"
    },
    {
      title: "Conseils pour la pratique d'une activité physique",
      description: "Lire nos fiches conseils pour en apprendre plus sur votre pathologie et votre pratique d'activité physique.",
      href: "/pratiquants/conseils-par-pathologie",
      bg: "#FBA91C",
      buttonBg: "#FFBD4B",
      buttonText: "Voir les fiches"
    },
    {
      title: "Aides financières à la pratique d'activité physique",
      description: "Découvrir les aides existantes pour votre pratique d'activité physique.",
      href: "/pratiquants/aides-financieres",
      bg: "#654B9E",
      buttonBg: "#8F77C4",
      buttonText: "Voir les aides"
    },
    {
      title: "Tester vos connaissances sur l'activité physique",
      description: "Faire les quiz pour tout savoir sur l'Activité Physique Adaptée, la sédentarité, les recommandations ...",
      href: "/pratiquants/tester-ses-connaissances",
      bg: "#38B2AC",
      buttonBg: "#4FD1C5",
      buttonText: "Voir les tests"
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
          <p className="text-2xl text-slate-700 font-medium leading-relaxed">
            Trouvez rapidement une activité physique, un événement près de chez vous, ou des conseils pour bouger en toute sécurité.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* Grille de Cartes Navigation — Accès rapide EN PREMIER */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {cards.map((card, idx) => (
              <Link 
                key={idx} 
                href={card.href}
                className="group flex flex-col justify-between p-8 md:p-10 rounded-[2.5rem] shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: card.bg }}
              >
                <div className="relative z-10">
                  <h2 className="text-3xl font-extrabold mb-6 text-white leading-tight">
                    {card.title}
                  </h2>
                  <p className="text-xl font-medium text-white/90 leading-relaxed mb-8">
                    {card.description}
                  </p>
                </div>
                <div className="mt-auto flex justify-end relative z-10">
                  <div 
                    className="px-6 py-3 rounded-full font-bold text-lg inline-flex items-center gap-3 text-white transition-transform group-hover:scale-105"
                    style={{ backgroundColor: card.buttonBg }}
                  >
                    {card.buttonText}
                    <ArrowRight className="h-6 w-6" />
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
