import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Boîte à outils d\'accompagnement | Handiboost',
  description: 'Retrouvez des ressources et outils pour accompagner vos bénéficiaires dans la pratique d\'une activité physique adaptée et soutenir leur suivi au quotidien.',
  alternates: {
    canonical: '/professionnels/outils-accompagnement',
  }
};

export default async function OutilsAccompagnementPage() {
  let outils = [];
  try {
    outils = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/outils-accompagnement.json'), 'utf8'));
  } catch (error) {
    console.error("Erreur de chargement du JSON outils:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative overflow-hidden">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <Link href="/professionnels" className="hover:text-blue-800 hover:underline transition-all">Professionnels</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Boîte à outils d'accompagnement</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-16 relative z-10">
        
        {/* Hero Section */}
        <section className="mb-16 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Boîte à outils <span style={{ color: '#654B9E' }}>d'accompagnement</span>
          </h1>
          <p className="text-2xl text-slate-700 font-medium leading-relaxed">
            Retrouvez des ressources et outils pour accompagner vos bénéficiaires dans la pratique d’une activité physique adaptée et soutenir leur suivi au quotidien.
          </p>
        </section>

        {/* Encadrés dynamiques */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {outils.map((outil: any, idx: number) => (
            <div 
              key={idx} 
              className="rounded-[2.5rem] shadow-xl p-8 flex flex-col transition-transform hover:-translate-y-2 relative overflow-hidden"
              style={{ backgroundColor: outil.bgColor }}
            >
              <h2 className={`text-3xl font-extrabold mb-6 ${outil.titleColor}`}>
                {outil.title}
              </h2>
              <p className={`text-xl font-medium leading-relaxed mb-10 ${outil.descriptionColor}`}>
                {outil.description}
              </p>
              
              <div className="mt-auto space-y-4">
                {outil.buttons.map((btn: any, btnIdx: number) => (
                  <a
                    key={btnIdx}
                    href={btn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-4 rounded-full font-bold text-lg shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: btn.bgColor, color: btn.textColor || '#fff' }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {btn.label}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
