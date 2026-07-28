import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { HandiAssistantLoader } from '@/components/HandiAssistantLoader';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trouver une activité — HandiAssistant · Handiboost',
  description: 'HandiAssistant vous guide par la conversation pour trouver l\'activité sportive adaptée à votre handicap. Interface accessible : voix, grand texte, contraste élevé.',
  alternates: { canonical: '/pratiquants/ou-pratiquer' },
};

export default function OuPratiquerPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <Link href="/pratiquants" className="hover:text-blue-800 hover:underline transition-all">Pratiquants</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Trouver une activité</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 md:mt-14">

        {/* Hero */}
        <section className="mb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-5 leading-tight tracking-tight">
            Trouvez<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500">
              votre activité
            </span>
          </h1>
          <p className="text-slate-600 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            HandiAssistant vous guide par la conversation.
            <br />
            <span className="text-slate-500 text-base">Voix, grand texte, contraste élevé — pour tout le monde.</span>
          </p>
        </section>

        {/* HandiAssistant — composant principal */}
        <HandiAssistantLoader />

        {/* Lien vers l'annuaire classique */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm font-medium mb-3">Préférez-vous consulter les annuaires directement ?</p>
          <Link
            href="/pratiquants/ou-pratiquer/annuaires"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm border-2 border-slate-200 hover:border-slate-300 px-6 py-3 rounded-xl transition-all hover:bg-white bg-white/50 shadow-sm"
          >
            Voir tous les annuaires partenaires <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
