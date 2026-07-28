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
    <div className="min-h-screen bg-gradient-to-b from-[#0c0c1d] via-[#0f0e2a] to-slate-950 pb-20">
      {/* Fil d'Ariane */}
      <div className="bg-white/5 border-b border-white/10 py-4 px-6 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm font-bold text-white/50">
          <Link href="/" className="hover:text-white/80 transition-colors">Accueil</Link>
          <span>›</span>
          <Link href="/pratiquants" className="hover:text-white/80 transition-colors">Pratiquants</Link>
          <span>›</span>
          <span className="text-white/80">Trouver une activité</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 md:mt-14">

        {/* Hero */}
        <section className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold text-sm px-5 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Assistant IA · Inclusif · Accessible
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight tracking-tight">
            Trouvez<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-teal-400">
              votre activité
            </span>
          </h1>
          <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            HandiAssistant vous guide par la conversation.
            <br />
            <span className="text-white/40 text-base">Voix, grand texte, contraste élevé — pour tout le monde.</span>
          </p>
        </section>

        {/* HandiAssistant — composant principal */}
        <HandiAssistantLoader />

        {/* Lien vers l'annuaire classique */}
        <div className="mt-12 text-center">
          <p className="text-white/30 text-sm font-medium mb-3">Préférez-vous consulter les annuaires directement ?</p>
          <Link
            href="/pratiquants/ou-pratiquer/annuaires"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 font-bold text-sm border border-white/10 hover:border-white/30 px-6 py-3 rounded-xl transition-all hover:bg-white/5"
          >
            Voir tous les annuaires partenaires <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
