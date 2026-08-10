import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, FileText, HeartHandshake, ShieldCheck, Stethoscope } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Espace Professionnels | Handiboost',
  description: 'Ressources, outils et informations pour les professionnels de santé, prescripteurs et éducateurs sportifs.',
  alternates: {
    canonical: '/professionnels',
  }
};

export default function ProfessionnelsHubPage() {
  const cards = [
    {
      title: "Prescrire l'APA",
      description: "Comprendre les étapes et trouver les ressources utiles.",
      href: "/professionnels/prescription-apa",
      icon: <Stethoscope className="h-10 w-10 text-white" />,
      bg: "#1566B1",
      buttonBg: "#3B89D1",
      textColor: "text-white",
      buttonText: "Voir l'aide à la prescription"
    },
    {
      title: "Le Guide Booster",
      description: "Accéder à l'annuaire réservé aux professionnels.",
      href: "/professionnels/guide-booster",
      icon: <ShieldCheck className="h-10 w-10 text-white" />,
      bg: "#ED1B5F",
      buttonBg: "#E96282",
      textColor: "text-white",
      buttonText: "Accéder au Guide Booster"
    },
    {
      title: "Outils d'accompagnement",
      description: "Retrouver tests, questionnaires et supports pédagogiques.",
      href: "/professionnels/outils-accompagnement",
      icon: <HeartHandshake className="h-10 w-10 text-white" />,
      bg: "#FBA91C",
      buttonBg: "#FFBD4B",
      textColor: "text-white",
      buttonText: "Voir les outils"
    },
    {
      title: "Références",
      description: "Consulter les textes et recommandations officielles.",
      href: "/professionnels/references",
      icon: <FileText className="h-10 w-10 text-white" />,
      bg: "#654B9E",
      buttonBg: "#8F77C4",
      textColor: "text-white",
      buttonText: "Consulter les références"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative overflow-hidden">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Professionnels</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-16 relative z-10">
        
        {/* Hero Section */}
        <section className="mb-16 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Espace Professionnels
          </h1>
          <p className="text-2xl text-slate-700 font-medium leading-relaxed">
            Trouvez les outils, la documentation et les informations nécessaires pour prescrire l'Activité Physique Adaptée (APA) et accompagner les personnes dans une pratique adaptée.
          </p>
        </section>

        {/* Grille de Cartes */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-20">
          {cards.map((card, idx) => (
            <Link 
              key={idx} 
              href={card.href}
              className={`group flex flex-col justify-between p-8 md:p-10 rounded-[2.5rem] shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl`}
              style={{ backgroundColor: card.bg }}
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
              <div className={`mt-10 flex justify-start ${card.textColor}`}>
                <div 
                  className="px-6 py-3 rounded-full font-bold text-lg inline-flex items-center gap-3 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: card.buttonBg }}
                >
                  {card.buttonText}
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>
            </Link>
          ))}
        </section>

      </div>
    </div>
  );
}
