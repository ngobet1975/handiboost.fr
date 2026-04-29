import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { QuizClient } from '@/components/QuizClient';

export const metadata: Metadata = {
  title: 'Testez vos connaissances sur le Sport-Santé | Handiboost',
  description: 'Évaluez vos connaissances sur l\'Activité Physique Adaptée (APA) et le sport-santé avec notre quiz interactif.',
  alternates: {
    canonical: '/pratiquants/tester-ses-connaissances',
  }
};

export default function TestersesconnaissancesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <Link href="/pratiquants" className="hover:text-blue-800 hover:underline transition-all">Pratiquants</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Testez vos connaissances</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-16">
        {/* Hero Section */}
        <section className="mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Testez vos connaissances
          </h1>
          <p className="text-2xl text-slate-700 font-medium leading-relaxed">
            Pensez-vous tout savoir sur l'Activité Physique Adaptée ? Faites le test !
          </p>
        </section>

        {/* Composant Quiz Client */}
        <QuizClient />
      </div>
    </div>
  );
}
