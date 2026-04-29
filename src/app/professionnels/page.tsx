import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, BookOpen, FileText, HeartHandshake, ShieldCheck, Stethoscope } from 'lucide-react';

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
      colorClass: "bg-blue-800 hover:bg-blue-900 border-blue-900",
      textColor: "text-white",
      buttonText: "Voir l'aide à la prescription"
    },
    {
      title: "Le Guide Booster",
      description: "Accéder à l'annuaire réservé aux professionnels.",
      href: "/professionnels/guide-booster",
      icon: <ShieldCheck className="h-10 w-10 text-white" />,
      colorClass: "bg-purple-700 hover:bg-purple-800 border-purple-800",
      textColor: "text-white",
      buttonText: "Accéder au Guide Booster"
    },
    {
      title: "Outils d'accompagnement",
      description: "Retrouver tests, questionnaires et supports pédagogiques.",
      href: "/professionnels/outils-accompagnement",
      icon: <HeartHandshake className="h-10 w-10 text-white" />,
      colorClass: "bg-sky-600 hover:bg-sky-700 border-sky-700",
      textColor: "text-white",
      buttonText: "Voir les outils"
    },
    {
      title: "Références",
      description: "Consulter les textes et recommandations officielles.",
      href: "/professionnels/references",
      icon: <FileText className="h-10 w-10 text-white" />,
      colorClass: "bg-orange-600 hover:bg-orange-700 border-orange-700",
      textColor: "text-white",
      buttonText: "Consulter les références"
    },
    {
      title: "Formateurs",
      description: "Trouver un formateur pour accompagner les clubs et structures sportives.",
      href: "/professionnels/formateurs",
      icon: <BookOpen className="h-10 w-10 text-white" />,
      colorClass: "bg-pink-600 hover:bg-pink-700 border-pink-700",
      textColor: "text-white",
      buttonText: "Trouver un formateur"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Professionnels</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-16">
        
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
              <div className={`mt-10 flex justify-start ${card.textColor}`}>
                <div className="bg-white/20 px-6 py-3 rounded-full font-bold text-lg inline-flex items-center gap-3 group-hover:bg-white/40 transition-colors">
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
