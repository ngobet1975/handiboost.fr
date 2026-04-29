import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, MapPin, Calendar, Coins, Stethoscope, Lightbulb, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Espace Pratiquants | Handiboost',
  description: 'Trouvez une activité physique adaptée, un événement, ou des aides financières pour votre pratique sportive.',
  alternates: {
    canonical: '/pratiquants',
  }
};

export default function PratiquantsHubPage() {
  const cards = [
    {
      title: "Trouver une activité",
      description: "Trouver une activité, un club ou un enseignant en APA près de chez vous.",
      href: "/pratiquants/ou-pratiquer",
      icon: <MapPin className="h-10 w-10 text-white" />,
      colorClass: "bg-blue-800 hover:bg-blue-900 border-blue-900",
      textColor: "text-white"
    },
    {
      title: "Lire les conseils",
      description: "Lire nos fiches santé pour pratiquer en toute sécurité.",
      href: "/pratiquants/conseils-par-pathologie",
      icon: <Stethoscope className="h-10 w-10 text-white" />,
      colorClass: "bg-purple-700 hover:bg-purple-800 border-purple-800",
      textColor: "text-white"
    },
    {
      title: "Voir les aides",
      description: "Comprendre comment financer votre pratique sportive.",
      href: "/pratiquants/aides-financieres",
      icon: <Coins className="h-10 w-10 text-white" />,
      colorClass: "bg-sky-600 hover:bg-sky-700 border-sky-700",
      textColor: "text-white"
    },
    {
      title: "Voir les événements",
      description: "Découvrir les ateliers, rencontres et événements sportifs à venir.",
      href: "/pratiquants/evenements",
      icon: <Calendar className="h-10 w-10 text-white" />,
      colorClass: "bg-orange-600 hover:bg-orange-700 border-orange-700",
      textColor: "text-white"
    },
    {
      title: "Faire le quiz",
      description: "Faire le quiz pour tout savoir sur l'Activité Physique Adaptée.",
      href: "/pratiquants/tester-ses-connaissances",
      icon: <Lightbulb className="h-10 w-10 text-white" />,
      colorClass: "bg-pink-600 hover:bg-pink-700 border-pink-700",
      textColor: "text-white"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Pratiquants</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-16">
        
        {/* Hero Section Minimaliste */}
        <section className="mb-16 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Espace Pratiquants
          </h1>
          <p className="text-2xl text-slate-700 font-medium leading-relaxed">
            Trouvez rapidement une activité sportive, un événement près de chez vous, ou des conseils santé pour bouger en toute sécurité.
          </p>
        </section>

        {/* Grille de Cartes */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, idx) => (
            <Link 
              key={idx} 
              href={card.href}
              className={`group flex flex-col justify-between p-8 md:p-10 rounded-[2.5rem] shadow-lg border-b-8 transition-all hover:-translate-y-2 hover:shadow-2xl ${card.colorClass}`}
            >
              <div>
                <div className="mb-8">
                  {card.icon}
                </div>
                <h2 className={`text-3xl font-extrabold mb-4 ${card.textColor}`}>
                  {card.title}
                </h2>
                <p className={`text-xl font-medium opacity-90 ${card.textColor}`}>
                  {card.description}
                </p>
              </div>
              <div className={`mt-10 flex justify-end ${card.textColor}`}>
                <div className="bg-white/20 p-4 rounded-full group-hover:bg-white/40 transition-colors">
                  <ArrowRight className="h-8 w-8" />
                </div>
              </div>
            </Link>
          ))}
        </section>

      </div>
    </div>
  );
}
