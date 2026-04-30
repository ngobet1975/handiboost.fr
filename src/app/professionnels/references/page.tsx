import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { FileText, Scale, Landmark, ExternalLink, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Références et Textes Officiels | Espace Professionnels',
  description: 'Consultez les textes de loi, décrets et recommandations de la HAS concernant la prescription du Sport Santé.',
};

export default function ReferencesPage() {
  const references = [
    {
      title: "Loi Sport sur Ordonnance (2016)",
      source: "Loi n° 2016-41 de modernisation du système de santé",
      description: "Permet au médecin traitant de prescrire une activité physique adaptée à la pathologie, aux capacités physiques et au risque médical du patient atteint d'une Affection de Longue Durée (ALD).",
      icon: <Scale className="w-8 h-8 text-orange-600" />,
      colorClass: "bg-orange-50 border-orange-200",
      linkText: "Consulter la loi",
      url: "https://www.legifrance.gouv.fr/"
    },
    {
      title: "Guide de Prescription HAS (2022)",
      source: "Haute Autorité de Santé",
      description: "Guide de promotion, consultation et prescription médicale d'activité physique et sportive pour la santé. Intègre les outils d'évaluation et les arbres décisionnels.",
      icon: <Landmark className="w-8 h-8 text-blue-600" />,
      colorClass: "bg-blue-50 border-blue-200",
      linkText: "Télécharger le guide",
      url: "https://www.has-sante.fr/"
    },
    {
      title: "Décret d'application APA (2016)",
      source: "Décret n° 2016-1990 du 30 décembre 2016",
      description: "Précise les conditions de dispensation de l'activité physique adaptée prescrite par le médecin traitant et les qualifications requises pour les intervenants.",
      icon: <FileText className="w-8 h-8 text-emerald-600" />,
      colorClass: "bg-emerald-50 border-emerald-200",
      linkText: "Lire le décret",
      url: "https://www.legifrance.gouv.fr/"
    },
    {
      title: "Stratégie Nationale Sport Santé",
      source: "Ministère des Sports et Ministère de la Santé",
      description: "Feuille de route gouvernementale (2019-2024) visant à promouvoir l'activité physique pour lutter contre l'accroissement de la sédentarité et les maladies chroniques.",
      icon: <FileText className="w-8 h-8 text-purple-600" />,
      colorClass: "bg-purple-50 border-purple-200",
      linkText: "Voir la stratégie",
      url: "https://www.sports.gouv.fr/"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/professionnels" className="flex items-center gap-2 hover:text-orange-600 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Retour à l'Espace Pro
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 md:mt-16">
        
        {/* Header Section */}
        <section className="mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-3xl mb-6">
            <FileText className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Textes Officiels et Références
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-3xl">
            Retrouvez ici la base documentaire réglementaire et les recommandations institutionnelles encadrant la prescription de l'Activité Physique Adaptée en France.
          </p>
        </section>

        {/* References Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {references.map((ref, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col h-full bg-white rounded-[2rem] p-8 shadow-lg border-2 ${ref.colorClass} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  {ref.icon}
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-800 mb-2">{ref.title}</h2>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{ref.source}</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  {ref.description}
                </p>
              </div>

              <a 
                href={ref.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-between w-full px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-colors group"
              >
                {ref.linkText}
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
