import React from "react";
import Link from "next/link";
import { ChevronLeft, Wrench, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Outils d'Accompagnement APA | Espace Professionnels Handiboost",
  description: "Ressources, bilans, tests et supports pédagogiques pour les professionnels du sport adapté et de la santé.",
};

export default function OutilsAccompagnementPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Breadcrumb / Back */}
        <div className="mb-8">
          <Button 
            nativeButton={false}
            variant="ghost" 
            render={<Link href="/professionnels" className="text-slate-500 hover:text-slate-800 font-medium text-base px-0" />}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour à l'espace Professionnels
          </Button>
        </div>

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight flex items-center gap-4">
            <Wrench className="w-10 h-10 md:w-12 md:h-12 text-blue-700 shrink-0" />
            <span>Boîte à outils <span className="text-blue-700">d'accompagnement</span></span>
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-3xl">
            Retrouvez des ressources et outils pour accompagner vos bénéficiaires dans la pratique d’une activité physique adaptée et soutenir leur suivi au quotidien.
          </p>
        </section>

        {/* Outils de l'enseignant en APA (ONAPS) */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b-2 border-slate-200 pb-4">
            Outils de l'enseignant en APA (ONAPS)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sensibiliser</h3>
              <p className="text-slate-600 mb-6 flex-grow">Ressources, définitions et recommandations pour sensibiliser à l'APA.</p>
              <a href="https://onaps.fr/sensibiliser/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-700 font-bold hover:text-blue-900 group">
                Portail Sensibiliser <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Évaluer</h3>
              <p className="text-slate-600 mb-6 flex-grow">Tests de condition physique et questionnaires (GPAQ, IPAQ, etc.) pour vos bilans.</p>
              <a href="https://onaps.fr/evaluer/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-700 font-bold hover:text-blue-900 group">
                Portail Évaluer <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Mettre en place</h3>
              <p className="text-slate-600 mb-6 flex-grow">Boîte à idées et ressources pour concevoir et structurer vos séances d'APA.</p>
              <a href="https://onaps.fr/mettre-en-place/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-700 font-bold hover:text-blue-900 group">
                Portail Mettre en place <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* Outils Pédagogiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b-2 border-slate-200 pb-4">
            Outils Pédagogiques
          </h2>
          <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Guide ALLIANCE (ONAPS)</h3>
            <p className="text-blue-800 mb-8 max-w-2xl text-lg">
              Téléchargez les livrets du programme ALLIANCE de l'ONAPS, conçus pour accompagner la pratique de l'Activité Physique Adaptée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button nativeButton={false} render={<a href="https://onaps.fr/wp-content/uploads/2021/04/Livret_Pratiquant_Alliance.pdf" target="_blank" rel="noopener noreferrer" />} className="bg-blue-700 hover:bg-blue-800 text-white font-bold h-14 rounded-xl px-8 shadow-sm">
                <Download className="mr-2 w-5 h-5" /> Livret Pratiquant
              </Button>
              <Button nativeButton={false} render={<a href="https://onaps.fr/wp-content/uploads/2021/04/Livret_Pro_Alliance.pdf" target="_blank" rel="noopener noreferrer" />} className="bg-blue-700 hover:bg-blue-800 text-white font-bold h-14 rounded-xl px-8 shadow-sm">
                <Download className="mr-2 w-5 h-5" /> Livret Professionnel
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
